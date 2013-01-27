var test = function(data){
	console.log(arguments.length);
	var type = typeof arguments[0];
	console.log( arguments[0]);
};
test();

var fn = function(){
	return "zzz";
}
var b = (b+1)||0;
console.log(b);
var a = a&&a.push("a")||[fn()];
console.log(a);
var z;
try
{
	z.push("ss1");
}
catch (e)
{
	z = ["sss2"];
}
try
{
	z.push("ss1");
}
catch (e)
{
	z = ["sss2"];
}
console.log(z);