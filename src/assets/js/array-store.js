import storage from 'good-storage'

function inertArray(arr, val, compare, maxLength) {
  const index = arr.findIndex(compare)
  if (index > -1) return

  arr.unshift(val)

  if (maxLength && arr.length > maxLength) {
    arr.pop()
  }
}

function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

export function save(item, key, compare, maxLength) {
  const items = storage.get(key, [])
  inertArray(items, item, compare, maxLength)
  storage.set(key, items)
  return items
}

export function remove(key, compare) {
  const items = storage.get(key, [])
  deleteFromArray(items, compare)
  storage.set(key, items)
  return items
}

export function load(key) {
  return storage.get(key, [])
}

export function clear(key) {
  storage.remove(key)
  return []
}

export function saveAll(items, key) {
  storage.set(key, items)
}
