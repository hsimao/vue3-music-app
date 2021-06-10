import MusicList from '@/components/MusicList/MusicList'
import storage from 'good-storage'
import { processSongs } from '@/service/song'

export default function createDetailComponent({ name, storageKey, fetch }) {
  return {
    name,
    components: {
      MusicList
    },
    props: {
      data: {
        type: Object,
        default: () => null
      }
    },
    data() {
      return {
        songs: [],
        loading: true
      }
    },
    computed: {
      cacheData() {
        let result = null
        const data = this.data

        if (data) {
          result = data
        } else {
          const cached = storage.session.get(storageKey)
          let cachedId = cached.mid || cached.id
          cachedId += ''
          if (cachedId === this.dataMid) {
            result = cached
          }
        }

        return result
      },
      pic() {
        return this.cacheData?.pic
      },
      title() {
        return this.cacheData?.name || this.cacheData?.title
      },
      dataMid() {
        return this.$route.params.id
      }
    },
    async created() {
      await this.init()
    },
    methods: {
      async init() {
        const data = this.cacheData
        if (!data) {
          // 回到第一層路由
          const firstLevelPath = this.$route.matched[0].path
          return this.$router.push(firstLevelPath)
        }
        try {
          const result = await fetch(data)
          this.songs = await processSongs(result.songs)
        } catch (err) {
          console.log(err)
        } finally {
          this.loading = false
        }
      }
    }
  }
}
