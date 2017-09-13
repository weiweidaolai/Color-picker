
var colorTotal = document.getElementById("color_total");//右侧长方形canvas画布
var context = colorTotal.getContext("2d");
var gradient = context.createLinearGradient(0,0,0,300);
var obox=document.getElementById("colorselbox");
var odrag=document.getElementById("colorselect");
var colorshow = document.getElementById("colorshow");
var circle = document.getElementById("circle");
var offtop=document.getElementById("frame").offsetTop+document.body.scrollTop;
var offleft=document.getElementById("frame").offsetLeft;
var ctx = colorshow.getContext("2d");
var isDrag = false;
var y;

(function(){
  //初始化总色彩盘
  gradient.addColorStop(0,"rgb(255,0,0)");
  gradient.addColorStop(1/6,"rgb(255,255,0)");
  gradient.addColorStop(1/3,"rgb(0,255,0)");
  gradient.addColorStop(1/2,"rgb(0,255,255)");
  gradient.addColorStop(2/3,"rgb(0,0,255)");
  gradient.addColorStop(5/6,"rgb(255,0,255)");
  gradient.addColorStop(1,"rgb(255,0,0)");
  context.fillStyle = gradient;
  context.fillRect(0,0,20,300);
  odrag.style.left = "0px";
  odrag.style.top = "0px";
  circle.style.left=offleft+"px";
  circle.style.top=offtop+"px";
  //初始化左侧色彩盘
  triangleSelect();
  //在右侧显示rgb与hsl值
  textshow();
})()
//获取圆圈颜色信息
function getcircleHSVColor(){
  var x=parseInt(circle.style.left.replace("px","")-offleft+5);
  var y=parseInt(circle.style.top.replace("px","")-offtop+5);
  h=parseInt((odrag.style.top.replace("px",""))/300*360)
  s=(x/300).toFixed(2);
  v=(1-(y/300)).toFixed(2);
  console.log("hsv"+h+" "+s+" "+v)
  var list=[h,s,v]
  return list;
}
//色彩总盘点击
odrag.addEventListener("mousedown",function(e){
      y=e.clientY-this.offsetTop;
      isDrag = true;
},false);
//色彩总盘拖动
document.addEventListener("mousemove",function(e){
    if(isDrag){
      if((e.clientY-y)>=310){
          odrag.style.top = "300px";
      }
      else if((e.clientY-y)<=0){
        odrag.style.top = "0px";
      }
      else{
        odrag.style.top = (e.clientY-y)+"px";
      }
      triangleSelect();
      textshow();
    }
}, false)
//色彩总盘选中
document.addEventListener("mouseup",function(){
  isDrag = false;
}, false)
//选中分色彩盘中颜色，右侧显示对应rgb与hsl
colorshow.addEventListener("click",function(e){
  circle.style.top = parseInt(e.clientY-5) + "px";
  circle.style.left = parseInt(e.clientX-5) + "px";
  textshow();
},false)
//右侧显示器显示对应rgb与hsl
function textshow(){
  var hsv=getcircleHSVColor();
  var list=HSVtoRGB(hsv[0],hsv[1],hsv[2])
  document.getElementById("r").value = list[0];
  document.getElementById("g").value = list[1];
  document.getElementById("b").value = list[2];
  document.getElementById("show").style.backgroundColor="rgb("+list[0]+","+list[1]+","+list[2]+")";
  var listH=RGBtoHSL(list[0], list[1], list[2]);
  document.getElementById("h").value = listH[0];
  document.getElementById("s").value = listH[1];
  document.getElementById("l").value = listH[2];

}
//计算颜色，主要用来计算总色彩盘的颜色
function averColor(x,y,data){
  var r=0,g=0,b=0;
  for (var row = 0; row < y; row++) {
      for (var col = 0; col < x; col++) {
          r += data[((x * row) + col) * 4];
          g += data[((x * row) + col) * 4 + 1];
          b += data[((x * row) + col) * 4 + 2];
      }
  }
  // 求取平均值
 r /= (x * y);
  g /= (x * y);
  b /= (x * y);
  // 将最终的值取整
  r = Math.round(r);
  g = Math.round(g);
  b = Math.round(b);
  var list=[r,g,b];
  return list;
}
//渲染分色彩盘
function triangleSelect(){
  var colorY = parseInt(odrag.style.top.replace("px",""));
  var imgData = context.getImageData(0,colorY,2,2);
  var data = imgData.data;
  var list=averColor(imgData.width,imgData.height,data);
  var grdt = ctx.createLinearGradient(0,0,300,0);
  grdt.addColorStop(0,"rgba(255,255,255,1)");
  grdt.addColorStop(1,"rgb("+list[0]+","+list[1]+","+list[2]+")")
  ctx.fillStyle = grdt;
  ctx.fillRect(0,0,300,300);
  var grdtx = ctx.createLinearGradient(0,0,0,300);
  grdtx.addColorStop(0,"rgba(0,0,0,0)");
  grdtx.addColorStop(1,"rgba(0,0,0,1)")
  ctx.fillStyle = grdtx;
  ctx.fillRect(0,0,300,300);
}
//改变右侧显示器中rgb
function changeRGB(){
  var RGBlist=getRGB();
  var HSlist=RGBtoHSL(RGBlist[0], RGBlist[1], RGBlist[2]);
  document.getElementById("h").value = HSlist[0];
  document.getElementById("s").value = HSlist[1];
  document.getElementById("l").value = HSlist[2];
  colorbarposHSL(HSlist[0]);
  var hsv=RGBtoHSV(RGBlist[0], RGBlist[1], RGBlist[2]);
  circle.style.left=offleft+hsv[1]*300-0+"px";
  circle.style.top=offtop+300-hsv[2]*300+0+"px";
  document.getElementById("show").style.backgroundColor="rgb("+RGBlist[0]+","+RGBlist[1]+","+RGBlist[2]+")";

}
//改变右侧显示器中hsl
function changeHSL(){
  var h = document.getElementById("h").value ||0;
  var s = document.getElementById("s").value ||0;
  var l = document.getElementById("l").value ||0;
  h=parseInt(h);
  s=parseFloat(s);
  l=parseFloat(l);
  colorbarposHSL(h);
  var list=HSLtoRGB(h,s,l);
  console.log(list[0]+" "+list[1]+" "+list[2])
  document.getElementById("r").value = list[0];
  document.getElementById("g").value = list[1];
  document.getElementById("b").value = list[2];
  document.getElementById("show").style.backgroundColor="rgb("+list[0]+","+list[1]+","+list[2]+")";
  var hsv=RGBtoHSV(list[0],list[1],list[2]);
  circle.style.left=offleft+hsv[1]*300-0+"px";
  circle.style.top=offtop+300-hsv[2]*300+0+"px";
}
function getRGB(){
  var r=document.getElementById("r").value || 0;
  var g=document.getElementById("g").value || 0;
  var b=document.getElementById("b").value || 0;
  if(r>255||g>255||b>255||r<0||g<0||b<0){
    alert("请输入0-255间的整数")
  }
  else{
    return [parseInt(r), parseInt(g), parseInt(b)]
  }
}

