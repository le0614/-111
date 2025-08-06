import router from '@ohos.router';


@Entry
@Component
struct Index_home {
  @State message: string = 'personal_center';

  build() {
    RelativeContainer() {
      Text(this.message)
        .id('HelloWorld')
        .fontSize($r('app.float.page_text_font_size'))
        .fontWeight(FontWeight.Bold)
        .alignRules({
          center: { anchor: '__container__', align: VerticalAlign.Center },
          middle: { anchor: '__container__', align: HorizontalAlign.Center }
        })
        .onClick(() => {
          this.message = 'Welcome';
        })
      Button('asd').onClick(()=>{
        console.log('ken',111)
        router.pushUrl({
          url:'pages/Dome'
        })
      })
    }
    .height('100%')
    .width('100%')
  }
}

export default Index_home