export const getter = state => () => state

export const setter = state => ({ type, value, callback }) => {
  if (type === 0) {
    Object.keys(value).forEach(key => {
      state[key] = value[key]
    })
  } else if (type === 1) {
    state = {
      ...(state || {}),
      ...value
    }
  }
  callback && callback()
}
