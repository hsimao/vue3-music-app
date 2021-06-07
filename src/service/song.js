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
          'http://isure.stream.qqmusic.qq.com/C400002z2pz700xhKy.m4a?guid=2927659970&vkey=0E5A0D760D0362066675AC741DD9F54E1A6265581DEF14842B3CA16FBCD1C9D48E9CF8359E2E06BA588FD37B2B03D989DB3EAA8EAB38F435&uin=&fromtag=38'
        return song
      })
      .filter(song => song.url && song.url.indexOf('vkey') > -1)
  })
}
