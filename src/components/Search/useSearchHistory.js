import { save, remove, clear } from '@/assets/js/array-store'
import { SEARCH_KEY } from '@/assets/js/constant'
import { useStore } from 'vuex'

export default function useSearchHistory() {
  const store = useStore()
  const maxLength = 200

  const saveSearch = query => {
    const searches = save(query, SEARCH_KEY, item => item === query, maxLength)
    store.commit('setSearchHistory', searches)
  }

  const deleteSearch = query => {
    const searches = remove(SEARCH_KEY, item => item === query)
    store.commit('setSearchHistory', searches)
  }

  const clearAll = () => {
    const searches = clear(SEARCH_KEY)
    store.commit('setSearchHistory', searches)
  }

  return { saveSearch, deleteSearch, clearAll }
}
