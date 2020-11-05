# taro2-react-mobx

### Install

``` shell
yarn add @tarojs/mobx
yarn add @flowlist/js-core
yarn add @flowlist/taro2-react-mobx
```

### ListView
```typescript jsx
import Taro, { PureComponent } from '@tarojs/taro'
import { View, Image, Block } from '@tarojs/components'
import { didMount, didUnmount, defaultProps, convertProps } from '@flowlist/taro2-react-mobx'
import Loading from '~/image/loading.gif'
import Nothing from '~/image/page_nothing.png'
import Error from '~/image/page_error.png'

class ListView extends PureComponent {
  componentDidMount () {
    didMount(this, {
      className: 'list-view__shim'
    })
  }

  componentWillUnmount () {
    didUnmount(this)
  }

  render () {
    const { launch, displayNothing } = this.props
    const { showError, showNoMore, showLaunch, showNothing, state } = convertProps(this)

    return (
      <View className='list-view'>
        {
          showLaunch ? (
            <View className='list-view__state'>
              <Image className='list-view__img' mode='aspectFit' src={Loading} />
            </View>
          ) : showNothing ? (
            <View className='list-view__state'>
              {
                launch && <Image className='list-view__img' mode='aspectFit' src={Nothing} />
              }
              {
                displayNothing && <View className='list-view__txt'>这里什么都没有</View>
              }
            </View>
          ) : showError ? (
            <View className='list-view__state'>
              <Image className='list-view__img' mode='aspectFit' src={Error} />
              <View className='list-view__txt'>{ state.error.message || '网络错误' }</View>
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

ListView.defaultProps = defaultProps

export default ListView
```

### ListRender
``` javascript
import { createStore, createComponent } from '@flowlist/taro2-react-mobx'
import ListView from '~/components/ListView'
import ListItem from '~/components/ListItem'
import { getData } from '~/api'

function ListRender(props) {
  const store = createStore()

  const { state } = store

  const params = {
    func: getData,
    query: props.query
  }

  return (
    <ListView store={store} params={params}>
      {
        state.result.map(item => (
          <ListItem
            key={item.slug}
            item={item}
            params={props.params}
          />
        ))
      }
    </ListView>
  )
}

export default createComponent(ListRender)
```
