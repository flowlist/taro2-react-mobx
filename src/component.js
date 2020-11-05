export const didMount = (className) => {
  this.ob = Taro.createIntersectionObserver(this.$scope, {
    thresholds: [0]
  })

  this.ob.relativeToViewport({ bottom: 0 }).observe(`.${className}`, (e) => {
    if (e.intersectionRatio <= 0) {
      return
    }
    if (this.props.store.state && this.props.store.state.fetched) {
      this.props.store.loadMore(this.props.params)
    } else {
      this.props.store.initData(this.props.params)
    }
  })
}

export const didUnmount = () => {
  this.ob && this.ob.disconnect()
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

export const convertProps = () => {
  const { launch, store, displayNoMore} = this.props
  const { state: { loading, nothing, noMore, fetched, error, total } } = store

  const showError = error && launch && !total
  const showNoMore = noMore && displayNoMore
  const showLaunch = loading && launch && !fetched

  return {
    showError,
    showLaunch,
    showNoMore,
    showLoading: loading,
    showNothing: nothing
  }
}