//根据HSL中h定位颜色条,
function colorbarposHSL(h){
  odrag.style.top = parseInt(h*300/360)+"px";
  triangleSelect();
}

document.getElementById("r").addEventListener("keyup",changeRGB,false)
document.getElementById("g").addEventListener("keyup",changeRGB,false)
document.getElementById("b").addEventListener("keyup",changeRGB,false)
document.getElementById("h").addEventListener("keyup",changeHSL,false)
document.getElementById("s").addEventListener("keyup",changeHSL,false)
document.getElementById("l").addEventListener("keyup",changeHSL,false)
document.getElementsByClassName("up")[0].addEventListener("click",function(){
  document.getElementById("r").value=parseInt(document.getElementById("r").value)+1;
  changeRGB();
},false)
document.getElementsByClassName("down")[0].addEventListener("click",function(){
  document.getElementById("r").value=parseInt(document.getElementById("r").value)-1;
  changeRGB();
},false)
document.getElementsByClassName("up")[1].addEventListener("click",function(){
  document.getElementById("g").value=parseInt(document.getElementById("g").value)+1;
  changeRGB();
},false)
document.getElementsByClassName("down")[1].addEventListener("click",function(){
  document.getElementById("g").value=parseInt(document.getElementById("g").value)-1;
  changeRGB();
},false)
document.getElementsByClassName("up")[2].addEventListener("click",function(){
  document.getElementById("b").value=parseInt(document.getElementById("b").value)+1;
  changeRGB();
},false)
document.getElementsByClassName("down")[2].addEventListener("click",function(){
  document.getElementById("b").value=parseInt(document.getElementById("b").value)-1;
  changeRGB();
},false)
document.getElementsByClassName("up")[3].addEventListener("click",function(){
  document.getElementById("h").value=parseFloat(document.getElementById("h").value)+1;
  changeHSL();
},false)
document.getElementsByClassName("down")[3].addEventListener("click",function(){
  document.getElementById("h").value=parseFloat(document.getElementById("h").value)-1;
  changeHSL();
},false)
document.getElementsByClassName("up")[4].addEventListener("click",function(){
  document.getElementById("s").value=(parseFloat(document.getElementById("s").value)+0.01).toFixed(2);
  changeHSL();
},false)
document.getElementsByClassName("down")[4].addEventListener("click",function(){
  document.getElementById("s").value=(parseFloat(document.getElementById("s").value)-0.01).toFixed(2);
  changeHSL();
},false)
document.getElementsByClassName("up")[5].addEventListener("click",function(){
  document.getElementById("l").value=(parseFloat(document.getElementById("l").value)+0.01).toFixed(2);
  changeHSL();
},false)
document.getElementsByClassName("down")[5].addEventListener("click",function(){
  document.getElementById("l").value=(parseFloat(document.getElementById("l").value)-0.01).toFixed(2);
  changeHSL();
},false)
