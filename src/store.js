import { useLocalStore, observer } from '@tarojs/mobx'
import { initData, loadMore, updateState, utils } from '@flowlist/js-core'
import { setter, getter } from './utils'

export const createStore = () => useLocalStore(() => ({
  state: utils.generateDefaultField(),
  initData({ func, type, query, uniqueKey, callback }) {
    return initData({
      getter: getter(this.state), setter: setter(this.state),
      func, type, query, uniqueKey, callback
    })
  },
  loadMore({ type, func, query, uniqueKey, errorRetry, callback }) {
    return loadMore({
      getter: getter(this.state), setter: setter(this.state),
      func, type, query, uniqueKey, errorRetry, callback
    })
  },
  updateState({ type, func, query, id, method, changeKey, value, uniqueKey }) {
    updateState({
      getter: getter(this.state), setter: setter(this.state),
      type, func, query, method, value, id, uniqueKey, changeKey
    })
  }
}))

export const createComponent = observer
