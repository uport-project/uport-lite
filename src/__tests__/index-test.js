import UportLite from '../index'
const registry = UportLite()
// uPortProfileIPFS1220 => 75506f727450726f66696c654950465331323230
//"uPortProfileIPFS1220","0x39F79c6511940bB54Ca69a659c929DdD5a4c679F","0x39F79c6511940bB54Ca69a659c929DdD5a4c679F"

it('finds valid default profile using old API', () => {
  return new Promise((resolve, reject) => {
    registry('0x39F79c6511940bB54Ca69a659c929DdD5a4c679F', (error, profile) => {
      if (error) return reject(error)
      resolve(profile)
    })
  }).then(profile => {
    return expect(profile.publicKey).toEqual('0x0466aa9f309dfb7624ae3b0a6b6ad6163145d977e088679252289816b90b2e5e9d58ea42a4b79f255731660d0c3e319a4fa54a6f1a73a88fd3c1b48a084269ab48')
  })
})

it('finds valid advanced profile using new API', () => {
  return new Promise((resolve, reject) => {
    registry('0x39F79c6511940bB54Ca69a659c929DdD5a4c679F', (error, profile) => {
      if (error) return reject(error)
      resolve(profile)
    }, '0x39F79c6511940bB54Ca69a659c929DdD5a4c679F', 'uPortProfileIPFS1220')
  }).then(profile => {
    return expect(profile.publicKey).toEqual('0x0466aa9f309dfb7624ae3b0a6b6ad6163145d977e088679252289816b90b2e5e9d58ea42a4b79f255731660d0c3e319a4fa54a6f1a73a88fd3c1b48a084269ab48')
  })
})

it('returns null if it profile doesnt exist', () => {
  return new Promise((resolve, reject) => {
    registry('0x3b2631d8e15b145fd2bf99fc5f98346aecdc394d', (error, profile) => {
      if (error) return reject(error)
      resolve(profile)
    })
  }).then(profile => {
    return expect(profile).toBeUndefined()
  })
})
