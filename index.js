//参数list代表想要获取图片的网站的地址数组
var list = ["http://www.baidu.com","http://www.ouzni.com/usb"]
require('./libs/img').handleList(list,function(ret){
    console.log(ret);
})
