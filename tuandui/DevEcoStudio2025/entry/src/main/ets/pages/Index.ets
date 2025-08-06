import router from '@ohos.router';
import Home from './Childs/Home'  // 小区服务
import personal from './Childs/personal_center' // 周边生活
import service from './Childs/service_order'  // 服务订单
import surrounding from './Childs/surrounding_living'  // 个人中心
import Index_home from './Childs/Index_home' // 首页

@Entry
@Component
struct Index {
  @State currentIndex: number = 2;
  private tabsController: TabsController = new TabsController();

  @Builder TabBuilder(index: number, selectedICon: Resource,unselectIcon:Resource ,text?: string,iconSize: number = 24) {
    Column() {
      Image(this.currentIndex==index?unselectIcon:selectedICon)
        .width(iconSize)
        .height(iconSize)
        .objectFit(ImageFit.Contain)
      Text(text)
        .fontColor(this.currentIndex==index?'#efb336':"rgb(0,0,0,0.60)")
        .fontSize(12)
        .margin({ top: 4 })
    }
    .width('100%')
    .height(50)
    .borderWidth({top:1})
    .borderColor('#efb336')
    .padding({top:7})
    .onClick(() => {
      this.currentIndex = index;
      this.tabsController.changeIndex(index);
    })
  }


  build() {
    Tabs({ barPosition: BarPosition.End, controller: this.tabsController }) {
      // 第一个Tab页
      TabContent() {
        Home()
      }
      .tabBar(this.TabBuilder(0, $r('app.media.tuoguan'),$r('app.media.tuoguan1'), '小区服务'))

      // 第二个Tab页
      TabContent() {
        personal()
      }
      .tabBar(this.TabBuilder(1, $r('app.media.zhoubianshenghuo'), $r('app.media.zhoubianshenghuo1'), '周边生活'))

      // 第三个Tab页
      TabContent() {
        Index_home()
      }
      .tabBar(this.TabBuilder(2, $r('app.media.xiaoqu'), $r('app.media.xiaoqu1', 'a',80)))
      // 第四个Tab页
      TabContent() {
        service()
      }
      .tabBar(this.TabBuilder(3, $r('app.media.fuwudingdan'), $r('app.media.fuwudingdan1'), '服务订单'))


      // 第五个Tab页
      TabContent() {
        surrounding()
      }
      .tabBar(this.TabBuilder(4, $r('app.media.icon7'), $r('app.media.icon71'), '个人中心'))
    }
    .barWidth('100%') // 设置TabBar宽度
    .barHeight(60)    // 设置TabBar高度
    .onChange((index: number) => {
      this.currentIndex = index;
      // this.tabsController.changeIndex(index)
    })
    .width('100%')
    .height('100%')
    .backgroundColor('#F1F3F5')
  }
}
