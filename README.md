# taro2-react-mobx

[![npm package](https://badge.fury.io/js/%40flowlist%2Ftaro2-react-mobx.svg)](https://www.npmjs.com/package/@flowlist/taro2-react-mobx)  [![License](https://gitlicense.com/badge/flowlist/taro2-react-mobx)](https://github.com/flowlist/taro2-react-mobx/blob/master/LICENSE)

### Install

``` shell
yarn add mobx@5.15.7 @tarojs/mobx @tarojs/mobx-h5 @tarojs/mobx-rn
yarn add @flowlist/js-core @flowlist/taro2-react-mobx
```

### ListView
```typescript jsx
import Taro, { PureComponent } from '@tarojs/taro'
import { View, Image, Block } from '@tarojs/components'
import { reactive, didMount, didUnmount, defaultProps, convertProps } from '@flowlist/taro2-react-mobx'
import Loading from '~/image/loading.gif'
import Nothing from '~/image/page_nothing.png'
import Error from '~/image/page_error.png'

@reactive
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
                this.props.launch && <Block>
                  <Image className='list-view__img' mode='aspectFit' src={Nothing} />
                  <View className='list-view__txt'>这里什么都没有</View>
                </Block>
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
import Taro, { PureComponent } from '@tarojs/taro'
import { createStore, reactive } from '@flowlist/taro2-react-mobx'
import ListView from '~/components/ListView'
import ListItem from '~/components/ListItem'
import { getData } from '~/utils/api'

@reactive
export default class extends PureComponent {
  constructor(props) {
    super(props)
    this.store = createStore()
    this.params = {
      func: getData
    }
  }

  render () {
    return (
      <ListView store={this.store} params={this.params}>
        {
          this.store.state.result.map(item => (
            <ListItem
              key={item.slug}
              item={item}
              params={this.props.params}
            />
          ))
        }
      </ListView>
    )
  }
}
```

### Params
| Name | Type | Default | Description |
| --- | --- | --- | ---- |
| `*`func | function | - | 请求接口的函数，返回一个\<Promise\> |
| type | string | auto | `场景`值中的 type：`jump`、`page`、`sinceId`、`seenIds` |
| query | object | - | 需要透传到 API 层的数据 |
| uniqueKey | string | id | 每个元素在 v-for 的时候都需要一个 key，这个参数是 key 的键名 |

- more detail：[docs](https://flowlist.github.io/vue-listview/loader/props.html#props)

### ListView Props
[defaultProps](https://github.com/flowlist/taro2-react-mobx/blob/main/src/store.js)

### More detail
[@flowlist/js-core](https://github.com/flowlist/js-core)
[@flowlist/vue-listview](https://github.com/flowlist/vue-listview)


## Test
see：[@flowlist/js-core](https://github.com/flowlist/js-core)

## License

[MIT](https://github.com/flowlist/taro2-react-mobx/blob/master/LICENSE)
