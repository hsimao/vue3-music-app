import { PLAY_MODE } from '@/assets/js/constant'
import { shuffle } from '@/assets/js/utils'
// 依序播放
export function selectPlay({ commit }, { list, index }) {
  commit('setPlayMode', PLAY_MODE.sequence)
  commit('setSequenceList', list)
  commit('setPlaylist', list)
  commit('setPlaying', true)
  commit('setFullScreen', true)
  commit('setCurrentIndex', index)
}

// 隨機播放
export function randomPlay({ commit }, list) {
  commit('setPlayMode', PLAY_MODE.random)
  commit('setSequenceList', list)
  commit('setPlaylist', shuffle(list))
  commit('setPlaying', true)
  commit('setFullScreen', true)
  commit('setCurrentIndex', 0)
}
