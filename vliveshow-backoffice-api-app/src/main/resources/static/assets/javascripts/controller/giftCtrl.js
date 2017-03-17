/**
 * Created by ivyguo on 2016/8/12.
 */

backStart
    .controller("giftCtrl", ['$scope','$rootScope', '$http', '$window', '$state', '$stateParams', 'SetNavRight','SearchService', 'PubFunction', 'HttpCallService',
        function($scope, $rootScope, $http, $window, $state, $stateParams,SetNavRight, SearchService, PubFunction, HttpCallService){ // 结算申请

            //同步右侧的导航提示
            SetNavRight.setNavRight($rootScope,$stateParams);

            $scope.tokenCode = JSON.parse($window.sessionStorage.getItem('userInfo')).apiToken;
            $scope.hostName = JSON.parse($window.sessionStorage.getItem('userInfo')).apiHost;
            $scope.appHostName = JSON.parse($window.sessionStorage.getItem('userInfo')).appApiHost;

            $scope.currentGiftId = ""; // 当前操作的礼物的ID
            $scope.currentCtrl = "";  // 当前执行的操作 ----  预览 删除 上架 下架
            $scope.currentModel = {}; // 当前操作的礼物DOM
            $scope.currentGiftSrc = "";  // 预览的时候显示   --- ************预览功能暂时不要
            $scope.currentPageInfo = []; // 当前页的所有list
            $scope.ableList = {};
            $scope.diaAbledList = {};
            $scope.isEditGift = false;

            //上架
            $scope.ableList.pageSize = 10;
            $scope.ableList.currentPage = 1;
            $scope.ableList.currentList = [];

            //下架
            $scope.diaAbledList.pageSize = 10;
            $scope.diaAbledList.currentPage = 1;
            $scope.diaAbledList.currentList = [];

            /*切换静态和动态礼物*/
            $scope.changeNotice = function(name1, name2){
                $scope[name1] = true;
                $scope[name2] = false;
            };

            //拆分上架和下架
            $scope.getOneList = function(json, oldArr){
                var arr1 = [];
                var arr2 = [];
                for(var i = 0; i < oldArr.length; i++){
                    if(oldArr[i][json.name] == json.val){
                        arr1.push(oldArr[i]);
                    }else{
                        arr2.push(oldArr[i]);
                    }
                }
                return {
                    "isDisabled": arr1,
                    "isAble": arr2
                }
            };

            //获取礼物列表
            $scope.getGiftList = function(urlParams){
                var attrArr = ["id", "name", "isDisabled", "attrs", "thumb", "thumb3x", "folderName"];
                var urlParam = $scope.hostName + "v1/backoffice/gift/list" + PubFunction.getUrlParams(urlParams);
               $http.get(urlParam).success(function(data){
                   if(data.success){
                       // 更新信息  +   分页
                       var lists = $scope.getOneList({  //上架
                           "name": "isDisabled",
                           "val" : true
                       },data.results.list);
                       // console.log(data.results.list);
                       $scope.ableList.allList = lists.isAble;
                       $scope.diaAbledList.allList = lists.isDisabled;
                       var maxNum = Math.max.apply(null, PubFunction.jsonToArr(data.results.list,"order"));
                       $scope.orderMax = isFinite(maxNum) ? maxNum : 0;
                   }else{
                       SearchService.getTips(data.message);
                   }
               }).error(function(message){
                   SearchService.getTips(message);
               });
            };

            $scope.getGiftList({
                "token": $scope.tokenCode
            });


            /*
             * 预览礼物
             * giftView()
             * idName ---   摸态框id
             * */
            $scope.giftView = function(idName, giftSrc){
                $scope.currentGiftSrc = giftSrc;
                $(idName).modal();
                $(".modal-backdrop").css("opacity","0.1");
            };

            //上传图片
            $scope.upload = function (file, img, formatArr) {
                if(file){
                    var formData = new FormData();
                    formData.append('imageFile', file);
                    // 验证上传的文件格式
                    if(! PubFunction.validFileFormat(file.name,formatArr)){
                        SearchService.getTips("请上传"+formatArr.join("，")+"格式的文件");
                        return false;
                    }
                    $http({
                        method: 'POST',
                        url: $scope.appHostName + "v1/host/application/image?token=" + $scope.tokenCode ,
                        headers: {'Content-Type':undefined},
                        data: formData
                    }).success(function(res, status){
                        if(res.success){
                            $scope[img+"Src"] = res.results.url;
                            $scope[img+"Name"] = file.name;
                            SearchService.getTips("上传成功");
                        }else {
                            SearchService.getTips("上传失败，请重新上传");
                        }
                    }).error(function(res, status){
                        SearchService.getTips("上传失败，请重新上传");
                    });
                }
            };


            /*
             * 添加或者编辑
             * giftAddAndEdit()
             * idName ---- 模态框ID
             * giftId ---- 当前礼物ID（编辑礼物时需要）
             * */
            $scope.giftAddAndEdit = function(idName, isDisabled, giftId, order, resource, gifResource) {
                $scope.currentOrder = order;
                $scope.currentResource = resource;
                $scope.currentGifResource = gifResource;
                $scope.currentGiftId = giftId;
                $scope.isEditGift = false;
                $scope.isDisabledCurrent = isDisabled;

                var attrArr = ["giftType", "attrs", "name", "diamond", "thumb3x", "folderName", "resource", "gifResource", "playOnceTime","aspectRatio","repeatTimes", "order"];

                $scope.staticImgSrc = "";
                $scope.animateImgSrc = "";
                $scope.animateImgName = "";
                $scope.animateGifSrc = "";
                $scope.animateGifName = "";

                if(giftId){ // 编辑
                    $scope.currentCtrl = "编辑";
                    $scope.isEditGift = true;
                    $http.get($scope.hostName +"v1/backoffice/gift?token="+$scope.tokenCode+"&id="+giftId).success(function(data){
                        if (data.success) {
                            $(idName).modal();

                            $scope.giftModelData = PubFunction.filterNeed(data.results, attrArr);
                            $scope.staticImgSrc = $scope.giftModelData.thumb3x;
                            $scope.staticGiftType = $scope.giftModelData.giftType == 0;
                            $scope.animateGiftType = $scope.giftModelData.giftType != 0;
                            $scope.animateImgSrc = $scope.giftModelData.resource;
                            $scope.animateImgName = ($scope.animateGiftType&&$scope.currentResource)?$scope.giftModelData.folderName+".zip":"";
                            $scope.animateGifSrc = $scope.giftModelData.gifResource;

                            console.log('gifttype: ', $scope.animateGiftType, " currentGifResource: ", $scope.currentGifResource);

                            $scope.animateGifName = ($scope.animateGiftType && $scope.currentGifResource) ? $scope.giftModelData.folderName + ".gif" : "";
                        } else {
                            SearchService.getTips(data.message);
                        }
                    }).error(function(message){
                        SearchService.getTips(message);
                    });
                }else{  // 添加
                    $scope.currentCtrl = "添加";
                    $(idName).modal();
                    $scope.staticGiftType = true;
                    $scope.animateGiftType = false;
                    $scope.giftModelData = {};
                    for(var i = 0; i < attrArr.length; i++){
                        $scope.giftModelData[attrArr[i]] = "";
                    }
                    $scope.giftModelData.order = Number($scope.orderMax) + 10;
                }
            };

            /*
            * 删除/上架/下架礼物
            * giftTips()
            * idName ---   摸态框id
            * giftId ------  礼物ID
            * ctrlName -------  执行操作（删除，上架，下架）
            * */
            $scope.giftTips = function(idName, giftId, ctrlName){
                $(idName).modal();
                $(".modal-backdrop").css("opacity","0.1");
                $scope.currentGiftId = giftId;
                $scope.currentCtrl = ctrlName;
                $scope.currentModel = angular.element(idName);
            };

            /*
             * 确认删除/上架/下架礼物
             * giftCtrl()
             * */
            $scope.giftCtrl = function(){
                if($scope.currentCtrl=="删除"){// 删除
                    $http.delete($scope.hostName +"v1/backoffice/gift?token="+$scope.tokenCode+"&id="+$scope.currentGiftId).success(function(data){
                        if(data.success){
                            // 更新列表
                            $scope.getGiftList({
                                "token": $scope.tokenCode
                            });
                            $scope.currentModel.modal('hide');
                            SearchService.getTips("删除成功！");
                        }else{
                            SearchService.getTips(data.message);
                        }
                    }).error(function(message){
                        SearchService.getTips(message);
                    });

                }else{  // 上下架
                    var isUpdates = $scope.currentCtrl != "上架";
                    $http.put($scope.hostName +"v1/backoffice/gift/status?token="+$scope.tokenCode+"&id="+$scope.currentGiftId+"&toDisable="+ isUpdates).success(function(data){
                        if(data.success){
                            // 更新列表
                            $scope.getGiftList({
                                "token": $scope.tokenCode
                            });
                            $scope.currentModel.modal('hide');
                            SearchService.getTips($scope.currentCtrl + "成功！");
                        }else{
                            SearchService.getTips(data.message);
                        }
                    }).error(function(message){
                        SearchService.getTips(message);
                    });
                }
            };


            /*
             * 添加/编辑 保存
             * giftSave()
             * */
            $scope.giftSave = function(idName, isValid) {
                $scope.isSubmit = true;
                //验证
                if (!isValid || ($scope.staticImgSrc == '' || ($scope.animateGiftType && $scope.animateImgName == ''))) {
                    $scope.isSubmit = false;
                    if ($scope.staticImgSrc == '') {
                        SearchService.getTips("您还未上传静态图");
                    } else if ($scope.animateGiftType && $scope.animateImgName == '') {
                        SearchService.getTips("您还未上传动画帧图");
                    }
                    return false;
                }
                var method = $scope.isEditGift ? "PUT" : "POST";
                var data = {
                    "name": giftAdd.enName.value,
                    "isDisabled": $scope.isDisabledCurrent,
                    "attrs": [
                        {
                            "name": giftAdd.cnName.value,
                            "unit": giftAdd.cnUnit.value,
                            "i18n": "cn"
                        },
                        {
                            "name": giftAdd.twName.value,
                            "unit": giftAdd.twUnit.value,
                            "i18n": "tw"
                        },
                        {
                            "name": giftAdd.enName.value,
                            "unit": giftAdd.enUnit.value,
                            "i18n": "en"
                        }
                    ],
                    "thumb": giftAdd.staticImg.value,
                    "resource": giftAdd.aniResource.value,
                    "gifResource": giftAdd.aniGifResource.value,
                    "diamond": giftAdd.diamond.value,
                    "giftType": giftAdd.giftType.value,
                    "repeatTimes": giftAdd.repeatTimes.value,
                    "playOnceTime": giftAdd.playOnceTime.value,
                    "aspectRatio": giftAdd.aspectRatio.value,
                    "order": giftAdd.order.value
                };
                if ($scope.isEditGift) {
                    data.id = $scope.currentGiftId;
                }
                HttpCallService.httpCall(method, $scope.hostName + "v1/backoffice/gift?token=" + $scope.tokenCode, data, function (data) {  // success
                    if (data.success) {  //处理成功
                        SearchService.getTips("保存成功");
                        // 更新列表
                        $scope.getGiftList({
                            "token": $scope.tokenCode
                        });
                        $(idName).modal("hide");
                        $scope.isSubmit = false;
                    } else {
                        SearchService.getTips(data.message);
                    }
                }, function (message) { // error
                    SearchService.getTips(message);
                });
            };


        }])





