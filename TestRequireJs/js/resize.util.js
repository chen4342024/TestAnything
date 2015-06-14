
//创建可改变大小的div
//只需在div的class上加上 resize-all


(function (window) {
    var u =  {

    };

    var leftObject = null; //This gets a value as soon as a resize start

    var RESIZE_ALL = "resize-all";
    var RESIZE_RIGHT = "resize-right";
    var Direction = {
        LEFT:"w",
        RIGHT:"e",
        TOP:"n",
        BOTTOM:"s"
    };

    function ResizeObject() {
        this.el = null;         //pointer to the object
        this.dir = "";          //type of current resize (n, s, e, w, ne, nw, se, sw)
        this.grabx = null;      //Some useful values
        this.graby = null;
        this.width = null;
        this.height = null;
        this.left = null;
        this.top = null;
    }


    /**
     * 获取方向
     * @param el 当前事件触发的元素
     */
    function getDirection(el) {
        var xPos, yPos, offset, dir;
        dir = "";

        xPos = window.event.offsetX;
        yPos = window.event.offsetY;

        offset = 8; //The distance from the edge in pixels

        if (yPos < offset) {
            dir += Direction.TOP;
        }
        else if (yPos > el.offsetHeight - offset) {
            dir += Direction.BOTTOM;
        }
        if (xPos < offset) {
            dir += Direction.LEFT;
        }
        else if (xPos > el.offsetWidth - offset) {
            dir += Direction.RIGHT;
        }

        return dir;
    }


    /**
     * 鼠标按下时候触发的事件
     */
    function mouseDownHandler() {
        var el = getReal(event.srcElement, RESIZE_ALL);
        var er = getReal(event.srcElement, RESIZE_RIGHT);

        if (el == null) {
            leftObject = null;
            return;
        }

        dir = getDirection(el);
        if (dir == "") return;

        leftObject = new ResizeObject();

        leftObject.el = el;
        leftObject.dir = dir;

        leftObject.grabx = window.event.clientX;
        leftObject.graby = window.event.clientY;
        leftObject.width = el.offsetWidth;
        leftObject.height = el.offsetHeight;
        leftObject.left = el.offsetLeft;
        leftObject.top = el.offsetTop;

        window.event.returnValue = false;
        window.event.cancelBubble = true;
    }


    /**
     * 鼠标松开时候触发的事件
     */
    function mouseUpHandler() {
        if (leftObject != null) {
            leftObject = null;
        }
    }

    /**
     *  改变光标样式
     */
    function changeCursor(el){
        var str;
        if (el.className.indexOf(RESIZE_ALL) != -1 ) {
            str = getDirection(el);

            if (str == "") {
                str = "";
            }
            else {
                str += "-resize";
            }
            el.style.cursor = str;
        }
    }


    /**
     * 鼠标移动时候触发的事件
     */
    function mouseMoveHandler() {
        var el, er, xPos, yPos, xMin, yMin;

        xMin = 50; // div最小宽度
        yMin = 50; // div最小高度

        el = getReal(event.srcElement, RESIZE_ALL);
        er = getReal(event.srcElement, RESIZE_RIGHT);

        if(el){
            changeCursor(el);
        }

        //Dragging starts here
        if (leftObject != null) {

            if (dir.indexOf(Direction.RIGHT) != -1){
                leftObject.el.style.width = Math.max(xMin, leftObject.width + window.event.clientX - leftObject.grabx) + "px";
            }

            if (dir.indexOf(Direction.BOTTOM) != -1){
                leftObject.el.style.height = Math.max(yMin, leftObject.height + window.event.clientY - leftObject.graby) + "px";
            }

            if (dir.indexOf(Direction.LEFT) != -1) {
                leftObject.el.style.left = Math.min(leftObject.left + window.event.clientX - leftObject.grabx, leftObject.left + leftObject.width - xMin) + "px";
                leftObject.el.style.width = Math.max(xMin, leftObject.width - window.event.clientX + leftObject.grabx) + "px";
            }
            if (dir.indexOf(Direction.TOP) != -1) {
                leftObject.el.style.top = Math.min(leftObject.top + window.event.clientY - leftObject.graby, leftObject.top + leftObject.height - yMin) + "px";
                leftObject.el.style.height = Math.max(yMin, leftObject.height - window.event.clientY + leftObject.graby) + "px";
            }

            window.event.returnValue = false;
            window.event.cancelBubble = true;
            callResizeChangeHandler("resizing",e);
        }
    }


    /**
     * 获取真正需要移动的元素
     * @param el  当前事件触发的元素
     * @param value class的值
     * @returns {*}
     */
    function getReal(el, value) {
        temp = el;
        while ((temp != null) && (temp.tagName != "BODY")) {
            if(temp.className.indexOf(value) != -1) {
                el = temp;
                return el;
            }
            temp = temp.parentElement;
        }
        return null;
    }


    /**
     * 绑定鼠标事件
     */
    var initResizeAble = function(){
        var selector = "." + RESIZE_ALL;
        $(document).on("mousedown",function(e){
            callResizeChangeHandler("stop-resize",e);
            mouseDownHandler();
        }).on("mouseup",function(e){
            callResizeChangeHandler("stop-resize",e);
            mouseUpHandler();
        }).on("mousemove",function(e){
            mouseMoveHandler();
        });
    };

    initResizeAble();

    var resizeStatusChange = null;

    function callResizeChangeHandler(key,e){
        if($.isFunction(resizeStatusChange)){
            resizeStatusChange(key,e);
        }
    }

    u.registerCallback = function (callback) {
        resizeStatusChange = callback;
    };


    /**
     * 提供给外部使用的接口
     * @param $el   需要初始化的元素
     * @param isResize  是否可以改变
     */
    u.resizeable = function($el,isResize){
        if($el){
            if(typeof isResize == "undefined" || isResize){
                $el.addClass(RESIZE_ALL);
            }else{
                $el.removeClass(RESIZE_ALL);
                $el[0].style.cursor="";
            }
        }
    };

    window.resizeUtil = u;
})(window);




