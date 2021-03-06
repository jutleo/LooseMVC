var alert=function(log){
	if (!console){alert(log);	}else{console.log(log);}
}

var LooseMVC=function (AppName){
	//Tools——功能类
	var _Super=this;
	var App=function(){
		return AppName;
	};
	var Tools={
		extend:function(){//([deep], target, object1, [objectN])	Copy from JQuery
			var options, name, src, copy, copyIsArray, clone,
				target = arguments[0] || {},
				i = 1,
				length = arguments.length,
				deep = false;

			// Handle a deep copy situation
			if ( typeof target === "boolean" ) {
				deep = target;
				target = arguments[1] || {};
				// skip the boolean and the target
				i = 2;
			}

			// Handle case when target is a string or something (possible in deep copy)
			if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
				target = {};
			}

			// extend jQuery itself if only one argument is passed
			if ( length === i ) {
				target = this;
				--i;
			}

			for ( ; i < length; i++ ) {
				// Only deal with non-null/undefined values
				if ( (options = arguments[ i ]) != null ) {
					// Extend the base object
					for ( name in options ) {
						src = target[ name ];
						copy = options[ name ];

						// Prevent never-ending loop
						if ( target === copy ) {
							continue;
						}

						// Recurse if we're merging plain objects or arrays
						if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
							if ( copyIsArray ) {
								copyIsArray = false;
								clone = src && jQuery.isArray(src) ? src : [];

							} else {
								clone = src && jQuery.isPlainObject(src) ? src : {};
							}

							// Never move original objects, clone them
							target[ name ] = jQuery.extend( deep, clone, copy );

						// Don't bring in undefined values
						} else if ( copy !== undefined ) {
							target[ name ] = copy;
						}
					}
				}
			}

			// Return the modified object
			return target;
		}
	};
	//Data——数据基类
	var Data=function(self,formula,type){//应用程序作用域命名,传入可解析的公式||匿名函数体
		var bindData ="";//以字符串形式存储绑定者，使用,,进行分割
		var bindjoiner=",,";//修改的话每次增加一个,,，以,,为单位进行增加
		var bindcuter=",";//修改的话每次增加一个,，以,为单位进行增加
		var ignoreBingData = [];
		var content;
		var timer;//线程计时器//img的onerror形成的线程无法清除
		var app=App[type];
		//Private
		var RefreshBinding = function(){

		}
		//绑定模块
		var Binding={
			bindDataStr:"",
			updateBindDataStr:function(){
				var bindDataStr=bindData;
				var Length=ignoreBingData.length;
				for (var i=0;i<Length ; ++i)//过滤免绑定数据
				{
					var ignoreBingDataStr=bindcuter+ignoreBingData[i]+bindcuter;
					bindDataStr.replace(ignoreBingDataStr,"");
				}
				this.bindDataStr=bindDataStr;
			},
			updateBinder:function(){//开始向下更新数据
				var bindDataArr=this.bindDataStr.split(bindjoiner);
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
			update:function(ignoreBinger){
				if(typeof formula=="string"){
					content=eval(formula);
				}else if(typeof formula=="function"){
					content=eval(String(formula).substr(11));
				}else if(typeof formula=="number"){//如果是数值的话，绑定效果是回到原始的值
					content=formula;
				}else{
					content=formula;
				}
				Binding.updateBindDataStr(ignoreBinger);
				ignoreBinger.push(self);
				ignoreBingData=ignoreBinger;
				Binding.updateBinder()
			}
			set:function(target,val){//updata content && run bindData.updata
				var targetData=app[target];
				targetData=val;
				ignoreBingData=[self];
				Binding.updateBinder();
				return this;
			},
			reset:function(newFormula){
				formula=newFormula;
				this.update([]);
			}
			get:function(){//return content;
				return content;
			},
			bind:function(binder){//默认为双向绑定
				while (binder.search(bindjoiner)!==-1)//如果与分隔符冲突
				{//修改绑定序列的分隔符,并修改分隔符与剪切符
					bindData=String(bindData.split(bindjoiner).join(bindjoiner+",,"));//==bindData.replace(new RegExp("("+bindjoiner+"){"+(bindjoiner.split(",,").length+1)+"}"),bindjoiner+",,") ;
					bindjoiner+=",,";
					bindcuter+=",";
				}
				if(bindData.search(bindcuter+binder+bindcuter)==-1)//检查是否重复绑定
				bindData+=binder+bindjoiner;
				return this;
			},
			oneWayBind:function(binder){//单向绑定
				while (binder.search(bindjoiner)!==-1)//如果与分隔符冲突
				{//修改绑定序列的分隔符,并修改分隔符与剪切符
					bindData=String(bindData.split(bindjoiner).join(bindjoiner+",,"));//==bindData.replace(new RegExp("("+bindjoiner+"){"+(bindjoiner.split(",,").length+1)+"}"),bindjoiner+",,") ;
					bindjoiner+=",,";
					bindcuter+=",";
				}
				bindData+=binder+bindjoiner;
				return this;
			},
			removeBind:function(binder){//移除绑定
				bindData.replace(bindcuter+binder+bindcuter,"");
			}
		};
		//alert(typeof this);
		Tool.extend(this,Public);
		//init
		(function(){
			if(typeof self=='string'){
				var ns=self.split('.');
				var nsLink= app; //Model或者View
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
	//Model——Model类：Data；
	this.Model=function(){
		var data=arguments[0]||{};
		if (typeof data=="string"){
			//默认为Json的text格式，进行解析，引入json2.js模块，并入Tools中；
		}else if(typeof data=="object"){
			//为正确的数据格式
		}else{
			return;//返回空
		}
		return data;
	}
	//Control——Control类
	this.Control=function(){
		
	}
	//View——View类：Data；
	this.View=function(){
		
	}
	return this;
};
this.LooseMVC=LooseMVC;
