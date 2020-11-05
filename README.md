# taro2-react-mobx

[![npm package](https://badge.fury.io/js/%40flowlist%2Ftaro2-react-mobx.svg)](https://www.npmjs.com/package/@flowlist/taro2-react-mobx)  [![License](https://gitlicense.com/badge/flowlist/taro2-react-mobx)](https://github.com/flowlist/taro2-react-mobx/blob/master/LICENSE)

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

- [className](https://github.com/flowlist/taro2-react-mobx/blob/main/src/store.js#L37)

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
            key={item.id}
            item={item}
          />
        ))
      }
    </ListView>
  )
}

export default createComponent(ListRender)
```

### Params
| Name | Type | Default | Description |
| --- | --- | --- | ---- |
| `*`func | function | - | 请求接口的函数，返回一个\<Promise\> |
| type | string | auto | `场景`值中的 type：`jump`、`page`、`sinceId`、`seenIds` |
| query | object | - | 需要透传到 API 层的数据 |
| uniqueKey | string | id | 每个元素在 v-for 的时候都需要一个 key，这个参数是 key 的键名 |


### ListView Props
```javascript
export const defaultProps = {
  launch: true,
  scrollX: false,
  displayNoMore: false,
  store: {
    state: {}
  },
  params: {}
}
```

### More detail
[@flowlist/js-core](https://github.com/flowlist/js-core)
[@flowlist/vue-listview](https://github.com/flowlist/vue-listview)


## Test
see：[@flowlist/js-core](https://github.com/flowlist/js-core)

## License

[MIT](https://github.com/flowlist/taro2-react-mobx/blob/master/LICENSE)
