var namespace=function(){
  var content='';
  var a=arguments,al=arguments.length;
  for(var i=0;i<al;++i){
    if(typeof a[i] == 'function'){
      var fn=String(a[i]);
      content+=fn.substr(11);
    }else{ eval(a[i])}
  }
  alert(content);
  namespace.content=namespace.content?namespace.content+content:content;
eval(namespace.content);
}; 
namespace(30);

namespace(function(){
var x=90;
});
namespace(function(){
alert(x);
});