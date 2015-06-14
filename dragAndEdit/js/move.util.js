(function (window) {
    var u = {};

    var ie = document.all;
    var nn6 = document.getElementById && !document.all;
    var isdrag = false;
    var y, x;
    var oDragObj;

    var DRAGABLE_CLASS = "dragable";


    /**
     * 鼠标移动事件
     * @param e
     */
    function moveMouse(e) {
        if (isdrag && !isDragLock) {
            oDragObj.style.top = (nn6 ? nTY + e.clientY - y : nTY + event.clientY - y) + "px";
            oDragObj.style.left = (nn6 ? nTX + e.clientX - x : nTX + event.clientX - x) + "px";
            return false;
        }
    }

    /**
     * 初始化拖动
     * @param e
     * @returns {boolean}
     */
    function initDrag(e) {
        var oDragHandle = nn6 ? e.target : event.srcElement;
        var topElement = "HTML";
        while (oDragHandle.tagName != topElement && oDragHandle.className.indexOf(DRAGABLE_CLASS) == -1) {
            oDragHandle = nn6 ? oDragHandle.parentNode : oDragHandle.parentElement;
        }
        if (oDragHandle.className.indexOf(DRAGABLE_CLASS) != -1) {
            isdrag = true;
            oDragObj = oDragHandle;
            var dragTop = oDragObj.style.top;
            var dragLeft = oDragObj.style.left;
            var dragHeight = oDragObj.clientHeight;
            var dragWidth = oDragObj.clientWidth;
            nTY = parseInt(dragTop + 0);
            y = nn6 ? e.clientY : event.clientY;
            nTX = parseInt(dragLeft + 0);
            x = nn6 ? e.clientX : event.clientX;

            return false;
        }
    }

    /**
     * 绑定鼠标事件
     */
    $(document).on("mousedown",function(e){
        initDrag(e);
    }).on("mousemove", function (e) {
        moveMouse(e);
    }).on("mouseup",function(e){
        isdrag=false;
    });

    var isDragLock = false;

    u.setLockDrag = function (isLock) {
        isDragLock = isLock;
    };

    /**
     * 初始化是否可以拖动
     * @param $el 元素
     * @param isDragable 是否可以拖动
     */
    u.dragable = function($el,isDragable){
        if($el){
            if(typeof isDragable == "undefined" || isDragable){
                $el.addClass(DRAGABLE_CLASS);
            }else{
                $el.removeClass(DRAGABLE_CLASS);
            }
        }
    };

    window.moveUtil = u;
})(window);