import Taro from '@tarojs/taro'
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

export const didMount = (self, {
  className
}) => {
  self.ob = Taro.createIntersectionObserver(self.$scope, {
    thresholds: [0]
  })

  self.ob.relativeToViewport({ bottom: 0 }).observe(`.${className}`, (e) => {
    if (e.intersectionRatio <= 0) {
      return
    }
    if (self.props.store.state && self.props.store.state.fetched) {
      self.props.store.loadMore(self.props.params)
    } else {
      self.props.store.initData(self.props.params)
    }
  })
}

export const didUnmount = (self) => {
  self.ob && self.ob.disconnect()
}

export const defaultProps = {
  launch: true,
  scrollX: false,
  displayNoMore: false,
  store: {
    state: {}
  },
  params: {}
}

export const convertProps = (self) => {
  const { launch, store, displayNoMore } = self.props
  const { state, state: { loading, nothing, noMore, fetched, error, total } } = store

  const showError = error && launch && !total
  const showNoMore = noMore && displayNoMore
  const showLaunch = loading && launch && !fetched

  return {
    showError,
    showLaunch,
    showNoMore,
    showLoading: loading,
    showNothing: nothing,
    state
  }
}
