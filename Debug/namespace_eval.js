log = console.log;
//log(Function("return function(nextFoo){ (function(a,b){eval( self.packageFoo(nextFoo) );return self;}).apply(self,self.arguments);  };").toString());
function Stack(){   }
Stack.prototype = {
    add: function(el, pt){
        this._first =  pt = {//_first是不断变的
            _next:this._first,
            el: el
        }
        if (pt._next) {
            pt._next._prev = pt;
        }
        return this;
    }
}
var s = new Stack;
var obj = {};
obj.length = 0;
obj.push = function(item){
	var len = this.length++;
	this[len] = item;
	return this;
}
obj.pop = function(){
	var len = --this.length;
	if (len>=0){
		this[len] = undefined;
		return this[len]
	}
}
var arr = []
for (var i=100000000,len = 0;i>len ; i--)
{
	arr.push(i)
	//obj.push(i);
}
var begin = Date.now();
for (var i=100000000,len = 0;i>len ; i--)
{
	arr.pop(i)
	//obj.pop(i);
}
var end = Date.now();
log(end-begin);
