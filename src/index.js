var BASE58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
var base58 = require('base-x')(BASE58)
var hex = require('base-x')('0123456789abcdef')

const XMLHttpRequest = require('./lib/XMLHttpRequest')

const getAttributesData = '0x446d5aa4000000000000000000000000'
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

export default function UportLite (opts = {}) {
  const registryAddress = opts.registryAddress || '0xb9C1598e24650437a3055F7f66AC1820c419a679'
  const ipfsGw = opts.ipfsGw || 'https://ipfs.infura.io/ipfs/'
  const rpcUrl = opts.rpcUrl || 'https://ropsten.infura.io/uport-lite-library'

  function callRegistry (address, callback) {
    if (!address) return callback(null)
    return http({
      uri: rpcUrl,
      accept: 'application/json',
      data: {
        method: 'eth_call',
        params: [
          {to: registryAddress, data: (getAttributesData + address.slice(2))},
          'latest'
        ],
        id: 1,
        jsonrpc: '2.0'
      }
    }, (error, response) => {
      if (error) return callback(error)
      const hexHash = response.result.slice(130).slice(0, 68)
      return callback(null, toBase58(hexHash))
    })
  }

  function fetchIpfs (ipfsHash, callback) {
    if (!ipfsHash || ipfsHash === '0x') return callback()
    return http({uri: `${ipfsGw}${ipfsHash}`}, callback)
  }

  function getAttributes (address, callback) {
    return callRegistry(address, (error, ipfsHash) => {
      if (error) return callback(error)
      fetchIpfs(ipfsHash, callback)
    })
  }
  return getAttributes
}

