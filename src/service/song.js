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
          'http://isure.stream.qqmusic.qq.com/C400003Ww7Xi0VH81D.m4a?guid=3669601666&vkey=CFFEADF11E9849E363F9DEAD090BE6DF04E5BE101419ACCC4431984A565B16A76243D9B86D357322A723E52DFA93B6709FF87B86635B3C3C&uin=&fromtag=38'
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
