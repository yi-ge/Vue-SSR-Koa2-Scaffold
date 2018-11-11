import Vue from 'vue'
import Vuex from 'vuex'
import modules from './modules'
import axios from 'axios'
import conf from '../../../config/app'

Vuex.Store.prototype.$request = axios.create({
  baseURL: 'http://' + conf.app.devHost + ':' + conf.app.port,
  timeout: 1000
})

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export function createStore () {
  return new Vuex.Store({
    modules,
    strict: debug
  })
}
