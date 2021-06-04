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
          'http://isure.stream.qqmusic.qq.com/C400000Ac8aD1ExGCR.m4a?guid=4934724032&vkey=7D08D5C14B176702B36FDE8F11D428C03DC3A78C2D6095C82969B93D41C09FE9FDB1C83A20D73B97699718321C3E122B7EE0B16668E2DFB5&uin=&fromtag=38'
        return song
      })
      .filter(song => song.url && song.url.indexOf('vkey') > -1)
  })
}
