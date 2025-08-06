@Entry
@Component
struct Home {

  build() {
      Column() {
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

          ForEach(data,(data:page)=>{
            Text(data.name)
          })
          Text("常用服务")
            .fontSize(16)
          Text("更多...")
            .fontSize(10)
          Column(){
              Row(){
                Text("五月几日")
                Text("内容")
                Text(">")
              }
              .width('100%')
          }
          .width('100%')

        }
        .justifyContent(FlexAlign.SpaceBetween)
        .width('100%')
        Row(){
          Text("小区通知")
            .fontSize(16)
          Text("更多...")
            .fontSize(10)
        }
        .justifyContent(FlexAlign.SpaceBetween)
        .width('100%')
      }
      .width('100%')
      .height('100%')

    }

}

export default Home

interface page{
  id:number,
  name:string,
  icon:string,
}

const data:page[]=[
  {id:1,name:"物业缴费",icon:''},
  {id:2,name:"报修报事",icon:''},
  {id:3,name:"生活缴费",icon:''},
  {id:4,name:"常用电话",icon:''},
  {id:5,name:"车辆登记",icon:''}
]