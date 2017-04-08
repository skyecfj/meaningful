/**
 * Created by Administrator on 2017/3/20.
 */
//这是我on.1的封装函数库
function domReady(fn) {
    if(document.addEventListener){
        //意味着你是现代浏览器
        document.addEventListener("DOMContentLoaded",fn,false);
    }else{
        var flag=false;
        function init() {
            if(!flag){
                fn();
                flag=true;
            }
        }
        //IE浏览器
        //严谨一点，并不是所有的网页都会触发onreadystatechange，因此我们要借助另外的一个事件
        //特点：DOM没有加载完毕之前，你去调用滚动条，会报错

        //捕获异常（错误），我知道你这段代码可能会报错，但是呢，我又想让它不影响程序的运行
        (function () {
            try{
                document.documentElement.doScroll("left");
            }catch(e){  //报错信息都存在这个里面
                //如果报错，就到这里来，不会终止程序的运行
                //再来一次  利用延迟
                setTimeout(arguments.callee,50);
                //注意return;
                return;
            }
            init();
        })()

        //DOM加载是有过程的，每次过程的改变，都会触发这个函数
        //有四个步骤  最后一步是complete完成
        // document.onreadystatechange=function () {
        //     if(document.readystate=="complete"){
        //         init();
        //     }
        // }
    }
}

//$("a p")
function $(str) {
    var element;
    //以#开头
    if(str.indexOf("#")==0){
        element=document.getElementById( str.substring(1) );
    }else if(str.indexOf(".")==0){
        element=document.getElementsByClassName( str.substring(1)  );
    }else {
        //先暂留一下，后面再解决
        element=document.getElementsByTagName( str  );
    }
    return element;
}

//得到六位时间00:00:00
function getTime() {
    var date=new Date();
    var h=date.getHours();
    var m=date.getMinutes();
    var s=date.getSeconds();
    var time=toTwo(h)+toTwo(m)+toTwo(s);

    return time;
}
//补0
function toTwo(n) {
    return n<10?"0"+n:""+n;
}

//判断闰年
function isLeapYear(year) {
    return (  (year%4==0 && year%100!=0)|| year%400==0  );
}

//获得样式
function getStyle(obj,attr) {
    if(obj.currentStyle){
        //ie
        return obj.currentStyle[attr];
    }else {
        //firefox   google
        return getComputedStyle(obj.false)[attr];
    }
}

//获得前面第一个不为零的兄弟节点
function get_prev(n) {
    var x=n.previousSibling;
    //判断
    while(  x.nodeType!=1   ){
        x=x.previousSibling;
    }
    return x;
}

//获得后面第一个不为零的兄弟节点
function get_next(n) {
    var x=n.nextSibling;
    //判断
    while(  x.nodeType!=1   ){
        x=x.nextSibling;
    }
    return x;
}

//要求：找出这个字符串里面所有的数字，如果数字相连，那么则输出相连的数字
function findNum(str) {
    var arr=[];
    var temp="";
    for(var i=0;i<str.length;i++){
        //数字：大于等于0 小于等于9
        if(  str.charAt(i)<="9" && str.charAt(i)>=0 ){
            //我要看下一个是不是数字，如果是，则继续。如果不是，则添加到arr里面
            temp+=str.charAt(i);
        }else {
            if(temp){
                arr.push(temp);
                temp="";
            }
        }
    }
    //处理以下最后的数字
    if(temp){
        arr.push(temp);
        temp="";
    }
    return arr;
}

//封装事件相关的方法和属性
var eventUtil={
    //添加事件
    addEvent:function (element,type,fn) {
        if(element.addEventListener){
            //兼容支持addEventListener这个方法的浏览器
            element.addEventListener(type,fn,false);
        }else if(element.attachEvent){
            //兼容IE浏览器
            element.attachEvent("on"+type,fn);
        }else {
            //兼容低版本的浏览器，因为低版本浏览器只支持xxx.onclick=xxx
            element["on"+type]=fn;
        }
    },
    //删除事件
    removeEvent:function (element,type,fn) {
        if(element.removeEventListener){
            //兼容支持addEventListener这个方法的浏览器
            element.removeEventListener(type,fn,false);
        }else if(element.detachEvent){
            //兼容IE浏览器
            element.detachEvent("on"+type,fn);
        }else {
            //兼容低版本浏览器，因为低版本浏览器只支持xxx.onclick=xxx
            element["on"+type]=null;
        }
    },
    //阻止事件冒泡
    stopPro:function (event) {
        if(event.stopPropagation){
            event.stopPropagation();
        }else {
            //兼容IE
            event.cancelBubble=true;
        }
    },
    //阻止浏览器的默认行为
    stopDefault:function (event) {
        if(event.preventDefault){
            event.preventDefault();
        }else{
            //兼容IE
            event.returnValue=false;
        }
    },
    //可以获取到触发这个事件的元素的
    getElement:function (event) {
              //w3c                   ie
        return event.target   ||  event.srcElement;
    }
}



