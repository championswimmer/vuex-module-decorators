# MutationActions

If you have understood how [Actions](./actions.html) and [Mutations](./muatations.html) work
you might have requirements for some functions that - 

1. first do an asynchronous action
2. and then commit the resultant value to the store via a mutation 

This is where a `@MutationAction` comes to picture. 


Here is a basic example 

```ts
import {VuexModule, Module, MutationAction} from 'vuex-module-decorators' 

@Module
class TypicodeModule extends VuexModule {
  posts: Post[] = [] 
  users: User[] = [] 

  @MutationAction 
  async function updatePosts() {
    const posts = await axios.get('https://jsonplaceholder.typicode.com/posts')

    return { posts }
  }
}

```

That gets converted to something like this 

```js 

const typicodeModule = {
  state: {
    posts: [],
    users: []
  },
  mutations: {
    updatePosts: function (state, posts) {
      state.posts = posts
    }
  },
  actions: {
    updatePosts: async function (context) {
      const posts = await axios.get('https://jsonplaceholder.typicode.com/posts')
      context.commit('updatePosts', posts)
    }
  }
}

```

:::tip NOTE
Note that if **S** denotes the type of _state_, then the object returned from a
`MutationAction` function must of type **Partial\<S\>** 
The keys present inside the return value (for eg, here `posts`) are replaced into
the store. 
:::

:::tip NOTE
When a `MutationAction` function returns `undefined`, the mutation part of the
`MutationAction` will not be called, and the state will remain the same.
:::
