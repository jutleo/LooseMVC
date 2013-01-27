var arr = [];
for(var i = 0 ;i<100;i+=2){
	arr[i] = i;
}
console.log(arr.join(","));
//结论：数值会自动拓展，跳跃性的