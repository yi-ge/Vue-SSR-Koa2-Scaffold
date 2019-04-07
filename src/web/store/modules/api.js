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
    try {
      const { data } = await this.$request.get('http://127.0.0.1:3000/api')
      commit('setVal', data)
    } catch (err) {
      commit('setVal', 'Error')
    }
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
