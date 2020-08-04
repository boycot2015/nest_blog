var TemplateEngine = function(html, options) {
    var re = /<%([^%>]+)?%>/g, reExp = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g, code = 'var r=[];\n', cursor = 0;
    var add = function(line, js) {
        js? (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n') :
            (code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
        return add;
    }
    while(match = re.exec(html)) {
        add(html.slice(cursor, match.index))(match[1], true);
        cursor = match.index + match[0].length;
    }
    add(html.substr(cursor, html.length - cursor));
    code += 'return r.join("");';
    return new Function(code.replace(/[\r\t\n]/g, '')).apply(options);
}
// 定义公共方法
var commonObj = {
    progressPsition: '' // 进度条位置
}
//传入参数为文件路径,return 出返回值的responseText文本
function getTpl(fileUrl) {
    var result = $.ajax({
        type: "GET",
        url: fileUrl,
        async: false
    });
    return result.responseText;
};


function drag(obj,target,site,fn){
    var dmW = document.documentElement.clientWidth || document.body.clientWidth  
    var dmH = document.documentElement.clientHeight || document.body.clientHeight
    var site = site || {};               
    var adsorb = site.n || 0;              //磁性吸附的吸附范围
    var l = site.l || 0;
    var r = (site.r || site.r==0)?site.r:dmW - target.offsetWidth;
    var t = site.t || 0;
    var b = (site.b || site.b==0)?site.b:dmH - target.offsetHeight; 
    obj.onmousedown=function(ev){
       var oEvent = ev || event;
       var siteX = oEvent.clientX- target.offsetLeft;
       var siteY = oEvent.clientY- target.offsetTop;
       if(obj.setCapture){                  //兼容IE低版本的阻止默认行为，并实现事件捕获
          obj.onmousemove=move;
          obj.onmouseup=up;
          obj.setCapture();
       }else{
          document.onmousemove=move;
          document.onmouseup=up;
       }
        function move(ev){
            var oEvent = ev || event;
            var iLeft = oEvent.clientX - siteX;
            var iTop = oEvent.clientY - siteY;
            if(iLeft <=l+adsorb){              //限制拖动范围
                iLeft=0;
            }
            if(iLeft >=r-adsorb){
                iLeft= r;
            }
            if(iTop<=t+adsorb){
                iTop =0;
            }
            if(iTop >=b-adsorb){
                iTop = b;
            }
            if(fn){                         //执行回调函数，如果有其他附加情况需要处理
                fn({left:iLeft,top:iTop})
            }
            $(obj).find('.point').show()
            target.style.left = iLeft + 'px';
            target.style.top = iTop + 'px';
        }
        function up(){
            var oEvent = ev || event;
            var iLeft = oEvent.clientX - siteX;
            var iTop = oEvent.clientY - siteY;
            if(obj.setCapture){            //拖放结束后释放捕获
                obj.releaseCapture();
            }
            this.onmousemove=null;
            this.onmouseup=null;
            this.onclick=null;
        }
        return false;
    }
 }