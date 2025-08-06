import router from '@ohos.router';
import { httpClient } from '../common/http/request'

// 定义Tab接口
interface TabItem {
  name: string;
  icon: string;
  page: string;
}

@Entry
@Component
struct Index {
  @State currentIndex: number = 0;

  // Tab配置数据
  private tabs: TabItem[] = [
    { name: '首页', icon: './images/image1.png', page: 'pages/Home' },
    { name: '个人中心', icon: './images/image1.png', page: 'pages/PersonalCenter' },
    { name: '服务订单', icon: './images/image1.png', page: 'pages/ServiceOrder' },
    { name: '周边生活', icon: './images/image1.png', page: 'pages/SurroundingLife' }
  ];

  build() {
    Column() {
      // 主内容区 - 使用Tabs组件
      Tabs({ barPosition: BarPosition.End }) { // 设置tabbar在底部
        ForEach(this.tabs, (item: TabItem, index: number) => {
          TabContent() {
            // 每个Tab对应的页面内容
            this.getTabContent(index)
          }
          .tabBar(this.TabBarItem(item, index))
        })
      }
      .barMode(BarMode.Fixed)
      .barWidth('100%')
      .barHeight(60)
      .onChange((index: number) => {
        this.currentIndex = index;
        router.pushUrl({ url: this.tabs[index].page });
      })
      .width('100%')
      .height('100%')
    }
  }

  // 自定义TabBar项
  @Builder
  TabBarItem(item: TabItem, index: number) {
    Column() {
      Image(item.icon)
        .width(24)
        .height(24)
        .margin({ bottom: 4 })
      Text(item.name)
        .fontSize(14)
    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Center)
    .backgroundColor(this.currentIndex === index ? '#f5f5f5' : '#ffffff')
  }

  // 获取对应Tab的内容
  @Builder
  getTabContent(index: number) {
    if (index === 0) {
      this.HomeContent()
    } else if (index === 1) {
      this.PersonalContent()
    } else if (index === 2) {
      this.ServiceContent()
    } else {
      this.SurroundingContent()
    }
  }

  // 首页内容
  @Builder
  HomeContent() {
    Column() {
      Text('首页内容')
        .fontSize(20)
        .margin(20)

      Button('跳转子页面')
        .onClick(() => {
          router.pushUrl({ url: 'pages/Home/SubPage' })
        })
    }
    .width('100%')
    .height('100%')
  }

  // 个人中心内容
  @Builder
  PersonalContent() {
    Text('个人中心内容')
      .fontSize(20)
      .margin(20)
  }

  // 服务订单内容
  @Builder
  ServiceContent() {
    Text('周边生活内容')
      .fontSize(20)
      .margin(20)
    // service_order()
    //   .margin({ top: 12 })
  }

  // 周边生活内容
  @Builder
  SurroundingContent() {
    Text('周边生活内容')
      .fontSize(20)
      .margin(20)
  }
}