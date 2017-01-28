import base58 from 'bs58'
import { Buffer } from 'buffer'

let XMLHttpRequest; // eslint-disable-line
if (typeof window !== 'undefined' && window.XMLHttpRequest) {
  // browser
  XMLHttpRequest = window.XMLHttpRequest // eslint-disable-line
} else {
  // node
  XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest // eslint-disable-line
}

const getAttributesData = '0x446d5aa4000000000000000000000000'

function http (opts) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest() // eslint-disable-line
    const options = opts || {}

    request.onreadystatechange = () => {
      if (request.readyState === 4 && request.timeout !== 1) {
        if (request.status !== 200) {
          reject(new Error(`[uport-lite] status ${request.status}: ${request.responseText}`))
        } else {
          try {
            resolve(JSON.parse(request.responseText))
          } catch (jsonError) {
            reject(new Error(`[uport-lite] while parsing data: '${String(request.responseText)}', error: ${String(jsonError)}`))
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
  })
}

function toBase58 (hexStr) {
  var buf = new Buffer(hexStr, 'hex')
  return base58.encode(buf)
}

function UportLite (opts = {}) {
  const registryAddress = opts.registryAddress || '0xb9C1598e24650437a3055F7f66AC1820c419a679'
  const ipfsGw = opts.ipfsGw || 'https://ipfs.infura.io/ipfs/'
  const rpcUrl = opts.rpcUrl || 'https://ropsten.infura.io/uport-lite-library'

  function callRegistry (address) {
    if (!address) return new Promise((resolve, reject) => resolve())
    return http({
      uri: rpcUrl,
      data: {
        method: 'eth_call',
        params: [
          {to: registryAddress, data: (getAttributesData + address.slice(2))},
          'latest'
        ],
        id: 1,
        jsonrpc: '2.0'
      }
    }).then(response => {
      const hexHash = response.result.slice(130).slice(0, 68)
      return toBase58(hexHash)
    })
  }

  function fetchIpfs (ipfsHash) {
    if (!ipfsHash || ipfsHash === '0x') return new Promise((resolve, reject) => resolve())
    return http({uri: `${ipfsGw}${ipfsHash}`})
  }

  function getAttributes (address) {
    return callRegistry(address).then(fetchIpfs)
  }
  return getAttributes
}

export default UportLite