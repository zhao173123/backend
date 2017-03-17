backStart.factory('NavRightData', function() {
    return  [
        {
            "one": "用户中心",
            "two": ["用户关系管理", "主播管理", "主播审核", "违禁管理", "站内信", "直播间公告"]
        }, {
            "one": "监控台",
            "two": [ "流量监控", "图文监控", "直播监控", "直播记录监控"]
        }, {
            "one": "配置中心",
            "two": ["内容管理", "礼物配置"]
        }, {
            "one": "课程订阅",
            "two": ["创建订阅", "查询订阅"]
        }, {
            "one": "财务中心",
            "two": ["结算申请", "结算工单"]
        }, {
            "one": "管理员中心",
            "two": ["管理员列表", "权限配置"]
        }, {
            "one": "数据中心",
            "two": ["运营数据"]
        }
    ]
});

backStart.factory('GetNavRight',function(NavRightData) {  //获取导航数据
    return{
        "getNavRight": function(oneNum, twoNum){
            return [NavRightData[oneNum].one,NavRightData[oneNum].two[twoNum]];
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
        }
    }
});

