export const authStore = defineStore('authStore', {
  state: () => ({
    isAuthenticated: null
  }),
  actions: {
    setAuth(state) {
      this.isAuthenticated = state
    }
  }
})