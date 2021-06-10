import { get } from './base'

export function getHotKeys() {
  return get('/api/getHotKeys')
}
