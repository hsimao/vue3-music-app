import { PLAY_MODE, FAVORITE_KEY, SEARCH_KEY } from '@/assets/js/constant'
import { load } from '@/assets/js/array-store'
const state = {
  sequenceList: [], // 原始曲目列表
  playlist: [], // 播放列表(順序可能是隨機)
  favoriteList: load(FAVORITE_KEY), // 收藏歌曲列表
  playing: false,
  playMode: PLAY_MODE.sqeuence,
  currentIndex: 0,
  fullScreen: false,
  searchHistory: load(SEARCH_KEY)
}

export default state
