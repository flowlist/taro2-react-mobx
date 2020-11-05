import Taro, { PureComponent } from '@tarojs/taro'
import { View, Image, Block } from '@tarojs/components'
import './style.css'

class ListView extends PureComponent {
  componentDidMount () {
    this.ob = Taro.createIntersectionObserver(this.$scope, {
      thresholds: [0]
    })

    this.ob.relativeToViewport({ bottom: 0 }).observe('.list-view__shim', (e) => {
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

  componentWillUnmount () {
    this.ob && this.ob.disconnect()
  }

  render () {
    const { launch, displayNothing, store } = this.props
    const { state: { loading, nothing, noMore, fetched, error, total } } = store

    const showError = error && launch && !total
    const showNoMore = noMore && this.props.displayNoMore
    const showLaunch = loading && launch && !fetched

    return (
      <View className='list-view'>
        {
          showLaunch ? (
            <View className='list-view__state'>
              {
                this.props.loadingImage && <Image className='list-view__img' mode='aspectFit' src={this.props.loadingImage} />
              }
            </View>
          ) : nothing ? (
            <View className='list-view__state'>
              {
                launch && this.props.nothingImage && <Image className='list-view__img' mode='aspectFit' src={this.props.nothingImage} />
              }
              {
                displayNothing && <View className='list-view__txt'>这里什么都没有</View>
              }
            </View>
          ) : showError ? (
            <View className='list-view__state'>
              {
                this.props.errorImage && <Image className='list-view__img' mode='aspectFit' src={this.props.errorImage} />
              }
              <View className='list-view__txt'>{ error.message || '网络错误' }</View>
            </View>
          ) : <Block>
            {this.props.children}
            {
              showNoMore && <View className='list-view__tip'>没有更多了</View>
            }
          </Block>
        }
        <View className='list-view__shim' />
      </View>
    )
  }
}

ListView.defaultProps = {
  launch: true,
  displayNoMore: false,
  store: {
    state: {}
  },
  params: {},
  loadingImage: '',
  nothingImage: '',
  errorImage: ''
}

export default ListView
