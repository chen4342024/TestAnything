require.config({
    paths: {
        'jquery':"jquery-2.1.1"
    },
    shim: {
        'zepto.min': {
            exports:'$'
        },
        'underscore': {
            exports: '_'
        },
        'touch': {
            deps: ['zepto.min'],
            exports: '$T'
        }
    }
});


require(['zepto.min','underscore','jquery'], function ($,_,$$) {
    alert("加载成功！");
    alert($);
    alert(_);
    alert($$);
});

