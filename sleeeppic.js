import React from 'react';
import {Layout,Card,Button} from 'antd';
import './sleeppic.css';
import FileSaver from  'file-saver'


var now_number = 0;
var pic_path='./SC4002E0_F/0_frame.png';
const js_path='./SC4002E0_F/frame.json';
var frame_label=[];
class D3line extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            width: window.outerWidth ,
            height: window.outerHeight / 10,
            padding:{top:10,right:10,bottom:10,left:20},
            pic_path:pic_path,
            now_frame_number:0,
            label:'',
            fileName:'',
            frame_numbers:0,
            unlabel_number:0,
        }
    }
    //组件挂载前调用，此时调用this.setState不会引起组件重新渲染
    componentWillMount(){
        now_number = this.state.now_frame_number;
        fetch(js_path,{
            headers:{
                'Content-Type':'application/json',
                            'Accept':'application/json'
            }
        })
            .then((res)=>res.json())
            .then((data)=> {
                this.setState({frame_numbers:data.frame_numbers,fileName: data.file_name },function(){
                    // console.log('>>>>>>>>',this.state.fileName)
                    for(let i=0;i<this.state.frame_numbers;i++){
                        frame_label.push({
                            itemID:i,
                            itemLabel:'',
                        })
                    }
                })
        })
        }

    componentDidMount(){
        //切换 加 标签 监听键盘事件
        document.addEventListener('keyup', (e)=> {
            switch(e.keyCode){
                case 37: {
                    // console.log('this is ←←')
                    //上一帧切换 在这里调用数据切换事件
                    if(now_number===0){alert('this is the first frame')}
                    else{
                        now_number = now_number -1;

                        this.setState({now_frame_number: now_number},()=> {
                            pic_path = './SC4002E0_F/'+`${this.state.now_frame_number}`+'_frame.png'
                            this.setState({pic_path:pic_path},function () {
                                // console.log('>>>>>>>>>>',pic_path)
                                if(frame_label[now_number]!==undefined) {
                                    this.setState({label: frame_label[now_number].itemLabel})
                                }
                                else{
                                    this.setState({label:''});

                                }
                            })
                        })
                    }
                    break;}
                case 39:
                {
                    //下一帧切换
                    if(now_number===this.state.frame_numbers-1){alert('this is the last frame!')}
                    else {
                          now_number = now_number+1;
                         console.log('now_number>>>>>',now_number)
                        frame_label[now_number] = {itemID:now_number, itemLabel:''};
                        this.setState({now_frame_number: now_number},()=>{
                        pic_path = './SC4002E0_F/'+`${this.state.now_frame_number}`+'_frame.png'
                           this.setState({pic_path:pic_path},function () {
                               if(frame_label[now_number]!==undefined){
                                       this.setState({label: frame_label[now_number].itemLabel});
                               }
                               else{
                                   this.setState({label:''});
                               }
                            })
                        })
                    }

                    break;}
                // 1
                case 97: case 49 :{
                    //进行标记 W
                    //标记形式应该是:
                    const now_n = now_number;
                    frame_label[now_n] = {itemID:now_n, itemLabel:'w'};
                    this.setState({label:'w'},function () {
                        // console.log('>>>>>',this.state.label);

                    })
                }
                 // case
                default:break;
            }

        })

    }



    tofileCsv=()=>{
            const csvString =[
               [ "Item ID",
                "Item Label"
            ],
                ...frame_label.map(item=>[
                    item.itemID,
                    item.itemLabel
                ])
                ]
                .map(e=>e.join(","))
                .join('\n')

            let exportContent = '\uFEFF';
            let blob = new Blob([exportContent+ csvString],{
                type:'text/plain;charset=utrf-8'
            });
            FileSaver.saveAs(blob,`${this.state.fileName}`+'_label.csv')

        }


    showpic=()=>{
        const path = this.state.pic_path;
        var label = this.state.label;
        var bg = {
            width:window.outerWidth,
            marginLeft:'4%',
            marginBottom:0,
            height:'725px', //设置高度
            backgroundSize:'contain', //按比例缩放
            backgroundRepeat:'no-repeat',
            backgroundImage:'url('+path+')',
        }

            return (
                <div style={bg} key={'image_frame'}>
                    <p className={'label-p'}>{label}</p>
                </div>
            )

    }

    render(){

            return(
                <Layout className={'image-card-layout'}>
                    <Card
                        className={'image-card'}
                        key={'image'+`${this.state.pic_path}`}
                        title={now_number+1+'frame'}
                        hoverable
                        extra={<Button type="primary" onClick={this.tofileCsv} size={'middle'}>Done</Button>}
                    >
                        {this.showpic()}
                    </Card>
                </Layout>
            )
        }
}


export default D3line;

