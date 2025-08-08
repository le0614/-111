import router from '@ohos.router';

@Entry
@Component
export  struct Home_huo{
  build() {
    Column() {
      Row(){
        Button("<").onClick(()=>{
          router.pushUrl({ url: 'pages/Childs/Home' })
            .catch((error: Error) => {
              console.error('页面跳转失败:', error);
            });
        })
          .backgroundColor(Color.Orange)
          .fontSize(20)
        Text("小区活动")
          .fontColor(Color.White)
          .fontSize(20)
        Text("三")
      }
      .width('100%')
      .backgroundColor(Color.Orange)
      .justifyContent(FlexAlign.SpaceBetween)
    }
    .width('100%')
    .height('100%')
    .backgroundColor(Color.White)
  }
}
