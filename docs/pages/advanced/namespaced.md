# Namespaced Modules

:::tip
Before reading this, it is imperative you understand what are
[namespaced modules](https://vuex.vuejs.org/guide/modules.html#namespacing)
:::

If you intend to use your module in a namespaced way, then
you need to specify so in the `@Module` decorator.

```typescript {1,17}
@Module({ namespaced: true, name: 'mm' })
class MyModule extends VuexModule {
  wheels = 2

  @Mutation
  incrWheels(extra: number) {
    this.wheels += extra
  }

  get axles() {
    return this.wheels / 2
  }
}

const store = new Vuex.Store({
  modules: {
    mm: MyModule
  }
})
```

:::danger NOTE
The `name` field in the decorator should match the actual name
that you will assign the module to, when you create the store.

It isn't exactly elegant to manually keep these two same, but it
is important. We have to convert `this.store.dispatch('action')`
calls into `this.store.dispatch('name/action')`, and we need the
`name` to be correct in the decorator to make it work
:::

### Registering global actions inside namespaced modules
In order to [register actions of namespaced modules globally](https://vuex.vuejs.org/guide/modules.html#register-global-action-in-namespaced-modules
) you can add a parameter `root: true` to `@Action` and `@MutationAction` decorated methods.
```typescript {1,17}
@Module({ namespaced: true, name: 'mm' })
class MyModule extends VuexModule {
  wheels = 2

  @Mutation
  setWheels(wheels: number) {
    this.wheels = wheels
  }
  
  @Action({ root: true, commit: 'setWheels' })
  clear() {
    return 0
  }

  get axles() {
    return this.wheels / 2
  }
}

const store = new Vuex.Store({
  modules: {
    mm: MyModule
  }
})
```
This way the `@Action` _clear_ of `MyModule` will be called by dispatching `clear` although being in the namespaced module `mm`.
The same thing works for `@MutationAction` by just passing `{ root: true } ` to the decorator-options.

:::danger NOTE
When registering an action globally it can not be called by the namespace's name.
For the example that means, that the action can not be called by dispatching `mm/clear`!
:::
