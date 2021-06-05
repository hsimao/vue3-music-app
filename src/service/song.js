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
          'http://isure.stream.qqmusic.qq.com/C400002otIR30L2LZO.m4a?guid=6951366391&vkey=D238E49041FEDBFA886C65C8085F975F23A8A23968850CAF172DDFF840F4987210FEABEB608F5DCC38F6C6E99ABEE09674DD8E4BC25471C2&uin=&fromtag=38'
        return song
      })
      .filter(song => song.url && song.url.indexOf('vkey') > -1)
  })
}
