import { useStore } from 'vuex'
import { PLAY_KEY } from '@/assets/js/constant'
import { save } from '@/assets/js/array-store'

export default function setPlayHistory() {
  const store = useStore()

  const maxLength = 200

  const savePlay = song => {
    const songs = save(song, PLAY_KEY, item => item.id === song.id, maxLength)
    store.commit('setPlayHistory', songs)
  }

  return { savePlay }
}
