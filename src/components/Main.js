require('normalize.css/normalize.css');
require('styles/App.css');
import React from 'react';
import ReactDOM from 'react-dom';
//图片文件名转为url路径
var imageDatas=require("../data/data.json");

imageDatas=(function genImageUrl(imageDataArr) {
	var length=imageDataArr.length;
	for (var i=0 ; i <length; i++) {
		var singleImageData=imageDataArr[i];

		singleImageData.imageURL=require('../images/'+singleImageData.fileName);
		//console.log(singleImageData);
		imageDataArr[i]=singleImageData;
	}

	return imageDataArr;
})(imageDatas)


function getRangeRandow(low,high) {
	return Math.ceil(Math.random()*(high-low)+low)
}

function get30DegRandom() {
	return ((Math.random() > 0.5 ? '' :'-')+Math.ceil(Math.random()*30))
}

class ImgFigure extends React.Component{

	//this.handleClick = this.handleClick.bind(this);
	handleClick(e){
		if(this.props.arrange.isCenter){
			this.props.inverse();
		}else{
			this.props.center();
		}

		e.stopPropagation();
		e.preventDefault();

	}
	render () {
		var styleObj={};
		if(this.props.arrange.pos){
			styleObj=this.props.arrange.pos
		}

		if(this.props.arrange.rotate){
			(['MozTransform','msTransform','WebkitTransform','transform']).forEach(function (value,index) {
				styleObj[value]='rotate('+this.props.arrange.rotate+'deg)';
			}.bind(this));	
		}

		if(this.props.arrange.isCenter){
			styleObj.zIndex=11
		}

		var imgFigreClassName='img-figure';
			imgFigreClassName += this.props.arrange.isInverse ? ' is-inverse' : '';//增加is-inverse的class
		return (

				<figure className={imgFigreClassName} style={styleObj} onClick={this.handleClick.bind(this)}>
					<img src={this.props.data.imageURL} 
						alt={this.props.data.title} 
					/>
					<figcaption className="img-title">
						<h2>{this.props.data.title}</h2>
						<div className='img-back' onClick={this.handleClick}>
							<p>
								{this.props.data.desc}
							</p>
						</div>
					</figcaption>
				</figure>
			)
	}
};


class ControllerUnit extends React.Component{
	handleClick(e){
		if(this.props.arrange.isCenter){
			this.props.inverse();
		}else{
			this.props.center();
		}
	}

 	
	render(){

		var objstyle={};
	 	if(this.props.arrange.isCenter){
	 		objstyle["backgroundColor"]='#222'
	 	}
		return(

				<span className="controller-unit" style={objstyle} onClick={this.handleClick.bind(this)}></span>

			)
	}
}

class AppComponent extends React.Component {

	Constant={//中心
		centerPos:{
			left:0,
			right:0
		},
		hPosRange:{  //水平方向的取值范围
			leftSecX:[0,0],
			rightSecx:[0,0],
			y:[0,0]
		},
		vPosRange:{  //垂直方向的取值范围
			x:[0,0],
			topY:[0,0]
		}
	};

	state={imgsArrangeArr:[
  			/*{
  				pos:{
  					left:'0',
  					top:'0'
  				},
  				rotate:0, //旋转角度
  				isInverse:false //图片正反
  				isCenter:false //图片是否居中

  			}*/
  	]};
  	/*
	 *翻转图片
	 *@param index 输入当前被执行inverse操作的图片信息数组的index的值
	 *@return{functuon }是一个闭包函数
  	*/
  	inverse (index) {
  		return function () {
  			var imgsArrangeArr =this.state.imgsArrangeArr;
  			
  			imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
			console.log(imgsArrangeArr)
  			this.setState({
  				imgsArrangeArr:imgsArrangeArr
  			});
  		}.bind(this);
  	}

  	//居中图片
  	center(index){
  		return function () {
  			this.rearrange(index)
  		}.bind(this);
  	}

	//重新排布图片 centerIndex制定居中那个图片
	rearrange (centerIndex) {
		var imgsArrangeArr=this.state.imgsArrangeArr,
			Constant=this.Constant,
			centerPos=Constant.centerPos,
			hPosRange=Constant.hPosRange,
			vPosRange=Constant.vPosRange,
			hPosRangeLeftSecX=hPosRange.leftSecX,
			hPosRangeRightSexX=hPosRange.rightSecx,
			hPosRangeY=hPosRange.y,
			vPosRangeTopY=vPosRange.topY,
			vPosRangeX=vPosRange.x,


			imgsArrangeTopArr=[],

			topImgNum=Math.floor(Math.random()*2),//取一个或者不取,向下取整
			topImgSpliceIndex=0,//标记位置

			imgsArrangeCenterArr=imgsArrangeArr.splice(centerIndex,1);

			//居中centerIndex的图片,不需要旋转

			imgsArrangeCenterArr[0]={
				pos:centerPos,
				rotate:0,
				isCenter:true
			}
			//取出要布局上侧的图片的状态信息
			console.log(imgsArrangeArr)
			topImgSpliceIndex=Math.ceil(Math.random()*(imgsArrangeArr.length-topImgNum));
			imgsArrangeTopArr=imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);


