import { PLAY_MODE } from '@/assets/js/constant'

const state = {
  sequenceList: [], // 原始曲目列表
  playlist: [], // 播放列表(順序可能是隨機)
  playing: false,
  playMode: PLAY_MODE.sqeuence,
  currentIndex: 0,
  fullScreen: false
}

export default state
