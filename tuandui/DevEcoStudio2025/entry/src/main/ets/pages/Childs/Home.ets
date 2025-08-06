import router from '@ohos.router';

@Entry
@Component
struct Home {
  build() {
    Column() {
      Text("这是子页面")
        .fontSize(30)
        .margin(20)

      Button("返回主页面")
        .onClick(() => {
          router.back() // 返回上一页
        })
    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Center)
  }
}

export default Home