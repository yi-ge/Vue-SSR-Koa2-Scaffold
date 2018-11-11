// initial state
const state = {
  text: ''
}

// getters
const getters = {

}

// actions
const actions = {
  async fetchVal ({ commit }) {
    const { data } = await this.$request.get('/api')
    commit('setVal', data)
  }
}

// mutations
const mutations = {
  setVal (state, val) {
    state.text = val
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
