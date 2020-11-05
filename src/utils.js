export const getter = state => () => state

export const setter = state => ({ type, value, callback }) => {
  if (type === 0) {
    state = value
  } else if (type === 1) {
    state = {
      ...(state || {}),
      ...value
    }
  }
  callback && callback()
}
