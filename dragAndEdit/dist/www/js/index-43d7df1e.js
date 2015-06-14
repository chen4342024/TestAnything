(function () {

    var now = {
            row: 1,
            col: 1
        },
        last = {
            row: 0,
            col: 0
        },
        nowPartIndex = 0;

    var towards = {
        up: 1,
        right: 2,
        down: 3,
        left: 4
    };

    var partMoveCallbacks = {};


    var MAX_ROW = 0;
    var FIRST_ROW = 1;
    var FIRST_COL = 1;

    var pageSetting = {};

    /**
     * 各类初始化函数
     */
    function init() {
        registerPartMoveCallback(7, 2, function (index) {
            var $dotGroup = $(".page-7-2").find(".dot-group").find(".dot");
            $dotGroup.removeClass("dot-sel").eq(index + 1).addClass("dot-sel");
        });
        caluColNum();
    }

    /**
     * 计算页面中有几行，每一行有几列，放回一个配置数据（json格式）
     */
    function caluColNum() {
        var allPages = $(".page");
        //筛选符合规则的class并组成数组
        var allPagesClass = _.map(allPages, function ($page) {
            var className = $page.className;
            var pageObj = className.match(/page-\d+-\d+/);
            if(pageObj == null || pageObj.length == 0){
                console.error("page must has class name like page-1-1");
                return "0";
            }
            return pageObj[0];
        });
        //计算每一行共有几列
        pageSetting = _.countBy(allPagesClass, function (className) {
            var index = className.lastIndexOf("-");
            return className.substring(5,index);
        });

        //计算总共有几行
        var pageKeys = _.sortBy(_.keys(pageSetting), function (key) {
            return Number(key);
        });
        MAX_ROW = Number(pageKeys[pageKeys.length - 1]);
    }

    /**
     * 获取每一行对应的列数
     */
    function getColNum(row) {
       return pageSetting[row];
    }

    /**
     * 获取部分滑动内容的个数
     */
    function getPartNum(row, col, tw) {
        if (row == 7 && col == 2 && (tw == towards.right || tw == towards.left)) {
            return 5;
        }
        return 0;
    }

    /**
     * 重置局部滑动的参数
     */
    function resetPart() {
        nowPartIndex = 0;
        var $partGroup = $(".page-7-2").find(".part-el");
        $partGroup.addClass("hide").removeClass("part-current").eq(0).removeClass("hide").addClass("part-current");
    }

    var isAnimating = false;

    s = window.innerHeight / 500;
    ss = 250 * (1 - s);

    $('.wrap').css('-webkit-transform', 'scale(' + s + ',' + s + ') translate(0px,-' + ss + 'px)');

    document.addEventListener('touchmove', function (event) {
        event.preventDefault();
    }, false);

    $(document).swipeUp(function () {
        if (isAnimating) return;
        last.row = now.row;
        last.col = now.col;
        if (checkCanMovePart(now.row, now.col, towards.up)) {
            partMove(towards.up)
        } else if (now.row != MAX_ROW) {

            now.row = now.row + 1;
            now.col = 1;
            pageMove(towards.up);
        }
    });

    $(document).swipeDown(function () {
        if (isAnimating) return;
        last.row = now.row;
        last.col = now.col;

        if (checkCanMovePart(now.row, now.col, towards.down)) {
            partMove(towards.down)
        } else if (now.row != FIRST_ROW) {
            now.row = now.row - 1;
            now.col = 1;
            pageMove(towards.down);
        }
    });

    $(document).swipeLeft(function () {
        if (isAnimating) return;
        last.row = now.row;
        last.col = now.col;
        var maxCol = getColNum(now.row);
        if (checkCanMovePart(now.row, now.col, towards.left)) {
            partMove(towards.left)
        } else if (now.col < maxCol) {
            now.col = now.col + 1;
            pageMove(towards.left);
        }
    });

    $(document).swipeRight(function () {
        if (isAnimating) return;
        last.row = now.row;
        last.col = now.col;
        if (checkCanMovePart(now.row, now.col, towards.right)) {
            partMove(towards.right)
        } else if (now.col > FIRST_COL) {
            now.col = now.col - 1;
            pageMove(towards.right);
        }
    });

    /**
     * 检查是否能滑动局部
     */
    function checkCanMovePart(row, col, tw) {
        var colPartNum = getPartNum(row, col, tw);
        var isMoveToNext = (tw == towards.up || tw == towards.left);
        if (colPartNum > 0) {
            //边界值判断
            if (isMoveToNext && nowPartIndex < colPartNum - 1 && nowPartIndex >= 0) {
                return true;
            }

            if (!isMoveToNext && nowPartIndex < colPartNum && nowPartIndex > 0) {
                return true;
            }
        }
        return false;
    }


    /**
     * 翻页
     */
    function pageMove(tw) {

        var lastPage = ".page-" + last.row + "-" + last.col,
            nowPage = ".page-" + now.row + "-" + now.col;

        var moveAnimation = getMoveAnimation(tw);
        var outClass = moveAnimation.outClass;
        var inClass = moveAnimation.inClass;

        isAnimating = true;

        $(nowPage).removeClass("hide");
        $(nowPage).addClass(inClass);
        $(lastPage).addClass(outClass);

        setTimeout(function () {
            resetPart();
            $(lastPage).removeClass('page-current').removeClass(outClass).addClass("hide");
            $(lastPage).find("img").not(".part-el").addClass("hide");

            $(nowPage).addClass('page-current').removeClass(inClass).removeClass("hide");
            $(nowPage).find("img").not(".part-el").removeClass("hide");

            isAnimating = false;
        }, 600);
    }

    /**
     * 获取滑动的动画
     */
    function getMoveAnimation(tw) {
        switch (tw) {
            case towards.up:
                outClass = 'pt-page-moveToTop';
                inClass = 'pt-page-moveFromBottom';
                break;
            case towards.right:
                outClass = 'pt-page-moveToRight';
                inClass = 'pt-page-moveFromLeft';
                break;
            case towards.down:
                outClass = 'pt-page-moveToBottom';
                inClass = 'pt-page-moveFromTop';
                break;
            case towards.left:
                outClass = 'pt-page-moveToLeft';
                inClass = 'pt-page-moveFromRight';
                break;
        }
        return {
            outClass: outClass,
            inClass: inClass
        }
    }


    /**
     * 滑动局部内容
     * @param tw
     */
    function partMove(tw) {
        var nowPage = ".page-" + now.row + "-" + now.col;
        var $nowParts = $(nowPage).find(".part-el");
        var lastPartIndex = nowPartIndex;


        var moveAnimation = getMoveAnimation(tw);
        var outClass = moveAnimation.outClass;
        var inClass = moveAnimation.inClass;

        nowPartIndex = (tw == towards.up || tw == towards.left) ? nowPartIndex + 1 : nowPartIndex - 1;

        isAnimating = true;

        var nowPartEl = $nowParts.eq(nowPartIndex);
        var lastPartEl = $nowParts.eq(lastPartIndex);

        $(nowPartEl).removeClass("hide");
        $(lastPartEl).addClass(outClass);
        $(nowPartEl).addClass(inClass);

        setTimeout(function () {
            $(lastPartEl).removeClass('part-current').removeClass(outClass).addClass("hide");
            $(nowPartEl).addClass('part-current').removeClass(inClass).removeClass("hide");

            var callBack = getPartMoveCallback(now.row, now.col);
            if ($.isFunction(callBack)) {
                callBack(nowPartIndex);
            }
            isAnimating = false;
        }, 600);
    }

    /**
     * 注册部分滑动完成后的回调函数
     * @param row 行数
     * @param col 列数
     */
    function registerPartMoveCallback(row, col, callback) {
        var key = row + "-" + col;
        partMoveCallbacks[key] = callback;
    }


    /**
     * 获取滑动后完成后的回调函数
     * @param row 行数
     * @param col 列数
     */
    function getPartMoveCallback(row, col) {
        var key = row + "-" + col;
        return partMoveCallbacks[key];
    }

    //初始化
    init();

})();

