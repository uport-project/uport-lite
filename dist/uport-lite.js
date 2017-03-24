(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("UportLite", [], factory);
	else if(typeof exports === 'object')
		exports["UportLite"] = factory();
	else
		root["UportLite"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {// base-x encoding
// Forked from https://github.com/cryptocoinjs/bs58
// Originally written by Mike Hearn for BitcoinJ
// Copyright (c) 2011 Google Inc
// Ported to JavaScript by Stefan Thomas
// Merged Buffer refactorings from base58-native by Stephen Pair
// Copyright (c) 2013 BitPay Inc

var ByteArray = global && global['Buffer'] ? global['Buffer'] : Uint8Array

module.exports = function base (ALPHABET) {
  var ALPHABET_MAP = {}
  var BASE = ALPHABET.length
  var LEADER = ALPHABET.charAt(0)

  // pre-compute lookup table
  for (var z = 0; z < ALPHABET.length; z++) {
    var x = ALPHABET.charAt(z)

    if (ALPHABET_MAP[x] !== undefined) throw new TypeError(x + ' is ambiguous')
    ALPHABET_MAP[x] = z
  }

  function encode (source) {
    if (source.length === 0) return ''

    var digits = [0]
    for (var i = 0; i < source.length; ++i) {
      for (var j = 0, carry = source[i]; j < digits.length; ++j) {
        carry += digits[j] << 8
        digits[j] = carry % BASE
        carry = (carry / BASE) | 0
      }

      while (carry > 0) {
        digits.push(carry % BASE)
        carry = (carry / BASE) | 0
      }
    }

    var string = ''

    // deal with leading zeros
    for (var k = 0; source[k] === 0 && k < source.length - 1; ++k) string += ALPHABET[0]
    // convert digits to a string
    for (var q = digits.length - 1; q >= 0; --q) string += ALPHABET[digits[q]]

    return string
  }

  function decodeUnsafe (string) {
    if (string.length === 0) return new ByteArray(0)

    var bytes = [0]
    for (var i = 0; i < string.length; i++) {
      var value = ALPHABET_MAP[string[i]]
      if (value === undefined) return

      for (var j = 0, carry = value; j < bytes.length; ++j) {
        carry += bytes[j] * BASE
        bytes[j] = carry & 0xff
        carry >>= 8
      }

      while (carry > 0) {
        bytes.push(carry & 0xff)
        carry >>= 8
      }
    }

    // deal with leading zeros
    for (var k = 0; string[k] === LEADER && k < string.length - 1; ++k) {
      bytes.push(0)
    }

    return ByteArray.from(bytes.reverse())
  }

  function decode (string) {
    var buffer = decodeUnsafe(string)
    if (buffer) return buffer

    throw new Error('Non-base' + BASE + ' character')
  }

  return {
    encode: encode,
    decodeUnsafe: decodeUnsafe,
    decode: decode
  }
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = function(originalModule) {
	if(!originalModule.webpackPolyfill) {
		var module = Object.create(originalModule);
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		Object.defineProperty(module, "exports", {
			enumerable: true,
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 2 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 3 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["eaeDecode"] = eaeDecode;
var BASE58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
var base58 = __webpack_require__(0)(BASE58)
var hex = __webpack_require__(0)('0123456789abcdef')

const XMLHttpRequest = (typeof window !== 'undefined') ? window.XMLHttpRequest : __webpack_require__(2).XMLHttpRequest

const functionSignature = '0x447885f0'

// Legacy
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

function registryEncodingToIPFS (hexStr) {
  return base58.encode(hex.decode('1220' + hexStr.slice(2)))
}

// to avoid adding further dependencies we are not verifying checksum
function eaeDecode (encoded) {
  const data = base58.decode(encoded)
  const netLength = data.length - 24
  const network = data.slice(1, netLength)
  const address = data.slice(netLength, 20 + netLength)
  return {
    network: `0x${hex.encode(network)}`,
    address: `0x${hex.encode(address)}`
  }
}

const defaultNetworks = {
  '0x1': {
    registry: '0xab5c8051b9a1df1aab0149f8b0630848b7ecabf6',
    rpcUrl: 'https://mainnet.infura.io'
  },
  '0x3': {
    registry: '0x41566e3a081f5032bdcad470adb797635ddfe1f0',
    rpcUrl: 'https://ropsten.infura.io'
  },
  '0x2a': {
    registry: '0x5f8e9351dc2d238fb878b6ae43aa740d62fc9758',
    rpcUrl: 'https://kovan.infura.io'
  // },
  // '0x16B2': {
  //   registry: '',
  //   rpcUrl: 'https://infuranet.infura.io'
  }
}

function toBase58 (hexStr) {
  return base58.encode(hex.decode(hexStr))
}

function UportLite (opts = {}) {
  const infuraKey = opts.infuraKey || 'uport-lite-library'
  const ipfsGw = opts.ipfsGw || 'https://ipfs.infura.io/ipfs/'
  const networks = opts.networks ? Object.assign({}, defaultNetworks, opts.networks) : defaultNetworks
  
  function asciiToHex (string, delim) {
    return string.split('').map(function (c) {
      return ('0' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(delim || '')
  }

  function pad (pad, str, padLeft) {
    if (typeof str === 'undefined') {
      return pad
    }
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

  // TODO remove once feasible
  function callLegacyRegistry (address, callback) {
    const rpcUrl = `https://ropsten.infura.io/${infuraKey}`
    if (!address) return callback(null)
    return http({
      uri: rpcUrl,
      accept: 'application/json',
      data: {
        method: 'eth_call',
        params: [
          {to: '0xb9C1598e24650437a3055F7f66AC1820c419a679', data: (getAttributesData + address.slice(2))},
          'latest'
        ],
        id: 1,
        jsonrpc: '2.0'
      }
    }, (error, response) => {
      if (error) return callback(error)
      if (response.error) return callback(response.error)
      const hexHash = response.result.slice(130).slice(0, 68)
      return callback(null, toBase58(hexHash))
    })
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
      uri: `${rpcUrl}/${infuraKey}`,
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
      if (response.error) return callback(response.error)
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

    if (issuer.match(/0x[0-9a-fA-F]{40}/)) {
      return callLegacyRegistry(issuer, (error, ipfsHash) => {
        if (error) return callback(error)
        fetchIpfs(ipfsHash, callback)
      })
    } else {
      return callRegistry(registrationIdentifier, issuer, subject, (error, ipfsHash) => {
        if (error) return callback(error)
        fetchIpfs(ipfsHash, callback)
      })
    }
  }
  return get
}

module.exports = UportLite

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(1)(module)))

/***/ })
/******/ ]);
});