
var namespace=function(){
 var NSpace={
    content:'',
    fn:function(){},
     Cloud:function(evalStr){eval(evalStr);},
     Get:function(arg){},
    Run:function(){
      this.fn='this.fn=function(arg){' +this.content +'this.Get=function(arg){if(typeof arg=="string"){return eval(arg);}};' +'return this.Get;' +'}';
      alert(this.fn);
      eval(this.fn);
      this.fn();},
    Add:function(fn){
       if(typeof fn=='function'){
         this.content+=String(fn).substr(11);
       }
     }
  }

if(typeof arguments[0]=='string'){
  var ns=arguments[0].split('.');
  var nsLink= this; //应用程序名或已知父级
  var L=ns.length-1;
  for(var i=0;i<L;++i) {
      if(!nsLink[ns[i]]){ nsLink[ns[i]]={} ;}
      nsLink=nsLink[ns[i]];
    }
   nsLink[ns[L]]=NSpace;
  } 
return NSpace;
}; 
var Test1=namespace('x.x.x');
Test1.Add(function(){
var x=80;
alert(this);
});
Test1.Add(function(){
alert(x);
});
Test1.Run();
//alert(Test1.Get);
alert(Test1.Get('x'));
alert(x.x.x.Get('x'))