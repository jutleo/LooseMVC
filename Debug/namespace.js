
var log = console.log;
var reg = {
	DoubleQuotedString : new RegExp('"(?:\\.|(\\\\\\")|[^\\""\\n])*"','g'),
		SingleQuotedString : new RegExp("'(?:\\.|(\\\\\\')|[^\\''\\n])*'",'g'),
		Chars : new RegExp('([(=[{])','g'),
		Empty : new RegExp('[	 ]+','g'),
		MultiLineCComments : new RegExp('/\\*[\\s\\S]*?\\*/', 'gm'),
		SingleLineCComments : new RegExp('//.*$', 'gm'),
}
//keyWord = ["break", "case", "catch", "continue", "default", "delete", "do", "else", "finally", "for", "function", "if", "in", "instanceof", "new", "return", "switch", "this", "throw", "try", "typeof", "void", "while", "with"].toString();

var Compression = function(code){
	"use strict";
	code = code.toString().replace(reg.DoubleQuotedString,"\"\"")
		.replace(reg.SingleQuotedString,"\'\'")
		.replace(reg.MultiLineCComments,"")
		.replace(reg.SingleLineCComments,"")
		.replace(reg.Chars," $1 ")//格式化字符串
		.replace(reg.Empty," ");
	var lines = code.split("\n"),result;

	//#压缩代码

	for (var i=0,len = lines.length ;i<len ; ++i)
	{
		lines[i] = Compression.Trim(lines[i]);//全部收缩一边以便判断
	}
	//第一行特殊化，去除function()
	var firstLine = lines[0].substring(9);
	for (var i=0,len = firstLine.length,end;i<len ; ++i)
	{
		if (firstLine.charAt(i)==='('){
			end++;
		}else if (firstLine.charAt(i)===')'){
			if(!--end){
				lines[0] = firstLine.substring(1+i);
			}
		}
	}
	var chars1 = ".,{[";//可跨行编辑的首字符
	var chars2 = ".,";//可跨行编辑尾字符，进行合并行
	
	for (var i=0,j=0,len = lines.length-1;i<len ; ++i)
	{
		var str = lines[i],next = lines[j=i+1];
		if (str){
			if (next===""){
				for (++j;j<len ; ++j)
				{
					if(next = lines[j])break;
				}
			}
			//log("now:"+str);
			//log("next:"+next);
			var last = str.charAt(str.length-1);
			//log(chars2.indexOf(last));
			if ( last!== ';'){
				if (chars2.indexOf(last) !== -1){
					lines[i] += next;
					//log(lines[j] +"!!!!")
					lines[j] = "";
				}else
				if (chars1.indexOf(next.charAt(0)) === -1){
					lines[i]+=";";
				}
			}
		}
		//log(lines[i]);
	}
	///压缩代码
	result = lines.join(' ');
	//去除头尾{}
	result = result.substring(2,result.length-1);
	//收缩[]、{}、()
	result = Compression.Shrink(result,"[","]",' ');
	result = Compression.Shrink(result,"{","}",' ');
	result = Compression.Shrink(result,"(",")",' ');
	//去除多余代码段（非定义），去除var、function关键字
	//合并跨行代码段
	lines = result.split(";");
	/*
	for (var i=0,len = lines.length;i<len ; ++i)
	{
		log(lines[i]);
	}
	*/
	for (var i=0,len = lines.length;i<len ; ++i)
	{
		var str = lines[i];
		//log(str);
		if (str.indexOf(" var ") === str.indexOf(" function ")){//-1
			lines[i] = "";//清空
		}else{//去除关键字，压缩空格
			lines[i] = Compression.Trim(str.replace(" var ","").replace(" function ",""));
		}
		//log(lines[i]);
	}
	
	//最后一次收缩
	//过滤无关字符以及关键字
	lines = lines.join().split(',');
	for (var i=0,len = lines.length;i<len ; ++i)
	{
		var str = lines[i],
			em = str.indexOf(' ') ;
		//log(str);
		if (em!== -1){
			lines[i] = str.substring(0, em);
		}
	}
	
	result = Compression.ArrayCompact(lines)//.join();
	return Compression.ArrayUnique(result);
}
Compression.Trim = function(str) {
  whitespace = ' \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000';
  for (var i = 0,len = str.length; i < len; i++) {
    if (whitespace.indexOf(str.charAt(i)) === -1) {
      str = str.substring(i);
      break;
    }
  }
  for (i = str.length - 1; i >= 0; i--) {
    if (whitespace.indexOf(str.charAt(i)) === -1) {
      str = str.substring(0, i + 1);
      break;
    }
  }
  return whitespace.indexOf(str.charAt(0)) === -1 ? str : '';
}
Compression.Shrink = function(str,first,last,replaceChar,justOne){
	last = last||first;
	replaceChar = replaceChar||'';
	var begin = str.indexOf(first);
	for (var i=begin,len = str.length,end=0;i<len ; ++i)
	{
		if (str.charAt(i)===first){
			end++;
		}else if (str.charAt(i)===last){
			if(!--end){
				str =  str.substring(0,begin)+replaceChar+str.substring(1+i);
				if (justOne){
					return str;
				}

					len = str.length;
					if((i = begin = str.indexOf(first))===-1)
					{
						break;
					}else{
						i--;
						continue;
					}
				
			}
		}
	}
	return str;
}
Compression.ArrayUnique = function(arr){
	"use strict";
	var arrStr = '.'+arr.join('.')+'.',res = [];
	for (var i=0,j=0,len = arr.length;i<len ; ++i)
	{
		var item = arr[i];
		arrStr = arrStr.replace(item,'');
		if ( arrStr.indexOf('.'+item+'.') === -1 ){//Only one
			res[j++] = item;
		}
	}
	return res;
}
Compression.ArrayCompact = function(arr){
	"use strict";
	var res = [];
	for (var i=0,j=0,len = arr.length;i<len ; ++i)
	{
		if (arr[i]){
			res[j++] = arr[i];
		}
	}
	return res;
}




