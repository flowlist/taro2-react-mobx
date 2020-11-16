export const getter = state => () => state

export const setter = state => ({ value, callback }) => {
  Object.keys(value).forEach(key => {
    state[key] = value[key]
  })
  callback && callback()
}
