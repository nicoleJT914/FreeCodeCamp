/**
 * Created by saio on 16/10/22.
 */
var data = [];
var dataStr = '1、苏州月亮湾<br>\
<br>\
第一次去苏州看你，吃了烤肉后，在月亮湾散步，对苏州这个城市有莫名的喜爱<br>\
<br>\
<br>\
2、厦门大学<br>\
<br>\
还记得为什么拍照吗？因为你的小米手机照相时有一个看屏幕角落更美丽的功能~<br>\
<br>\
<br>\
3、云南玉龙雪山<br>\
<br>\
一起在缆车上，因为怕冷，穿了你的衣服，你还去租了羽绒服<br>\
<br>\
<br>\
4、西安火车站<br>\
<br>\
第一次一起出去旅游，跟凯凯他们，我们正一起在火车站等车<br>\
<br>\
<br>\
5、厦门植物园<br>\
<br>\
那个时候你好瘦呀！大一的你，大二的我。第一次去厦门找你，我们在最热的时候去了植物园<br>\
<br>\
<br>\
6、西安蛋糕DIY<br>\
<br>\
一周年纪念！我们唯一一次在周年出去庆祝，多亏了你，才能有上面的娃娃。当然还有好吃到不行的面包皮~<br>\
<br>\
<br>\
7、云南香格里拉<br>\
<br>\
折磨人的小破车，一路上坐车都快死了，中途下来透透气<br>\
<br>\
<br>\
8、西安你的家<br>\
<br>\
咱们一起拼的拼图，哈哈，真的好厉害呢~<br>\
<br>\
<br>\
9、云南玉龙雪山？<br>\
<br>\
唉，不多说了。。。。真是张悲伤到不行的图片~<br>\
<br>\
<br>\
10、云南虎跳峡<br>\
<br>\
还能依稀想起来，明明来大姨妈肚子疼到不行，还在不停的走走走，真的要死了<br>\
<br>\
<br>\
11、云南纳木措公园<br>\
<br>\
带着一群病号逛公园，还有草场上胖嘟嘟的马儿，偶尔能见到的小松鼠<br>\
';


var photoEach = dataStr.split('<br><br><br>');
for (var i=0; i<photoEach.length; i++) {
    var photoPart = photoEach[i].split('<br><br>');
    data.push({
        img: 'figure' + photoPart[0].split('、')[0] + '.jpg',
        caption: photoPart[0].split('、')[1],
        desc: photoPart[1]
    })
}
//通用函数
function $$(selector, context) {
    context = context || document;
    var elements = context.querySelectorAll(selector);
    return Array.prototype.slice.call(elements);
}
//输出所有海报
(function addPhotos() {
    var template = $$('.photo-wrap')[0];
    var templateText = template.innerHTML;
    var html = [];
    data.forEach(function(item, index){
        var _html = templateText
            .replace('{{image}}', 'figure'+(index+1)+'.jpg')
            .replace('{{caption}}', item.caption)
            .replace('{{desc}}', item.desc);
        html.push(_html);
    });
    template.innerHTML = html.join('');
}) ();