;

var namespace = {
	init:function(foo){
		"use strict";
		var N = {
			run:this.run,
			id: (++this.$$id)||(this.$$id = 0),
			arguments : "",
			packageFoo:this.packageFoo,
			code:[],
			out:function(){
				return this.code.join('\n');
			}
		};
			//log (this);
		( namespace['__item__']&&(namespace['__item__'][N.id] = N) )||(namespace.__item__ = [N]);
		//
		if (foo){
			return N.run(foo);
		}else{
			return N;
		}
	},
	shrinkFoo : function(foo){
		"use strict";
		var code = Compression.Shrink( foo.toString().replace("function",""),'(',')','',true).replace("{",'');
		for (var i=code.length-1,len = 0;i>=len ; --i)
		{
			if (code.charAt(i) === '}' ){
				code = code.substring(0,i);
				break;
			}
		}
		return code;
	},
	packageCode : function(code){
		"use strict";
		return "try{"+ code +"}catch(e){console.log(e)};";
	},
	run:function(foo){//call by init-N
			//log(this.id);
			if (foo){
				var newArgu = Compression.Trim( Compression(foo).join() );
				if (newArgu){
					if ( this.arguments ){
						 this.arguments +=',' + newArgu
					}else{
						 this.arguments = newArgu;
					}
				}
				//log(this.code.length);
				var code = this.code[this.code.length] = namespace.shrinkFoo(foo) ;
				eval( namespace.packageCode(code) );
				var self = this;
				
				eval("var returnFoo = function(){return function(foo){\n (function("+self.arguments+")"+Compression.Shrink( self.run.toString().replace("function",""),'(',')','',true)+").call(self, "+self.arguments +");return self;\n};}");
				//log(returnFoo);
				self.run = returnFoo();
				return self;
			}
			log("should get one function");
	}
	//
}





var N = namespace.init()
N.run(function(s,z){
	var a ="I'm a.",b="bbC";
	var c = {a:"I'm c'a."};
	log(a);
	function x(){
		log(a);
	}
})

N.run(function(){
	log(c.a+"in another place.");
	x();
})
N.run(function(){
	var obj= {
		arr:[1,2,3,4]
	}
})


log( N.out() )