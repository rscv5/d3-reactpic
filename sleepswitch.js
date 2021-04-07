import React from 'react';
import {Layout,Col,Row,Card,Button} from 'antd';
import * as d3 from 'd3';
// import  '../public/test.json';
// var jsonData = require('../public/test.json');

var now_number = 0;
var channel_number=0;
// const channels =['EEG_Fpz-Cz','EEG_Pz-Oz','EOG_horizontal','Resp_oro-nasal','EMG_submental','Temp_rectal','Event_marker'];
var path_dir = '../public/SC4002E0/frame.json';
const channels_dic = {
    '1st_channel': {
        name: 'EEG Fpz-Cz',
        svg_name: '#first_svg',

    },
    '2nd_channel': {
        name: "EEG Pz-Oz",
        svg_name: "#second_svg",
    },
    '3th_channel': {
        name: 'EOG horizontal',
        svg_name: '#third_svg',
    },
    '4th_channel': {
        name: 'Resp oro-nasal',
        svg_name: '#fourth_svg',
    },
    '5th_channel': {
        name: 'EMG submental',
        svg_name: '#fifth_svg',
    },
    '6th_channel': {
        name: 'Temp rectal',
        svg_name: '#sixth_svg',
    },
    '7th_channel': {
        name: 'Event marker',
        svg_name: '#seventh_svg',
    }
}

