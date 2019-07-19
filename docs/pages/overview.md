# Overview

<sponsor-cb-sidebar/>

## What it does ?

With this library, you can write `vuex` modules in this format -

```typescript
// eg. /app/store/posts.ts
import { VuexModule, Module } from 'vuex-module-decorators'
import { get } from 'axios'

@Module
export default class Posts extends VuexModule {
    posts: PostEntity[] = [] // initialise empty for now

    get totalComments (): number {
        return posts.filter((post) => {
            // Take those posts that have comments
            return post.comments && post.comments.length
        }).reduce((sum, post) => {
            // Sum all the lengths of comments arrays
            return sum + post.comments.length
        }, 0)
    }
    @Mutation
    updatePosts(posts: PostEntity[]) {
        this.posts = posts
    }

    @Action({commit: 'updatePosts'})
    async function fetchPosts() {
        return get('https://jsonplaceholder.typicode.com/posts')
    }
}
```

The resultant `/app/store/posts` file output would be

```javascript
// equivalent eg. /app/store/posts.js
module.exports = {
  state: {
    posts: []
  },
  getters: {
    totalComments: (state) => {
      return state.posts
        .filter((post) => {
          return post.comments && post.comments.length
        })
        .reduce((sum, post) => {
          return sum + post.comments.length
        }, 0)
    }
  },
  mutations: {
    updatePosts: (state, posts) => {
      // 'posts' is payload
      state.posts = posts
    }
  },
  actions: {
    fetchPosts: async (context) => {
      // the return of the function is passed as payload
      const payload = await get('https://jsonplaceholder.typicode.com/posts')
      // the value of 'commit' in decorator is the mutation used
      context.commit('updatePosts', payload)
    }
  }
}
```

## Benefits of type-safety

Instead of using the usual way to dispatch and commit ...

```javascript
store.commit('updatePosts', posts)
await store.dispatch('fetchPosts')
```

... which provide no typesafety for the payload and no autocomplete help in IDEs,
you can now use more type safe mechanism using the `getModule` accessor

```typescript
import { getModule } from 'vuex-module-decorators'
import Posts from `~/store/posts.js`

const postsModule = getModule(Posts)

// access posts
const posts = postsModule.posts

// use getters
const commentCount = postsModule.totalComments

// commit mutation
postsModule.updatePosts(newPostsArray)

// dispatch action
await postsModule.fetchPosts()
```
