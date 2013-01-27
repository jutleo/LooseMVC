
try
{
	console.log("test");
}
catch (e)
{
	console= {
		log : document.write
	}
}


var str = "2";
str.id="ids";
var obj = {
	firstname : "gaubee",
		lasrname:"bangeel"
};
var any = function(){
	console.log(arguments.length);
	console.log(arguments[0]);
	arguments[0] = "1";
	console.log(arguments[0]);
}
any(str,obj);

	console.log( str );
//结论 

//内部对象的arguments，形式参数和arguments之间不再有同步变化

//IE6无效，nodejs无效