/**
 * 获得base64
 * @param {Object} obj
 * @param {Number} [obj.width] 图片需要压缩的宽度，高度会跟随调整
 * @param {Number} [obj.quality=0.8] 压缩质量，不压缩为1
 * @param {Function} [obj.before(this, blob, file)] 处理前函数,this指向的是input:file
 * @param {Function} obj.success(obj) 处理后函数
 * @example
 *
 */
import $ from 'jquery';
import EXIF from './exif.js';
$.fn.localResizeIMG = function(obj) {

    this.on('change', function() {
        var file = this.files[0];
        var URL = window.URL || window.webkitURL;
        var blob = URL.createObjectURL(file);
        var _this = this;
        //利用exif 矫正图片。需要日提前引入exif.js
        EXIF.getData(file, function() {
            EXIF.getAllTags(this);
            //alert(EXIF.getTag(this, 'Orientation'));
            var Orientation = EXIF.getTag(this, 'Orientation');

            //return;

            _create(blob, file,Orientation);
            // 执行前函数
            if ($.isFunction(obj.before)) {
                obj.before(_this, blob, file)
            }
            _this.value = ''; // 清空临时数据
        });


    });

    /**
     * 生成base64
     * @param blob 通过file获得的二进制
     */
    function _create(blob,file,Orientation) {
        var img = new Image();
        img.src = blob;

        img.onload = function() {
            var that = this;

            //生成比例

            var w = that.width,
                h = that.height,
                scale = w / h;
            w = obj.width || w;
            h =  w / scale;
            console.log('w,h:',w,h,that.width,that.height,scale);
            //生成canvas
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            var maxw = w>h ? w : h,minw = w<h ? w : h;
            var cvs2w = w,cvs2h = h;

            $(canvas).attr({
                width: maxw,
                height: maxw
            });

            console.log('Orientation2',Orientation);
            switch(Orientation){
                case 2:
                    ctx.translate(maxw, 0);
                    ctx.scale(-1, 1);
                    break;
                case 3:
                    ctx.translate(maxw, maxw);
                    ctx.rotate(Math.PI);
                    break;
                case 4:
                    ctx.translate(0, maxw);
                    ctx.scale(1, -1);
                    break;
                case 5:
                    ctx.rotate(0.5 * Math.PI);
                    ctx.scale(1, -1);
                    break;
                case 6:
                    cvs2w = h;cvs2h=w;
                    ctx.rotate(0.5 * Math.PI);
                    ctx.translate(0, -minw);
                    break;
                case 7:
                    ctx.rotate(0.5 * Math.PI);
                    ctx.translate(maxw, -maxw);
                    ctx.scale(-1, 1);
                    break;
                case 8:
                    cvs2w = h;cvs2h=w;
                    ctx.rotate(-0.5 * Math.PI);
                    ctx.translate(-maxw,0);
                    break;
                default:
                    ctx.rotate(0);
                    break;
            }
            ctx.drawImage(that, 0, 0,w,h);
            var cvs2 = _getCanvas(cvs2w, cvs2h);
            var ctx2 = cvs2.getContext('2d');
            ctx2.drawImage(canvas, 0, 0, cvs2w, cvs2h, 0, 0, cvs2w, cvs2h);
            canvas = cvs2;
            /**
             * 生成base64
             * 兼容修复移动设备需要引入mobileBUGFix.js
             */
            var base64 = canvas.toDataURL('image/jpeg', obj.quality || 0.8);

            // 修复IOS
            if (navigator.userAgent.match(/iphone/i)) {
                var mpImg = new MegaPixImage(img);
                mpImg.render(canvas, {
                    maxWidth: w,
                    maxHeight: h,
                    quality: obj.quality || 0.8
                });
                base64 = canvas.toDataURL('image/jpeg', obj.quality || 0.8);
            }

            // 修复android
            if (navigator.userAgent.match(/Android/i)) {
                var encoder = new JPEGEncoder();
                base64 = encoder.encode(ctx2.getImageData(0, 0, cvs2w, cvs2h), obj.quality * 100 || 80);
            }

            // 生成结果
            var result = {
                base64: base64,
                clearBase64: base64.substr(base64.indexOf(',') + 1)
            };

            // 执行后函数
            obj.success(result);
        };
    }
    function _getCanvas(width, height) {
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        return canvas;
    }

};

export default $;




// 例子
/*
$('input:file').localResizeIMG({
    width: 100,
    quality: 0.1,
    //before: function (that, blob) {},
    success: function (result) {
        var img = new Image();
        img.src = result.base64;

        $('body').append(img);
        console.log(result);
    }
});
*/
