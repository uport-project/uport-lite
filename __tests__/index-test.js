import UportLite from '../index'

const registry = UportLite()

it('finds valid profile', () => {
  return registry('0x3b2631d8e15b145fd2bf99fc5f98346aecdc394c').then(profile => {
    expect(profile.publicKey).toEqual('0x0482780d59037778ea03c7d5169dd7cf47a835cb6d57a606b4e6cf98000a28d20d6d6bfae223cc76fd2f63d8a382a1c054788c4fafb1062ee89e718b96e0896d40')
  })
})

it('returns null if it profile doesnt exist', () => {
  return registry('0x3b2631d8e15b145fd2bf99fc5f98346aecdc394d').then(profile => {
    expect(profile).toBeUndefined()
  })
})
