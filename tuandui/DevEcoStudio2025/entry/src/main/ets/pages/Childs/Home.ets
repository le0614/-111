import router from '@ohos.router';
import { http } from '@kit.NetworkKit';
import { BusinessError } from '@kit.BasicServicesKit';
import { common } from '@kit.AbilityKit';

// 定义接口类型
interface ApiResponse<T> {
  code: number;
  data: T;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

@Entry
@Component
struct Home {
  // 状态管理
  @State products: Product[] = [];
  @State isLoading: boolean = true;
  @State errorMessage: string = '';

  private context?: common.UIAbilityContext;
  private isRequesting: boolean = false;
  private httpRequest: http.HttpRequest | null = null;

  aboutToAppear() {
    this.context = this.getUIContext().getHostContext() as common.UIAbilityContext;
    this.getList();
  }

  private async getList() {
    if (this.isRequesting) return; // 防止重复请求

    this.isRequesting = true;

    let httpRequest = http.createHttp(); // 每次创建新实例

    httpRequest.request(
      // 填写HTTP请求的URL地址，可以带参数或不带参数。URL地址由开发者自定义。请求的参数可以在extraData中指定。
      "http://192.168.222.89:3001/list/index",
      (err: BusinessError, data: http.HttpResponse) => {
        if (!err) {
          console.log('成功了')
          // data.result为HTTP响应内容，可根据业务需要进行解析。
          console.info('Result:' + JSON.stringify(data.result));
          console.info('code:' + JSON.stringify(data.responseCode));
          // // data.header为HTTP响应头，可根据业务需要进行解析。
          // console.info('header:' + JSON.stringify(data.header));
          // console.info('cookies:' + JSON.stringify(data.cookies)); // 8+
          // 当该请求使用完毕时，调用destroy方法主动销毁。
          httpRequest.destroy();
        } else {
          console.error('error:' + JSON.stringify(err));
          // 当该请求使用完毕时，调用destroy方法主动销毁。
          httpRequest.destroy();
        }
      }
    );
  }
  build() {
    Column(){
      Text("小区服务")
        .fontSize(16)
        .margin(20)
        .height('6%')
        .backgroundColor(Color.Orange)
        .width('100%')
        .fontColor('white')
        .align(Alignment.Top)
        .width('100%')
      Row(){
        Text("武汉市江城区鹏利广场")
        Text("选择")
      }
      .justifyContent(FlexAlign.SpaceBetween)
      .width('100%')
      Row(){
        ForEach(data,(data:Page)=>{
          Column(){
            Button('asd').onClick(()=>{
              // Text("")

            })
              .width("10%")
              .height("10%")
              .backgroundColor(Color.Orange)
            Text(data.name)
          }

        },(data: Page) => data.id.toString())
      }
      .justifyContent(FlexAlign.SpaceBetween)
      .width('100%')
      Row(){
        Text("小区通知")
          .fontSize(16)
        Button("更多").onClick(()=>{
          router.pushUrl({ url: 'pages/Childs/SS/index_xiang' })
            .catch((error: Error) => {
              console.error('页面跳转失败:', error);
            });
        })
          .backgroundColor(Color.White)
          .fontColor(Color.Black)
          .fontSize(10)
      }
      .justifyContent(FlexAlign.SpaceBetween)
      .width('100%')
      Column(){
        ForEach(data,()=>{})
        Text('1')
          .backgroundColor(Color.Green)
          .width('100%')
      }
      .width('100%')
      Row(){
        Text("小区通知")
          .fontSize(16)
        Button("更多").onClick(()=>{
          router.pushUrl({ url: 'pages/Childs/SS/index_xiang' })
            .catch((error: Error) => {
              console.error('页面跳转失败:', error);
            });
        })
          .backgroundColor(Color.White)
          .fontColor(Color.Black)
          .fontSize(10)
      }
      .justifyContent(FlexAlign.SpaceBetween)
      .width('100%')
      Column(){
        Text('1')
          .backgroundColor(Color.Green)
          .width('100%')
      }
    }
    .width('100%')
    .height('100%')

  }

}



interface Page{
  id:number;
  name:string;
  icon?:Resource;
}

const data:Page[]=[
  {id:1,name:"物业缴费"},
  {id:2,name:"报修报事"},
  {id:3,name:"生活缴费"},
  {id:4,name:"常用电话"},
  {id:5,name:"车辆登记"}
]

export default Home