			imgsArrangeTopArr.forEach(function (value,index) {
				imgsArrangeTopArr[index]={
					pos:{
						top:getRangeRandow(vPosRangeTopY[0],vPosRangeTopY[1]),
						left:getRangeRandow(vPosRangeX[0],vPosRangeX[1])
					},
					rotate:get30DegRandom(),
					isCenter:false
				};
			});

			//布局左右俩侧的图片

			for(var i=0,j=imgsArrangeArr.length,k=j/2;i<j;i++){
				var hPosRangeLORX=null;


				if(i<k){
					hPosRangeLORX=hPosRangeLeftSecX;
				}else{
					hPosRangeLORX=hPosRangeRightSexX;
				}


				imgsArrangeArr[i]={
					pos:{
						top:getRangeRandow(hPosRangeY[0],hPosRangeY[1]),
						left:getRangeRandow(hPosRangeLORX[0],hPosRangeLORX[1])
					},
					rotate:get30DegRandom(),
					isCenter:false
					
				};
			}

			

			if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
				imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
			}

			imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);
			this.setState({
				imgsArrangeArr:imgsArrangeArr
			})

	}


	//初始化状态
	/*getInitialState () {
		return{
			imgsArrangeArr:[
				{
					pos:{
						left:'0',
						top:'0'
					},
					rotate:0,
					isIners
				}
			]
		};
	};
*/

	//组件加载开始初始化位置
	componentDidMount () {
		//舞台大小
		var stageDOM=ReactDOM.findDOMNode(this.refs.stage),
			stageW=stageDOM.scrollWidth,//不包含滚动条等边线
			stageH=stageDOM.scrollHeight,
			halfStageW=Math.ceil(stageW/2),
			halfStageH=Math.ceil(stageH/2);
		//imageFigure大小
		let imgFigureDOM=ReactDOM.findDOMNode(this.refs.imgFigre0),
			imgW=imgFigureDOM.scrollWidth,
			imgH=imgFigureDOM.scrollHeight,
			halfimgW=Math.ceil(imgW/2),
			halfimgH=Math.ceil(imgH/2);
		//图片中心的位置
		this.Constant.centerPos={
			left:halfStageW-halfimgW,
			top:halfStageH-halfimgH
		};
		//计算左侧右侧图片排布的取值范围
		this.Constant.hPosRange.leftSecX[0]=-halfimgW;
		this.Constant.hPosRange.leftSecX[1]=halfStageW-halfimgW*3;
		this.Constant.hPosRange.rightSecx[0]=halfStageW+halfimgW;
		this.Constant.hPosRange.rightSecx[1]=stageW-halfimgW;
		this.Constant.hPosRange.y[0]=-halfimgH;
		this.Constant.hPosRange.y[1]=stageH-halfimgH;
		//计算上册区域图片排布的取值范围

		this.Constant.vPosRange.topY[0]=-halfimgH;
		this.Constant.vPosRange.topY[1]=halfStageH-halfimgH * 3;
		this.Constant.vPosRange.x[0]=halfimgW-imgW;
		this.Constant.vPosRange.x[1]=halfimgW;

		var num=Math.floor(Math.random()*10);
		this.rearrange(num);
	};

  render() {
  	var contorllerUnits=[],
  		imgFigres=[];

	imageDatas.forEach(function (value,index) {

		if(!this.state.imgsArrangeArr[index]){
			this.state.imgsArrangeArr[index]={
				pos:{
					left:0,
					top:0
				},
				rotate:0,
				isInverse:false,
				isCenter:false
			};
		}
		//console.log(this.inverse(0))
		imgFigres.push(<ImgFigure data={value} center={this.center(index)} ref={'imgFigre'+index} key={index} arrange={this.state.imgsArrangeArr[index]}  inverse={this.inverse(index)}  />);
		contorllerUnits.push(<ControllerUnit center={this.center(index)} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)}  key={index}/>)

	}.bind(this));
    

    return (
    	<section className="stage" ref="stage">
			<section className="img-sec">
				{imgFigres}
    		</section>
    		<nav className="controller-nav">
    			{contorllerUnits}
    		</nav>
    	</section>


      
	)		
	}
}

AppComponent.defaultProps = {
};

export default AppComponent;
