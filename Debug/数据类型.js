var str = new String("hello");
str.set = function(chars){
	str = chars;
}
var str2 = str+" world";
console.log(str2);
console.log(str.set);
//var str3 = new str();//不是构造函数
str.set("kiss");
console.log(str);
console.log(str.set);//原有的方法已经被丢弃