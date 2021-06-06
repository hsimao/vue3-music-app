import { get } from './base'

export function processSongs(songs) {
  if (!songs.length) {
    return Promise.resolve(songs)
  }

  return get('/api/getSongsUrl', {
    mid: songs.map(song => song.mid)
  }).then(result => {
    // const map = result.map
    return songs
      .map(song => {
        // song.url = map[song.mid]
        // 取得播放網址 api 有鎖 ip, 在此寫固定播放網址方便開發
        song.url =
          'http://isure.stream.qqmusic.qq.com/C400004AswpM0Yuu2b.m4a?guid=743761644&vkey=488DF4C40C7911A4543F75A970324CC7D7CEB0C9BF5868F3B300716F4A343BE2D197AEFB37DFA029B7FA43B9A4EA31AC1DAB8A94CDC0C448&uin=&fromtag=38'
        return song
      })
      .filter(song => song.url && song.url.indexOf('vkey') > -1)
  })
}
