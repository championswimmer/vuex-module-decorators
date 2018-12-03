import { Mutation, Payload, Store } from 'vuex'

export function MutablePlugin(store: Store<any>) {
  const storeModules = (store as any)._modules.root._children
  console.log(storeModules)
  for (let mod in storeModules) {
    for (let field in storeModules[mod].state) {
      if (field.startsWith('auto:')) {
        let name = field.replace('auto:', '')
        console.log(name)

        let mutationSig = 'auto:' + mod + ':' + name
        const mutation = [
          function(payload: Payload) {
            store.state[mod]['_' + name] = payload
          }
        ]
        ;(store as any)._mutations[mutationSig] = mutation
        let descriptor = Object.getOwnPropertyDescriptor(store.state[mod], field)
        if (descriptor) {
          store.state[mod]['_' + name] = store.state[mod][field]
          let rSet = descriptor.set
          let rGet = descriptor.get

          descriptor.set = (val) => {
            console.log('set')
            store.commit(mutationSig, val)
            if (rSet) rSet(val)
          }
          descriptor.get = () => {
            if (rGet) rGet()
            return store.state[mod]['_' + name]
          }
          delete store.state[mod][field]
          Object.defineProperty(store.state[mod], name, descriptor)
        }
      }
    }
  }
}
