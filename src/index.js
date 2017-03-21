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

function registryEncodingToIPFS(hexStr) {
  return base58.encode(hex.decode("1220" + hexStr.slice(2)))
}

function UportLite (opts = {}) {
  const registryAddress = opts.registryAddress || '0x5f8e9351dc2d238fb878b6ae43aa740d62fc9758'
  const ipfsGw = opts.ipfsGw || 'https://ipfs.infura.io/ipfs/'
  const rpcUrl = opts.rpcUrl || 'https://kovan.infura.io/uport-lite-library'

  function asciiToHex (string, delim) {
     return string.split("").map(function(c) {
         return ("0" + c.charCodeAt(0).toString(16)).slice(-2);
     }).join(delim || "");
  };

  function pad(pad, str, padLeft) {
    if (typeof str === 'undefined') 
      return pad;
    if (padLeft) {
      return (pad + str).slice(-pad.length);
    } else {
      return (str + pad).substring(0, pad.length);
    }
  }
  function encodeFunctionCall(functionSignature, registrationIdentifier, issuer, subject){
    var callString =  functionSignature;
    callString += pad("0000000000000000000000000000000000000000000000000000000000000000", asciiToHex(registrationIdentifier))
    callString += pad("0000000000000000000000000000000000000000000000000000000000000000", issuer.slice(2), true)
    callString += pad("0000000000000000000000000000000000000000000000000000000000000000", subject.slice(2), true)
    return callString
  }


  function callRegistry (registrationIdentifier, issuer, subject, callback) {
    var callString = encodeFunctionCall(functionSignature, registrationIdentifier, issuer, subject)
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

  function get(issuer, callback, subjectAddress, registrationIdentifier) {
    if (!issuer) return callback(null)
    var subject = subjectAddress || issuer
    var registrationIdentifier = registrationIdentifier || "uPortProfileIPFS1220"

    return callRegistry(registrationIdentifier, issuer, subject, (error, ipfsHash) => {
      if (error) return callback(error)
      fetchIpfs(ipfsHash, callback)
    })
  }
  return get
}

module.exports = UportLite
