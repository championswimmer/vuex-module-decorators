import { Mutation, Store } from 'vuex'

export function MutablePlugin(store: Store<any>) {
  for (let el in (store as any)._mutations) {
    if (el.startsWith('auto:')) {
      let comp = el.replace('auto:', '').split(':')
      let module = comp[0]
      let field = comp[1]

      if (store.state[module][field] !== undefined) {
        store.state[module]['_' + field] = store.state[module][field]
        let descriptor = Object.getOwnPropertyDescriptor(store.state[module], field)
        if (descriptor) {
          let rSet = descriptor.set
          let rGet = descriptor.get

          descriptor.set = (val) => {
            store.commit(el, val)
            if (rSet) rSet(val)
          }
          descriptor.get = () => {
            if (rGet) rGet()
            return store.state[module]['_' + field]
          }
          delete store.state[module][field]
          Object.defineProperty(store.state[module], field, descriptor)
        }
      }
    }
  }
}
