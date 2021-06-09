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

export function changeMode({ commit, state, getters }, mode) {
  const currentId = getters.currentSong.id

  if (mode === PLAY_MODE.random) {
    commit('setPlaylist', shuffle(state.sequenceList))
  } else {
    commit('setPlaylist', state.sequenceList)
  }

  const index = state.playlist.findIndex(song => song.id === currentId)
  commit('setCurrentIndex', index)
  commit('setPlayMode', mode)
}

export function removeSong({ commit, state }, song) {
  const sequenceList = state.sequenceList.slice()
  const playlist = state.playlist.slice()

  const sequenceIndex = findIndex(sequenceList, song)
  const playIndex = findIndex(playlist, song)

  if (sequenceIndex === -1 || playIndex === -1) return

  sequenceList.splice(sequenceIndex, 1)
  playlist.splice(playIndex, 1)

  let currentIndex = state.currentIndex
  if (playIndex < currentIndex || currentIndex === playlist.length) {
    currentIndex--
  }

  commit('setSequenceList', sequenceList)
  commit('setPlaylist', playlist)
  commit('setCurrentIndex', currentIndex)
}

function findIndex(list, song) {
  return list.findIndex(item => item.id === song.id)
}
