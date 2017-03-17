/**
 * Created by ivyguo on 2017/1/6.
 */
backStart
    .controller("splashCtrl", ['$scope','$rootScope', '$http', '$q', '$window', '$state', '$stateParams', 'SetNavRight','SearchService', 'ImgUploadService', 'PubFunction',
        function($scope, $rootScope, $http, $q, $window, $state, $stateParams,SetNavRight, SearchService, ImgUploadService, PubFunction){ // 内容管理

            $scope.tokenCode = JSON.parse($window.sessionStorage.getItem('userInfo')).apiToken;
            $scope.hostName = JSON.parse($window.sessionStorage.getItem('userInfo')).apiHost;
            $scope.appHostName = JSON.parse($window.sessionStorage.getItem('userInfo')).appApiHost;

            //同步右侧的导航提示
            SetNavRight.setNavRight($rootScope,$stateParams);

            //clean currentAdData
            $scope.cleanAdData = function () {
                return {
                    title : "",
                    coopenOuterUrl : "",
                    coopenImage : [
                        {
                            "imgUrl":"",
                            "name": "",
                            "resolutionRatio":"640*784"
                        },{
                            "imgUrl":"",
                            "name": "",
                            "resolutionRatio":"1080*1618"
                        }
                    ]
                }
            };

            // 字符数限制
            $scope.validateStrLength = function(str, minNum, maxNum, msg){
                PubFunction.validateStrLength($scope, str, minNum, maxNum, msg);
            };

            // cleanAttr
            $scope.cleanAttr = function(jsonArr, arr){
                var arrResult = [];
                var oTmp = {};
                for( var i = 0; i < jsonArr.length; i++ ){
                    for(var j = 0; j < arr.length; j++){
                        oTmp[arr[j]] = jsonArr[i][arr[j]];
                    }
                    arrResult.push(oTmp);
                    oTmp = {};
                }
                return arrResult;
            };

            $scope.currentCtrl = "";
            $scope.currentAdData = $scope.cleanAdData();
            $scope.currentAdId = "";

            //init splash ad
            $scope.innitList = function (callback, adId) {
                var url = $scope.hostName + "v1/backoffice/liveCoopen";
                if(adId){
                    url += "?token=" + $scope.tokenCode + "&id=" + adId;
                }else{
                    url += "/all?token=" + $scope.tokenCode;
                }
                $http({
                    method: 'GET',
                    url: url
                }).success(function(res){
                    if(res.success){
                        callback && callback(res.results);
                    }
                }).error(function(res){
                    console.log(res);
                });
            };

            // upload images
            $scope.upLoadImg = function(file, index, size){
                ImgUploadService.upload($scope.appHostName, $scope.tokenCode, file, function(data){ // success
                    // data.imgSrc
                    $scope.currentAdData.coopenImage[index] = {
                        "imgUrl": data.imgSrc,
                        "resolutionRatio": size,
                        "name": file.name
                    }
                    SearchService.getTips("上传成功");
                }, function(res){ // failed
                    SearchService.getTips("上传失败");
                });
            };

            //update data for modal
            $scope.updateModal = function(idNameModal, mark, adId){
                $scope.currentCtrl = mark;
                $(idNameModal).modal();
                $scope.currentModel = angular.element(idNameModal);
                if( mark == "add" ){ // 新添加
                    $scope.currentAdData = $scope.cleanAdData();
                }else{ // 编辑
                    $scope.innitList( function(res){  // 目前暂时不提供编辑功能
                        $scope.currentAdData = res.details;
                    } ,adId);
                }
            };

            // add splash or edit
            $scope.submitNewAd = function (valid, isDisabled, idName, isOut) {
                // 验证
                $scope.isSubmit = true;
                if(!valid){
                    SearchService.getTips("请正确填写相关信息，带 * 号属于必填项！");
                    return false;
                }
                var url = $scope.hostName + "v1/backoffice/liveCoopen?token=" + $scope.tokenCode;
                if(isOut){  // 直接更改发布或者是撤销发布
                    var method = "PUT";
                    var data = {
                        id : idName,
                        isDisabled : isDisabled
                    }
                }else{  // 模态框中
                    var method = $scope.currentCtrl == "add" ? "POST":"PUT";
                    var data = {
                        title: formEditAd.title.value,
                        coopenImage: $scope.cleanAttr($scope.currentAdData.coopenImage, ["imgUrl", "resolutionRatio"]),
                        coopenOuterUrl: formEditAd.url.value,
                        startValidTime: "",
                        endValidTime: "",
                        isDisabled: isDisabled,
                        isDeleted: false
                    };
                    if($scope.currentAdData.id){
                        data.id = $scope.currentAdData.id;
                    }
                }
                $http({
                    method: method,
                    url: url,
                    data:data
                }).success(function(res){
                    $scope.isSubmit = false;
                    if(res.success){
                        $('#addSplash').modal('hide');
                        $scope.innitList(function(res){
                            $scope.adList = res.list;
                        });
                        SearchService.getTips(res.message);
                    }else{
                        switch(res.error_code){
                            case 40022 : SearchService.getTips(res.message);
                        }
                    }
                }).error(function(res){
                    $scope.isSubmit = false;
                    SearchService.getTips(res);
                });
            };

            // delete ad
            $scope.deleteAd = function(id, idNameModal){
                $scope.currentAdId = id;
                if(idNameModal){ //  打开确认框
                    $(idNameModal).modal();
                    $scope.currentModel = angular.element(idNameModal);
                    return false;
                }
                $http.delete( $scope.hostName + "v1/backoffice/liveCoopen?token="+$scope.tokenCode+"&id="+id).success(function(data){
                    if(data.success){
                        // 更新列表
                        $scope.innitList(function(res){
                            $scope.adList = res.list;
                        });
                        $scope.currentModel.modal('hide');
                        SearchService.getTips("删除成功！");
                    }else{
                        SearchService.getTips(data.message);
                    }
                }).error(function(message){
                    SearchService.getTips(message);
                });
            };

            // innit for ad list
            $scope.innitList(function(res){
                $scope.adList = res.list;
            });

        }]);