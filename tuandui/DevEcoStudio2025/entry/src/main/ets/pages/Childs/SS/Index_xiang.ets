import router from '@ohos.router';

@Entry
@Component
export  struct Index_xiang {
  build() {
    Column() {
        Row(){
          Button("<").onClick(()=>{
            if(1){
              router.pushUrl({ url: 'pages/Childs/SS/Home_tong' })
                .catch((error: Error) => {
                  console.error('页面跳转失败:', error);
                });
            }else{
              router.pushUrl({ url: 'pages/Childs/SS/Home_huo' })
                .catch((error: Error) => {
                  console.error('页面跳转失败:', error);
                });
            }
          })
            .backgroundColor(Color.Orange)
            .fontSize(20)
          Text("信息详情")
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
