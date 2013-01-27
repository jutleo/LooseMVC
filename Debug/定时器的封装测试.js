var Package = function(fn,time,objarr)
{


	time = time||0;
	
	setTimeout(function(){
		if (typeof objarr ==="object"){
			for (var i in objarr)
			{
				arguments[arguments.length] = objarr[i];
				arguments.length++;
			}
		}else{
			if (objarr!==undefined){
				arguments[0] = objarr;
				arguments.length++;				
			}
		}
		fn.apply(fn,arguments);
	},time);
}

for (var i=0;i<10 ; ++i)
{
	Package(function(time){
		console.log(time.a);
	},i,[{a:i}]);
}