class D3line extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            width: window.outerWidth ,
            // width : 900,
            // height: 500,
            height: window.outerHeight / 10,
            padding:{top:10,right:10,bottom:10,left:20},
            frame_data:[],
            frame_number:0,


        }
    }
    //组件挂载前调用，此时调用this.setState不会引起组件重新渲染
    componentWillMount(){
        now_number = this.state.frame_number;
        }

    componentDidMount(){
        // console.log('d3version>>>>>>>',d3.version)
        //切换 加 标签 监听键盘事件
        document.addEventListener('keyup', (e)=> {
            console.log('keyCode',e.keyCode);
            switch(e.keyCode){
                case 37: {
                    // console.log('this is ←←')
                    //上一帧切换 在这里调用数据切换事件
                    if(now_number===0){alert('this is first frame')}
                    else{
                        now_number = now_number -1;
                        this.setState({frame_number:now_number},()=> {
                            // console.log('this is >>>>>>>>>',this.state.frame_number);
                            // this.loadData();
                            path_dir = './SC4002E0/'+`${this.state.frame_number}`+'_frame.json'
                            // console.log('path____',path_dir)
                            fetch(path_dir,{
                                headers:{
                                'Content-Type':'application/json',
                                'Accept':'application/json'
                                }
                                })
                                .then((res)=>res.json())
                                .then((data)=> {
                                    const frame_data = this.getlineData(data);
                                    this.setState({frame_data: frame_data}, ()=>{
                                         // this.showLine();
                                        console.log('this is ',now_number,'frame')
                                    })
                                })
                        })
                    }
                    break;}
                case 39:
                {
                    // console.log('this is →→→')
                    //下一帧切换
                    now_number = now_number+1;
                    // console.log('now_number>>>>>',now_number)
                    this.setState({frame_number: now_number},()=>{
                        // console.log('this is>>>>>>>',this.state.frame_number)
                        // this.loadData();
                        path_dir = './SC4002E0/'+`${this.state.frame_number}`+'_frame.json'
                        console.log('path_dir',path_dir)
                        fetch(path_dir,{
                            headers:{
                            'Content-Type':'application/json',
                            'Accept':'application/json'
                            }
                            })
                            .then((res)=>res.json())
                            .then((data)=> {
                                const frame_data = this.getlineData(data);
                                this.setState({frame_data: frame_data}, ()=> {
                                    console.log('this is ', now_number,'frame');
                                })
                            })

                        })
                    break;}
                default:break;
            }

        })
        // console.log('Path_dir',path_dir)
        fetch(path_dir,{
                headers:{
                'Content-Type':'application/json',
                'Accept':'application/json'
                }
                })
                .then((res)=>res.json())
                .then((data)=> {
                    const frame_data = this.getlineData(data);
                    this.setState({frame_data: frame_data},  ()=>{
                        // this.showLine();
                        })
                    })


    }



    // 转换为line Data
    getlineData=(data)=>{
        // console.log('data>>>>>>>>>',data);
        var series ={};
        for(var key in data){
            // console.log('data[0]>>>>>>>',data[key])
            // console.log('data[0]>>>>>>>',key.split('_')[0])
            series[key.split('_')[0]]= data[key].map((value,i)=>({y:value,x:i}))
        }
        // console.log('>>>>>>>>>>>>>',series)
        return series;
    }

    Line(name,Data,channelName){
        // console.log('statr>>>>>>',channel_number)
        // var channelName= name;
        // console.log('ChannelName',channelName)
        // d3.select(name).remove();
        d3.select(name).selectAll('*').remove();
        var data = Data;


        var width = this.state.width;
        var height = this.state.height;

        var padding = this.state.padding;


        var xScale = d3.scaleLinear()
            .domain([0,data.length])
            // .domain(d3.extent(raw_data,d=>d.x))
                .range([padding.left, width ])


        var yScale = d3.scaleLinear()
            // .domain(d3.extent(raw_data,d=>d.y))
            .domain(d3.extent(data,d=>d.y))
            .range([height-padding.bottom,padding.top])

        var xAxis = d3.axisBottom(xScale)
            .ticks(30) //x坐标轴分割标记,标记上显示的文字是xscale的domain的值
            .tickSize(height*2)  //分割标记的长度//设定tickSize()示器覆盖整个显示区域


        var yAxis = d3.axisLeft(yScale)

        var line = d3.line()
            // .defined(d=>!isNaN(d.y))
            .x(d=>xScale(d.x))
            .y(d=>yScale(d.y))


        var svg = d3.select(name)
            .append('svg')
            .attr("width",width)
            .attr("height",height)

        //生成线
        svg.selectAll('path') //选择svg中所有的path
            .data(data) //绑定数据 一个数据
            .enter() //获取enter部分
            .append('path') //添加足够数量的path元素
            .attr('tranform',"translate("+padding.left+","+padding.top+")")
            .attr('class','big-mac-line') //classname
            .attr('d',line(data))  //生成线段
            .attr('stroke','black')
            .attr('stroke-width','0.01px') //线宽度
            .attr('fill','transparent')

        // 生成线的标签
        svg.append('text')
            .attr('transform',`translate(0,${height-padding.bottom})`)
            .attr('dy','.5em')
            .attr('font-weight','bold')
            .attr('text-anchor','start')
            .style('fill','steelblue')
            .text(channelName)

        //生成label标记
        if(channelName === 'Resp oro-nasal') {
            svg.append('text')
                .attr('x', width / 2)
                .attr('y', height-padding.bottom)
                .attr('fill', '#e6e6e4')
                .attr('font-size', 48)
                .text('WWW')
        }

        svg.append('g')
            .attr('class','x-axis') //定义class名
            .attr('stroke-opacity',0.1)
            // .attr('transform',`translate(0,${height-padding.bottom})`)
            .call(xAxis)
            // .selectAll('.domain').remove()  //隐藏x轴

        // svg1.append('g')
        //     .attr('class','y-axis')
        //     .attr('transform',`translate(${padding.left},0)`)
        //     .call(yAxis)
        //     .selectAll('.domain').remove() //隐藏y轴



    }

    showLine=()=> {
         for(var i in channels_dic){
             if (this.state.frame_data[channel_number] !== undefined) {
                                // console.log('channel',channel_number)
                                // console.log('>>>>>this.state',this.state.frame_data[channel_number])
                                // console.log('>>>>>>>>>',typeof channels_dic[i].svg_name)
                 this.Line(channels_dic[i].svg_name, this.state.frame_data[channel_number], channels_dic[i].name);
                                // channel_number=channel_number+1;
                 if(channel_number<6){ channel_number=channel_number+1;}
                                // console.log('channel',channel_number)
             }
         }
         channel_number = 0;
        }


    render(){
            // this.showLine();
        if(this.state.frame_data[0]!==undefined){
            this.Line(channels_dic['1st_channel'].svg_name,this.state.frame_data[0],channels_dic['1st_channel'].name)}
        // if(this.state.frame_data!==[]){this.showLine();}
            return(
                // <Layout>
                // this.this.showLine()
                <Layout>
                    <Card>
                    <div id="first_svg"/>
                    <div id ='second_svg'/>
                    {/* <div id ='third_svg'/>
                    <div id='fourth_svg'/>
                    <div id={'fifth_svg'}/>
                    <div id={'sixth_svg'}/>
                    <div id={'seventh_svg'}/> */}
                    </Card>
                </Layout>


            )
        }

}

export default D3line;