import Taro from '@tarojs/taro'
import { observable, action } from 'mobx'
import { observer } from '@tarojs/mobx'
import { initData, loadMore, updateState, utils } from '@flowlist/js-core'
import { setter, getter } from './utils'

const Store = class {
  @observable state = utils.generateDefaultField()

  @action.bound
  initData({ func, type, query, uniqueKey, callback }) {
    return initData({
      getter: getter(this.state), setter: setter(this.state),
      func, type, query, uniqueKey, callback
    })
  }

  @action.bound
  loadMore({ type, func, query, uniqueKey, errorRetry, callback }) {
    return loadMore({
      getter: getter(this.state), setter: setter(this.state),
      func, type, query, uniqueKey, errorRetry, callback
    })
  }

  @action.bound
  updateState({ type, func, query, id, method, changeKey, value, uniqueKey }) {
    updateState({
      getter: getter(this.state), setter: setter(this.state),
      type, func, query, method, value, id, uniqueKey, changeKey
    })
  }
}

export const createStore = () => new Store()

export const reactive = observer

export const didMount = (self, opts = {}) => {
  if (!opts.className) {
    return
  }

  self.ob = Taro.createIntersectionObserver(self.$scope, {
    thresholds: [0]
  })

  self.ob.relativeToViewport({ bottom: 0 }).observe(`.${opts.className}`, (e) => {
    if (e.intersectionRatio <= 0) {
      return
    }

    if (!self.props.store.state.fetched) {
      self.props.store.initData(self.props.params)
      return
    }

    if (!opts.scrollView) {
      self.props.store.loadMore(self.props.params)
    }
  })
}

export const scrollBottomFn = (self) => {
  self.props.store.loadMore(self.props.params)
}

export const scrollTopFn = (self) => {
  self.props.store.loadMore({
    ...self.props.params,
    query: {
      ...(self.props.params.query || {}),
      is_up: 1
    }
  })
}

export const refreshFn = (self) => {
  self.props.store.initData({
    ...self.props.params,
    query: {
      ...(self.props.params.query || {}),
      __refresh__: true,
      __reload__: true
    }
  })
}

export const didUnmount = (self) => {
  self.ob && self.ob.disconnect()
}

export const defaultProps = {
  launch: true,
  bottom: true,
  append: false,
  scrollX: false,
  displayNoMore: false,
  enableBackToTop: false,
  refresherEnabled: false,
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
