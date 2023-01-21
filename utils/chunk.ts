export default (arr: any, size: number, cache: any[] = []) => {
  const tmp = [...arr]
  while (tmp.length) cache.push(tmp.splice(0, size))
  return cache
}
