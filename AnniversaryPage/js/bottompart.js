/**
 * Created by saio on 16/10/27.
 */
(function (window) {
    function init() {
        var btnItems = [].slice.call(document.querySelectorAll('.btn-item')),
            content = ["你在凯凯的生日上问我......", "转眼间就过去了一年，从开始我们就开始异地......", "跟你在一起的日子总是很开心，虽然我们经常争吵TT", "暑假我们总是能待在一起，这是我们能相聚最长的日子了......", "现在你上班了，我们也没有能够经常见面，不过这一切都不是问题......", "因为等我也上班了，我们就能马上在一起喽......"],
            descContent = document.querySelector('.desc>.content'),
            setCurrent = function ( item, idx) {
                if (classie.hasClass( item, 'btn-current' )) {
                    return false;
                }
                else {
                   var currentItem = document.querySelector('.btn-current');
                    classie.removeClass(currentItem,'btn-current');
                    classie.addClass(item,'btn-current');
                    changeContent( idx );
                }
            },
            changeContent = function (num) {
                descContent.innerHTML = content[num];
            };
        btnItems.forEach(function (btnItem, idx) {
            btnItem.addEventListener('click',function () {
                setCurrent(btnItem, idx);
            })
        });
        descContent.innerHTML = content[0];
    }
    init();
})(window);