/**
 * Created by ivyguo on 2016/8/16.
 */
backStart.factory('PubFunction',function() {
    Date.prototype.Format = function (fmt) { //author: meizz
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }
    return{
        "getUrlParams": function(json){ // 拼接URL
                var s = "?";
                var arr = [];
                for(var key in json){
                    arr.push( key + "=" + json[key]);
                };
                s += arr.join("&");
                return s;
            },
        "inputWrap": function (currentScope,userInfo) {  // 查询
            var reUser = {};
            var follower = {};
            var following = {};
            var registerTime = {};
            if(angular.isDefined(userInfo) && userInfo.hasOwnProperty('userId')) reUser.userId = userInfo.userId;
            if(angular.isDefined(userInfo) && userInfo.hasOwnProperty('mobilePhone')) reUser.mobilePhone = userInfo.mobilePhone;
            if(angular.isDefined(userInfo) && userInfo.hasOwnProperty('nickName')) reUser.nickName = '%' + userInfo.nickName + '%';
            if(currentScope.selectedGender.length > 0) reUser.gender = currentScope.selectedGender;
            if(currentScope.selectedRole.length > 0) reUser.role = currentScope.selectedRole;
            if(angular.isDefined(userInfo) && userInfo.hasOwnProperty('fansMin') && userInfo.fansMin != null) follower.from = userInfo.fansMin.toString();
            if(angular.isDefined(userInfo) && userInfo.hasOwnProperty('fansMax') && userInfo.fansMax != null) follower.to = userInfo.fansMax.toString();
            if(follower.hasOwnProperty('from') || follower.hasOwnProperty('to')) reUser.follower = follower;
            if(angular.isDefined(userInfo) && userInfo.hasOwnProperty('followMin') && userInfo.followMin != null) following.from = userInfo.followMin.toString();
            if(angular.isDefined(userInfo) && userInfo.hasOwnProperty('followMax') && userInfo.followMax != null) following.to = userInfo.followMax.toString();
            if(following.hasOwnProperty('from') || following.hasOwnProperty('to')) reUser.following = following;
            if(currentScope.userIdSort == 'asc') {
                reUser.sortFields = {userId:'asc'};
            }else if(currentScope.userIdSort == 'desc'){
                reUser.sortFields = {userId:'desc'};
            }
            if(currentScope.followingSort == 'asc') {
                reUser.sortFields = {following:'asc'};
            }else if(currentScope.followingSort == 'desc'){
                reUser.sortFields = {following:'desc'};
            }
            if(currentScope.followerSort == 'asc') {
                reUser.sortFields = {follower:'asc'};
            }else if(currentScope.followerSort == 'desc'){
                reUser.sortFields = {follower:'desc'};
            }
            if(angular.isDefined(userInfo) && userInfo.hasOwnProperty('source') && userInfo.source != "") reUser.source = userInfo.source;
            if(angular.isDefined(userInfo) && userInfo.hasOwnProperty('mobilePhoneExists') && userInfo.mobilePhoneExists != "" )  reUser.mobilePhoneExists = userInfo.mobilePhoneExists;
            if(currentScope.startDate != "") registerTime.from = currentScope.startDate;
            if(currentScope.endDate != "") registerTime.to = currentScope.endDate;
            if(registerTime.hasOwnProperty('from') || registerTime.hasOwnProperty('to')) reUser.registerTime = registerTime;
            return reUser;
        },
        "sortConcat": function(currentScope, columnName){ // 排序
            switch (columnName) {
                case 'userId':
                    if(currentScope.userIdSort == 'desc'){
                        currentScope.userIdSort = 'asc';
                        currentScope.followingSort = '';
                        currentScope.followerSort = '';
                        break;
                    }else if(currentScope.userIdSort == 'asc'){
                        currentScope.userIdSort = 'desc';
                        currentScope.followingSort = '';
                        currentScope.followerSort = '';
                        break;
                    }else{
                        currentScope.userIdSort = 'asc';
                        currentScope.followingSort = '';
                        currentScope.followerSort = '';
                        break;
                    }
                case 'following':
                    if(currentScope.followingSort == 'desc'){
                        currentScope.followingSort = 'asc';
                        currentScope.userIdSort = '';
                        currentScope.followerSort = '';
                        break;
                    }else if(currentScope.followingSort == 'asc'){
                        currentScope.followingSort = 'desc';
                        currentScope.userIdSort = '';
                        currentScope.followerSort = '';
                        break;
                    }else{
                        currentScope.followingSort = 'asc';
                        currentScope.userIdSort = '';
                        currentScope.followerSort = '';
                        break;
                    }
                case 'follower':
                    if(currentScope.followerSort == 'desc'){
                        currentScope.followerSort = 'asc';
                        currentScope.followingSort = '';
                        currentScope.userIdSort = '';
                        break;
                    }else if(currentScope.followerSort == 'asc'){
                        currentScope.followerSort = 'desc';
                        currentScope.followingSort = '';
                        currentScope.userIdSort = '';
                        break;
                    }else{
                        currentScope.followerSort = 'asc';
                        currentScope.followingSort = '';
                        currentScope.userIdSort = '';
                        break;
                    }
            }
        },
        "getSearchParams" : function(obj, fieldArr){  // 获得查询字段
            var reUser = {};
            for(var i = 0; i < fieldArr.length; i++){
                if(angular.isDefined(obj) && obj.hasOwnProperty(fieldArr[i]) && $.trim(obj[fieldArr[i]]) ) reUser[fieldArr[i]] = obj[fieldArr[i]];
            }
            return reUser;
        },
        "concatJson" : function(json1, json2){  // 合并两个json
            for(var key in json1){
                json2[key] = json1[key];
            }
            return json2;
        },
        "unixToDate": function (unix) {     //时间戳转时期
            if(unix !== ''){
                var now = new Date(parseInt(unix) );
                return now.Format("yyyy-MM-dd");
            }else {
                return '';
            }
        },
        "unixToDateTime": function (unix) {     //时间戳转具体时间
            if(unix && unix !== ''){
                var now = new Date(parseInt(unix) );
                return now.Format("yyyy-MM-dd hh:mm:ss");
            }else {
                return '';
            }
        },
        "filterNeed":function(oldArr, fieldArr){  //过滤数据
            var newArr = [];
            if(oldArr.length > 0) {
                for (var i = 0; i < oldArr.length; i++) {
                    for (var j = 0; j < fieldArr.length; j++) {
                        newArr[i][fieldArr[j]] = oldArr[fieldArr[j]];
                    }
                }
            }else{
                for (var i = 0; i < fieldArr.length; i++) {
                    newArr[fieldArr[i]] = oldArr[fieldArr[i]];
                }
            }
            return newArr;
        },
        "cloneArr": function (arr) {  //clone 数组
            var newArr = [];
            for (var i = 0; i < arr.length; i++){
                newArr.push(arr[i]);
            }
            return newArr;
        },
        "jsonToArr":function(oldArr, attr){ //过滤数据到数组
            var arr = [];
            for(var i = 0; i <oldArr.length; i++ ){
                arr.push(oldArr[i][attr]);
            }
            return arr;
        },
        "validFileFormat":function(fileName, arrFormat){ //验证格式
            var sFormat = fileName.substring(fileName.lastIndexOf('.'));
            for(var i = 0; i <arrFormat.length; i++ ){
               if(sFormat == arrFormat[i]){
                   return true;
               }
            }
            return false;
        },
        "isUndefinedOrNull": function (str) {   //判断输入为空
            return angular.isUndefined(str) || str === null;
        }
    }
});