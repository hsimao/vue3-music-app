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
          'http://isure.stream.qqmusic.qq.com/C400002Q0Pgw09MNCg.m4a?guid=8566865110&vkey=315C96FB2E5A35F7E350DFD853A01C1FFA87A101AD3C363C6009E9B66698B00F3470BA3EC71EDFCA23F285A863A1A10735A83D3AF1607EEC&uin=&fromtag=38'
        return song
      })
      .filter(song => song.url && song.url.indexOf('vkey') > -1)
  })
}

const lyricMap = {}

export function getLyric(song) {
  if (song.lyric) {
    return Promise.resolve(song.lyric)
  }
  if (lyricMap[song.mid]) {
    return Promise.resolve(lyricMap[song.mid])
  }

  return get('/api/getLyric', {
    mid: song.mid
  }).then(result => {
    lyricMap[song.mid] = result?.lyric

    return lyricMap[song.mid]
      ? lyricMap[song.mid]
      : '[00:00:00]該歌曲暫時無法獲取歌曲'
  })
}
