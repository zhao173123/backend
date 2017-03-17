backStart.factory('SearchService',function($timeout) {
    var  searchService = {};

    searchService.setPageBtn = function(currentScope, current, first, last){
        // currentPage
        if ( current == first && current == last) { // 只有一页
            currentScope.isFirst = true;
            currentScope.isLast = true;
        }else if ( current == first){ // 已经是在第一页了
            //禁止first 和 prev 释放 next 和 last
            currentScope.isFirst = true;
            currentScope.isLast = false;
        }else if(current == last){
            //禁止next 和 last  释放 first 和 prev
            currentScope.isFirst = false;
            currentScope.isLast = true;
        }else{
            //释放所有
            currentScope.isFirst = false;
            currentScope.isLast = false;
        }
    };

    searchService.setListDataSuccess = function(currentScope,currentPage,pageSize,totalCount){   //currentScope,currentPage,pageSize,totalCount
        var pageCount = Math.ceil(totalCount / pageSize);
        currentScope.totalCount = totalCount;  //总数据
        currentScope.currentPage = currentPage;
        currentScope.prevPage = (currentPage - 1) >= 1?currentPage - 1:1;
        currentScope.nextPage = (currentPage + 1) <= pageCount?currentPage + 1:pageCount;
        currentScope.lastPage = pageCount;

        //页数显示
        currentScope.prevCount = (currentPage - 1) * Number(pageSize) + 1;
        currentScope.nextCount = (currentPage == pageCount)?totalCount:Number(currentPage) * Number(pageSize);
    };

    searchService.getTips = function(sText){
        angular.element("body").append("<div id='minTips'>"+sText+"</div>");
        var timer = $timeout(function() {
            angular.element("#minTips").remove();
            $timeout.cancel(timer);
         },3000);
    };
    return searchService;

});

backStart.factory('GetList',function(SearchService, $http) {
    var getList = {};
    //post
    getList.postListData = function (params, success, error) { //currentScope, isCall, urlParams, upData
        // isCall:初始化的时候是否更新数据数据， urlParams：参数， upData：提交数据
        $http({
            url : params.urlParams?params.urlParams:"",  //params.url
            method : "POST",
            data : params.upData ? params.upData:{}, //请求提交数据
            headers:{
                'Content-Type': 'application/json'
            }
        }).success(function (data) {
            if(data.success){
                params.currentScope.searchData = data; //返回数据
                var result = data.results;
                var oldPage = params.currentScope.currentPage;
                if(oldPage == result.currentPage && !params.isCall){
                    return false;
                }
                SearchService.setPageBtn(params.currentScope, result.currentPage, 1, result.lastPage);  //设置按钮状态
                params.currentScope.list = result.list;//返回数据用户列表
                SearchService.setListDataSuccess(params.currentScope,  result.currentPage, result.pageSize, result.totalCount);
                success && success(data);
            }else{
                error && error(data.message);
            }
        }).error(function (message) { //
            //请求出错
            error && error(message);
        })
    };
    //get
    getList.getListData = function (params, success, error) { //currentScope, isCall, urlParams, pageNum, pageSize
        // isCall:初始化的时候是否更新数据数据， urlParams：参数
        $http.get(params.urlParams).success(function (data) {
            if(data.success){
                params.currentScope.searchData = data; //返回数据
                var result = data.results;
                var oldPage = params.currentScope.currentPage;
                if(oldPage == params.pageNum && !params.isCall){
                    return false;
                }
                params.currentScope[params.pageTitle] = params.pageTitle?{}:params.currentScope;
                SearchService.setPageBtn(params.currentScope[params.pageTitle], params.pageNum, 1, Math.ceil((result.total || result.totalCount)/params.pageSize));  //设置按钮状态
                SearchService.setListDataSuccess(params.currentScope[params.pageTitle], params.pageNum, params.pageSize, (result.total || result.totalCount));
                success && success(data);
            }else{
                error && error(data.message);
            }
        }).error(function (message) {
            //请求出错
            error && error(message);
        })
    };

    return getList;
});

backStart.factory('DataCtrl',function(GetList) {
    var dataCtrl = {};
    //post
    dataCtrl.postPageData = function(currentScope, pageInfo, success, error){//currentScope, pageInfo, success, error
        GetList.postListData({
            "currentScope": arguments[0],
            "isCall":false,
            "urlParams": arguments[1]? arguments[1].hostName + "v1/backoffice/users/list?token="+ arguments[1].token + "&pageSize="+ arguments[1].pageSize + "&pageNum=" + arguments[1].pageNum:"",
            "upData" : arguments[1].searchInfo
        },arguments[2],arguments[3]);
    };
    return dataCtrl;
});

backStart.factory('DataSort', function (GetList) {
    var dataSort = {};
    dataSort.postSortData = function (currentScope, searchInfo, pageSize) {
        GetList.postListData({
            "currentScope": currentScope,
            "isCall":true,
            "urlParams": currentScope.hostName + "v1/backoffice/users/list?token="+ currentScope.tokenCode + "&pageSize=" + pageSize + "&pageNum=1",
            "upData" : searchInfo
        });
    };
    return dataSort;
});