function testMock() {

    var data = Mock.mock({
        'name': [{
            'id|+1': 1
        }],
        'age|1-100': 100,
        'color': Random.color(),
        'url': Random.url(),
        'testb|1-5': true,
        'first': '@color',
        'color2': '@FIRSTS'
    });


    console.log(
        JSON.stringify(data, null, 4)
    );

    // Mock.mock( rurl, rtype, function(options) )
    Mock.mock(/test\.json/, 'get', {
        'title': 'test.json',
        'name': [{
            'id|+1': 1
        }],
        'age|1-100': 100
    });
    Mock.mock(/http:\/\/server\/test2\.json\?test=1/, 'get', {
        'title': 'http://server/test2.json?test=1',
        'name': [{
            'id|+1': 1
        }],
        'age|1-100': 100
    });
    Mock.mock(/http:\/\/server\/test2\.json\?test=2/, 'get', {
        'title': 'http://server/test2.json?test=2',
        'age|1-100': 100
    });

    Mock.mock('http://g.cn', 'get', {
        'title': 'http://g.cn',
        'name': [{
            'id|+1': 1
        }],
        'age|1-100': 100
    });

}

function tetsMockAjax() {
    $.ajax({
        url: 'http://g.cn',
        type: 'get',
        dataType: 'json'
    }).done(function (data, status, xhr) {
        console.log(
            JSON.stringify(data, null, 4)
        )
    });

    $.ajax({
        url: 'http://server/test2.json?test=1',
        type: 'get',
        dataType: 'json'
    }).done(function (data, status, jqXHR) {
        console.log(
            JSON.stringify(data, null, 4)
        );
    })
}

var currentEditEl = null;

$(document).on("contextmenu", ".edit-box", function (e) {
    var $el = $("#rightSelect");
    currentEditEl = this;
    if(!$(currentEditEl).hasClass("edit-box")){
        return ;
    }
    $el.show();
    $el[0].style.top = (e.clientY) + "px";
    $el[0].style.left = ( e.clientX ) + "px";
    e.preventDefault();
    return false;

});

resizeUtil.registerCallback(function (key,e) {
    if(key == "resizing"){
        moveUtil.setLockDrag(true);
    }else{
        moveUtil.setLockDrag(false);
    }
});

function setEditable() {
    $("#rightSelect").hide();
    var $editEl =$(currentEditEl);
    moveUtil.dragable($editEl,false);
    resizeUtil.resizeable($editEl);
}


function setDragable() {
    $("#rightSelect").hide();
    var $editEl = $(currentEditEl);
    moveUtil.dragable($editEl);
    resizeUtil.resizeable($editEl,false);
}




