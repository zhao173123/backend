/*
* $("header .toggle-nav") ------ sideBar的展开与收起
* $("#main-nav")   -------------- sideBar
* $("#content")  -------- 主体内容
*/
(function() {
$(document).ready(function() {
    var body, click_event, content, nav, nav_toggler;
    var nav_toggler = $("header .toggle-nav");
    var nav = $("#main-nav");
    var content = $("#content");
    var body = $("body");
    var click_event = (jQuery.support.touch ? "tap" : "click");
    //一级nav点击操作
    $("body").on(click_event,"#main-nav .dropdown-collapse", function(e) {
        var link, list;
        e.preventDefault();
        link = $(this);
        list = link.parent().find("> ul");
        if (list.is(":visible")) {
            if (body.hasClass("main-nav-closed") && link.parents("li").length === 1) {
                return false;
            } else {
                link.removeClass("in");
                list.slideUp(300, function() {
                    return $(this).removeClass("in");
                });
            }
        } else {
            if (list.parents("ul.nav.nav-stacked").length === 1) {
                $(document).trigger("nav-open");
            }
            link.addClass("in");
            list.slideDown(300, function() {
                return $(this).addClass("in");
            });
        }
        return false;
    });

    //二级nav点击操作
    $("body").on(click_event,"#main-nav ul.nav.nav-stacked > li", function(e) {
        e.preventDefault();
        $("#main-nav ul.nav.nav-stacked > li").removeClass("active");
        $(this).addClass("active");
        return false;
    });


    // // 在移动端可以通过左右滑动展开和收起菜单栏
    // if (jQuery.support.touch) {
    //     nav.on("swiperight", function(e) {
    //         return $(document).trigger("nav-open");
    //     });
    //     nav.on("swipeleft", function(e) {
    //         return $(document).trigger("nav-close");
    //     });
    // }

    //nav 收起展开toggle
    $("body").on(click_event,"header .toggle-nav", function() {
        if (nav_open()) {
            $(document).trigger("nav-close");
        } else {
            $(document).trigger("nav-open");
        }
        return false;
    });

    $(document).bind("nav-close", function(event, params) {
        var nav_open;
        $("body").removeClass("main-nav-opened").addClass("main-nav-closed");
        return nav_open = false;
    });
    return $(document).bind("nav-open", function(event, params) {
        var nav_open;
        $("body").addClass("main-nav-opened").removeClass("main-nav-closed");
        return nav_open = true;
    });
});

this.nav_open = function() {
    return $("body").hasClass("main-nav-opened") || $("#main-nav").width() > 50;
};

}).call(this);
