var fn = function(){
	console.log(arguments.length);
}
fn("asd","123");

(function(){
	console.log(arguments.length);
	fn.apply(this,arguments);
	fn.call(this,arguments);
})("asd","123",false);