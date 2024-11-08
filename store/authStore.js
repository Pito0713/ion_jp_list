export const authStore = defineStore('authStore', {
  state: () => ({
    isAuthenticated: false
  }),
  actions: {
    setAuth(state) {
      this.isAuthenticated = state
    }
  }
})