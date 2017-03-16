var BASE58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
var base58 = require('base-x-bytearray')(BASE58)
var hex = require('base-x-bytearray')('0123456789abcdef')

const XMLHttpRequest = (typeof window !== 'undefined') ? window.XMLHttpRequest : require('xmlhttprequest').XMLHttpRequest

const functionSignature = '0x447885f0'
function http (opts, callback) {
  const request = new XMLHttpRequest() // eslint-disable-line
  const options = opts || {}

  request.onreadystatechange = () => {
    if (request.readyState === 4 && request.timeout !== 1) {
      if (request.status !== 200) {
        callback(new Error(`[uport-lite] status ${request.status}: ${request.responseText}`))
      } else {
        try {
          callback(null, JSON.parse(request.responseText))
        } catch (jsonError) {
          callback(new Error(`[uport-lite] while parsing data: '${String(request.responseText)}', error: ${String(jsonError)}`))
        }
      }
    }
  }
  if (options.data) {
    request.open('POST', opts.uri)
  } else {
    request.open('GET', opts.uri)
  }

  if (options.accept) {
    request.setRequestHeader('accept', options.accept)
  }

  if (options.data) {
    request.setRequestHeader('Content-Type', `application/json`)
    request.send(JSON.stringify(options.data))
  } else {
    request.send()
  }
}

function toBase58 (hexStr) {
  return base58.encode(hex.decode(hexStr))
}

function registryEncodingToIPFS (hexStr) {
  return base58.encode(hex.decode('1220' + hexStr.slice(2)))
}

// to avoid adding further dependencies we are not verifying checksum
export function eaeDecode (encoded) {
  const data = base58.decode(encoded)
  const netLength = data.length - 24
  const network = data.slice(1, netLength)
  const address = data.slice(netLength, 20 + netLength)
  return {
    network: `0x${hex.encode(network)}`,
    address: `0x${hex.encode(address)}`
  }
}

const networks = {
  '0x1': {
    registry: '0xab5c8051b9a1df1aab0149f8b0630848b7ecabf6',
    rpcUrl: 'https://mainnet.infura.io'
  },
  '0x3': {
    registry: '0x41566e3a081f5032bdcad470adb797635ddfe1f0',
    rpcUrl: 'https://ropsten.infura.io'
  },
  '0x2a': {
    registry: '',
    rpcUrl: 'https://kovan.infura.io'
  }
}

function UportLite (opts = {}) {
  const infuraKey = opts.infuraKey || 'uport-lite-library'
  const ipfsGw = opts.ipfsGw || 'https://ipfs.infura.io/ipfs/'

  function asciiToHex (string, delim) {
    return string.split('').map(function (c) {
       return ('0' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(delim || '')
  };

  function pad (pad, str, padLeft) {
    if (typeof str === 'undefined')
      {return pad;}
    if (padLeft) {
      return (pad + str).slice(-pad.length)
    } else {
      return (str + pad).substring(0, pad.length)
    }
  }
  function encodeFunctionCall (functionSignature, registrationIdentifier, issuer, subject) {
    var callString = functionSignature
    callString += pad('0000000000000000000000000000000000000000000000000000000000000000', asciiToHex(registrationIdentifier))
    callString += pad('0000000000000000000000000000000000000000000000000000000000000000', issuer.slice(2), true)
    callString += pad('0000000000000000000000000000000000000000000000000000000000000000', subject.slice(2), true)
    return callString
  }

  function callRegistry (registrationIdentifier, issuerId, subjectId, callback) {
    const issuer = eaeDecode(issuerId)
    const subject = eaeDecode(subjectId)
    if (issuer.network !== subject.network) {
      throw new Error('Issuer and subject must be on the same network')
    }
    if (!networks[issuer.network]) {
      throw new Error(`Network id ${issuer.network} is not configured`)
    }
    const rpcUrl = networks[issuer.network].rpcUrl
    const registryAddress = networks[issuer.network].registry
    const callString = encodeFunctionCall(functionSignature, registrationIdentifier, issuer.address, subject.address)
    return http({
      uri: rpcUrl,
      accept: 'application/json',
      data: {
        method: 'eth_call',
        params: [
          {to: registryAddress, data: (callString)},
          'latest'
        ],
        id: 1,
        jsonrpc: '2.0'
      }
    }, (error, response) => {
      if (error) return callback(error)
      if (response.result == 0) return callback(error)
      return callback(null, registryEncodingToIPFS(response.result))
    })
  }

  function fetchIpfs (ipfsHash, callback) {
    if (!ipfsHash || ipfsHash === '0x') return callback()
    return http({uri: `${ipfsGw}${ipfsHash}`}, callback)
  }

  function get (issuer, callback, subjectAddress, registrationIdentifier = 'uPortProfileIPFS1220') {
    if (!issuer) return callback(null)
    const subject = subjectAddress || issuer

    return callRegistry(registrationIdentifier, issuer, subject, (error, ipfsHash) => {
      if (error) return callback(error)
      fetchIpfs(ipfsHash, callback)
    })
  }
  return get
}

module.exports = UportLite
