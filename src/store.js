
import { createStore } from 'vuex'
import { generateRandomString } from './utils'
export default createStore({
  state() {
    return {
      posts: [],
      persons: [],
    }
  },
  mutations: {
    updatePosts(state, posts) {
      state.posts = posts
    },
    updatePost(state, postData) {
      const idx = state.posts.findIndex(post => post.guid === postData.guid)
      if (idx === -1) return
      state.posts[idx].name = postData.name
    },
    updatePersons(state, persons) {
      state.persons = persons
      state.persons.push({
        first: 'Chester',
        last: 'Agsamosam',
        guid: 'the-user',
        email: 'chesteragsamosam@gmail.com'
      })
    },
    deletePost(state, guid) {
      const idx = state.posts.findIndex(post => post.guid === guid)
      if (idx === -1) return
      state.posts.splice(idx, 1)
    },
    addComment(state, data) {
      const idx = state.posts.findIndex(post => post.guid === data.guid)
      if (idx === -1) return
      state.posts[idx].comments.push(data.comment)
    },
    addPost(state, name) {
      state.posts.unshift({
        comments: [],
        guid: generateRandomString(8),
        name
      })
    }
  },
  actions: {
    async fetchPosts({ commit }) {
      const res = await fetch(
        "https://atillc.blob.core.windows.net/data-collector/icode/test-data/topics.json"
      ).catch(() => {
        throw Error("Something went wrong");
      });
      const data = await res.json();
      commit('updatePosts', data.topics)
      commit('updatePersons', data.persons)
    }
  },
  getters: {
    getPosts(state) {
      return state.posts
    },
    getPersons(state) {
      return state.persons
    }
  }
})