var alert=function(log){
	console.log(log);
}
Tools={};
Tools.extend=function(sour,obj){
	for(var i in obj){
		if(!sour[i])	{
			sour[i]=obj[i];
		}
	}
}
	
var Data=function(self,formula,App){//应用程序作用域命名,传入可解析的公式||匿名函数体
	var bindData ="";//以字符串形式存储绑定者，使用,,进行分割
	var bindjoiner=",,";//修改的话每次增加一个,,，以,,为单位进行增加
	var bindcuter=",";//修改的话每次增加一个,，以,为单位进行增加
	var ignoreBingData = [];
	var content;
	var timer;//线程计时器
	App=App||this;
	
	//Private
	var RefreshBinding = function()
	{
			var bindDataStr=bindData;
			var Length=ignoreBingData.length;
			for (var i=0;i<Length ; ++i)//过滤免绑定数据
			{
				var ignoreBingDataStr=bindcuter+ignoreBingData[i]+bindcuter;
				bindDataStr.replace(ignoreBingDataStr,"");
			}
			//开始向下更新数据
			var bindDataArr=bindDataStr.split(bindjoiner);
			Length=bindDataArr.length;
			for (var i=0;i<Length ; ++i)
			{
				var appDataArr=bindDataArr[i].split(".")
				var appData;
				for (var i=0;i<appDataArr.length ; ++i)
				{
					appData=App[appDataArr]
				}
			}
	}
	//Pro
	var UpdataContent = function(){//reset timout 
		clearTimeout(timer);
		timer=setTimeout(function(){
			content=eval(formula);
		},20); //默认为20毫秒
	}
	//Public
	var Public = {
		set:function(val){//updata content && run bindData.updata
			if (val===undefined){
				this.updata()
			}else{
				content=val;
			}
			RefreshBinding();
			return this;
		},
		get:function(){//return content;
			return content;
		},
		bind:function(binder){//默认为双向绑定
			while (binder.search(bindjoiner)!==-1)//如果与分隔符冲突
			{//修改绑定序列的分隔符,并修改分隔符与剪切符
				bindData.split(bindjoiner).join(bindjoiner+",,");//==bindData.replace(new RegExp("("+bindjoiner+"){"+(bindjoiner.split(",,").length+1)+"}"),bindjoiner+",,") ;
				bindjoiner+=",,";
				bindcuter+=",";
			}
			bindData+=binder+bindjoiner;
			return this;
		},
		oneWayBind:function(binder){//单向绑定
			while (binder.search(bindjoiner)!==-1)//如果与分隔符冲突
			{//修改绑定序列的分隔符,并修改分隔符与剪切符
				bindData.split(bindjoiner).join(bindjoiner+",,");//==bindData.replace(new RegExp("("+bindjoiner+"){"+(bindjoiner.split(",,").length+1)+"}"),bindjoiner+",,") ;
				bindjoiner+=",,";
				bindcuter+=",";
			}
			bindData+=binder+bindjoiner;
			return this;
		},
		removeBind:function(binder){
		}
	};
	//alert(typeof this);
	Tools.extend(this,Public);

	//init
	(function(){
		if(typeof self=='string'){
			var ns=self.split('.');
			var nsLink= App; //应用程序名或已知父级
			var L=ns.length-1;
			for(var i=0;i<L;++i) {
				if(!nsLink[ns[i]]){
					nsLink[ns[i]]={} ;
					}else if(nsLink[ns[i]].constructor==Data){//对象存在且冲突，创建失败！
						return;
					}
				nsLink=nsLink[ns[i]];
			}
			if (!nsLink[ns[L]]){//对象不存在，直接赋予引用
				nsLink[ns[L]]=this;
			}else if (nsLink[ns[L]].constructor!=Data){//对象已经存在，拓展对象
				Tool.extend(nsLink[ns[L]],this) 
			}
		} else{
			return; //格式错误，对象创建失败
		}
		if(typeof formula=="string"){
			content=eval(formula);
		}else if(typeof formula=="function"){
			content=eval(String(formula).substr(11));
		}else if(typeof formula=="number"){
			content=formula;
		}
	}).call(this);


	return this;
}


var App={}
a=Data.call(App,"a.a.a",34);
alert(a.get)
alert(App.a.a.a.constructor==Data)
alert(a.constructor==Data);//.call(App,"b.b.b")
alert(App)
	
