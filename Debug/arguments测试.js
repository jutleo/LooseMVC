var fn  = function(){
	console.log(arguments.length);
}
fn({key:null}["key"]);
console.log(![].length)