backStart.factory('NavRightData', function() {
    return  [
        {
            "one": "用户中心",
            "two": ["用户关系管理", "主播管理", "主播审核", "违禁管理"],
            "icon":"icon-user"
        }, {
            "one": "监控台",
            "two": [ "流量监控",  "图文监控", "直播监控", "直播记录监控"],
            "icon":"icon-desktop"
        }, {
            "one": "内容管理",
            "two": ["Banner管理", "回放管理", "优先级设置", "礼物配置", "创建订阅", "查询订阅", "开屏广告管理", "热门推荐"],
            "icon":"icon-cog"
        }, {
            "one": "配置中心",
            "two": ["自动置顶参数配置"],
            "icon":"icon-sitemap"
        }, {
            "one": "工具中心",
            "two": ["发送短信","直播间标题设置", "直播间评论", "排班"],
            "icon":"icon-envelope"
        }
    ]
});

backStart.factory('GetNavRight',function(NavRightData) {  //获取导航数据
    return{
        "getNavRight": function(oneNum, twoNum){
            return [NavRightData[oneNum].one,NavRightData[oneNum].two[twoNum],NavRightData[oneNum].icon];
        }
    }
});

backStart.factory('SetNavRight',function(GetNavRight) {  // 将导航数据同步到页面中
    return{
        "setNavRight": function(parent, sIndex){
            if(sIndex.navIndex){
                var navRight = GetNavRight.getNavRight(sIndex.navIndex.split("")[0],sIndex.navIndex.split("")[1]);
            }else{
                var navRight = GetNavRight.getNavRight(0,0);
            }
            parent.navRightOne = navRight[0];
            parent.navRightTwo = navRight[1];
            parent.navRightIcon = navRight[2];
        }
    }
});

