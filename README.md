# Light weight library for fetching public uPort profiles

A uPort is an ethereum address representing an identity of a person, thing or other entitity.

A public profile is stored on ipfs at a hash registered in the [uPortRegistry](https://github.com/ConsenSys/uport-registry).

This library aims to let developers look up a profile for a given ethereum address and nothing else. It is designed to be tiny (<3k with all dependencies),
so you can easily add uport functionality to non Ethereum apps.

## Use

By default it uses the uport registry on the `ropsten` network as well as infura ipfs and jsonRpc gateways.

```javascript
import UportLite from 'uport-lite'

// UportLite is just a function returning a function. It is not a Class so don't use `new`
const registry = UportLite()

registry('0x3b2631d8e15b145fd2bf99fc5f98346aecdc394c', (error, profile) =>
  console.log(profile)
))
```

You can configure it passing options to the function:

```javascript
import UportLite from 'uport-lite'

const registry = UportLite({
  registryAddress: '0x022f41a91cb30d6a20ffcfde3f84be6c1fa70d60',
  ipfsGw: 'https://ipfs.infura.io/ipfs/',
  rpcUrl: 'https://mainnet.infura.io/INFURA_API_KEY'
})

registry('0x3b2631d8e15b145fd2bf99fc5f98346aecdc394c', (error, profile) =>
  console.log(profile)
))
```
