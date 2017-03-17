/**
 * Created by ivyguo on 2016/8/10.
 */

backStart.controller("contractInfoCtrl",["$scope","$rootScope","DateInit", "$stateParams", "$http", "$window", "$sce", "fileReader", "Upload", "PubFunction", "SearchService",
    function($scope, $rootScope,DateInit,$stateParams, $http, $window, $sce, fileReader, Upload, PubFunction, SearchService){ // 合约资料

        $scope.normalDate = DateInit.normalDate;
        $scope.tokenCode = JSON.parse($window.sessionStorage.getItem('userInfo')).apiToken;
        $scope.hostName = JSON.parse($window.sessionStorage.getItem('userInfo')).apiHost;
        $scope.talentList = [{id:1, value:'脱口秀/搞笑'},{id:2, value:'音乐/舞蹈'},{id:3, value:'生活方式'},{id:4, value:'时尚美妆'},
                            {id:5, value:'全民'},{id:6, value:'美食'},{id:7, value:'亲子'},{id:8, value:'体育'},{id:9, value:'教育'},
                            {id:10, value:'健身健康'},{id:11, value:'	科技'},{id:12, value:'文化艺术'},{id:13, value:'财经金融'},{id:14, value:'购物'},
                            {id:15, value:'心理咨询'},{id:16, value:'法律顾问'}];
        $scope.currencyList = [{id:1, value:'人民币'}, {id:2, value:'台币'}, {id:3, value:'美元'}, {id:4, value:'欧元'}, {id:5, value:'日元'}, {id:6, value:'韩元'}];
        $scope.baseSalary = {currency: $scope.currencyList[0]};
        $scope.directors = [{userId: 0, nickName: '总监'}];
        $scope.managers = [{userId: 0, nickName: '主管'}];
        $scope.agents = [{userId: 0, nickName: '专员'}];
        $scope.sessionId = JSON.parse($window.sessionStorage.getItem('userInfo')).sessionId;
        // $scope.pdfPreview = $sce.trustAsResourceUrl("http://physics.mq.edu.au/~jcresser/Phys378/LectureNotes/VectorsTensorsSR.pdf");
        $scope.contractFiles = [];
        $scope.selectedTalent = [];
        $scope.isSaveBtnDis = false;

        var dataWareUp = function (contractInfo) {
            $scope.contractType = contractInfo.hasOwnProperty('contractType') ? contractInfo.contractType : 1;
            // $scope.talentType = contractInfo.hasOwnProperty('talentType') ? contractInfo.talentType : $scope.talentList[0].id;
            $scope.selectedTalent = contractInfo.hasOwnProperty('talentType') ? contractInfo.talentType : [];
            $scope.requiredHours = contractInfo.hasOwnProperty('requiredWorkHours') ? contractInfo.requiredWorkHours : '';
            $scope.baseSalary.amount = angular.isDefined(contractInfo.baseSalary) && contractInfo.baseSalary.hasOwnProperty('amount') ?  contractInfo.baseSalary.amount : '';
            $scope.baseSalary.currency = angular.isDefined(contractInfo.baseSalary) && contractInfo.baseSalary.hasOwnProperty('currency') ?  contractInfo.baseSalary.currency : $scope.currencyList[0].id;
            $scope.platformShareRate = contractInfo.hasOwnProperty('platformShareRate') ? contractInfo.platformShareRate : '';
            $scope.hostShareRate = contractInfo.hasOwnProperty('hostShareRate') ? contractInfo.hostShareRate : '';
            $scope.settlementBase = contractInfo.hasOwnProperty('settlementBase') ? contractInfo.settlementBase : '';
            $scope.settlementDueDay = contractInfo.hasOwnProperty('settlementDueDay') ? contractInfo.settlementDueDay : '';
            $scope.bankName = contractInfo.hasOwnProperty('bankName') ? contractInfo.bankName : '';
            $scope.bankAccount = contractInfo.hasOwnProperty('bankAccount') ? contractInfo.bankAccount : '';
            var startD = contractInfo.hasOwnProperty('startDate') ? contractInfo.startDate : '';
            $scope.startDate = PubFunction.unixToDate(startD);
            var endD = contractInfo.hasOwnProperty('endDate') ? contractInfo.endDate : '';
            $scope.endDate = PubFunction.unixToDate(endD);
            $scope.idCardFace = angular.isDefined(contractInfo.idCardFace)  ?  contractInfo.idCardFace : '';
            $scope.idCardBack = angular.isDefined(contractInfo.idCardBack) ? contractInfo.idCardBack : '';
            $scope.idCardHold = angular.isDefined(contractInfo.idCardHold) ? contractInfo.idCardHold : '';
            $scope.contractFiles = angular.isDefined(contractInfo.contractFiles) ?  contractInfo.contractFiles : [];
            $scope.directorId = contractInfo.hasOwnProperty('directorId') ? contractInfo.directorId : $scope.directors[0].userId;
            $scope.supervisorId = contractInfo.hasOwnProperty('supervisorId') ? contractInfo.supervisorId : $scope.managers[0].userId;
            $scope.agentId = contractInfo.hasOwnProperty('agentId') ? contractInfo.agentId : $scope.agents[0].userId;
        }

        //加载管理人
        $scope.loadAccounts = function () {
            $http({
                method: 'GET',
                url: 'api/v1/accounts/load/bytitle',
                headers: {'X-Auth-Token': $scope.sessionId}
            }).success(function(res, status){
                if(res.isSuccess){
                    $scope.directors = $scope.directors.concat(res.directors);
                    $scope.managers = $scope.managers.concat(res.managers);
                    $scope.agents = $scope.agents.concat(res.agents);
                }else {
                    SearchService.getTips("管理人数据加载失败");
                }
            }).error(function(res, status){
                SearchService.getTips("管理人数据加载失败");
                console.log(res);
            });
        };

        $scope.loadAccounts();

        //加载数据
        $scope.loadContract = function () {
            console.log('userId--'+$stateParams.userId);
            $http({
                method: 'POST',
                url: 'api/v1/host/contract/load',
                headers: {'X-Auth-Token': $scope.sessionId},
                data: {hostId: $stateParams.userId}
            }).success(function(res, status){
                if(res.isSuccess){
                    dataWareUp(res);
                    JSON.stringify(res);
                }else {
                    SearchService.getTips("合约资料加载失败");
                }
            }).error(function(res, status){
                SearchService.getTips("合约资料加载失败");
                console.log(res);
            });
        };

        $scope.loadContract();

        //删除文件
        $scope.deleteFile = function (key, arr) {
            arr.splice(key,1);
        };
        //预览合约
        $scope.openModal = function(idName, fileAddress){
            $scope.pdfPreview = $sce.trustAsResourceUrl(fileAddress);
            $(idName).modal();
        };

        /* 选择日期或者时间
        * json : 参数包含，作用对象，事件类型，日期格式，时间最大值设定，时间最小值设定.........
        **/
        $scope.laydate = function(json, type){
            json.choose = function (date) {
                $scope[type] = date;
            };
            laydate(json);
        };

        var updateSelected = function(action, id){
            if(action == 'add' ){
                $scope.selectedTalent.push(id);
            }
            if(action == 'remove' ){
                $scope.selectedTalent.splice($scope.selectedTalent.indexOf(id), 1);
            }
        };

        $scope.updateSelection = function($event, id){
            var checkbox = $event.target;
            var action = (checkbox.checked?'add':'remove');
            updateSelected(action, id);
        };

        $scope.isSelected = function (id) {
            return $scope.selectedTalent.indexOf(id) >= 0;
        };

        //输入校验
        $scope.inputValidate = function () {
          if($scope.selectedTalent.length === 0 || $scope.requiredHours === '' || $scope.baseSalary.amount === ''|| $scope.platformShareRate === '' || $scope.settlementBase === '' ||
               $scope.settlementDueDay === '' ||  $scope.directorId === 0 || $scope.supervisorId === 0 || $scope.agentId === 0 || $scope.bankName === '' ||
                $scope.bankAccount === '' || $scope.startDate === '' || $scope.endDate === ''){
              return true;
          }else {
              return false;
          }
        };

        //保存数据
        $scope.save = function () {
            if($scope.isSaveBtnDis) return false;
            if($scope.inputValidate()){
                SearchService.getTips("请输入必填项");
                return false;
            }

            var reqPayload = {};
            reqPayload.hostId = $stateParams.userId;
            reqPayload.contractType = $scope.contractType;
            reqPayload.talentType = $scope.selectedTalent;
            reqPayload.requiredWorkHours = $scope.requiredHours;
            reqPayload.baseSalary = $scope.baseSalary;
            reqPayload.platformShareRate = $scope.platformShareRate;
            reqPayload.hostShareRate = $scope.platformShareRate? 100-$scope.platformShareRate : '';
            reqPayload.settlementBase = $scope.settlementBase;
            reqPayload.settlementDueDay = $scope.settlementDueDay;
            reqPayload.bankName = $scope.bankName;
            reqPayload.bankAccount = $scope.bankAccount;
            reqPayload.directorId = $scope.directorId;
            reqPayload.supervisorId = $scope.supervisorId;
            reqPayload.agentId = $scope.agentId;
            var dateArrStart = $scope.startDate.split('-');
            reqPayload.startDate = new Date(dateArrStart[0], dateArrStart[1]-1, dateArrStart[2]).getTime();
            var dateArrEnd = $scope.endDate.split('-');
            reqPayload.endDate = new Date(dateArrEnd[0], dateArrEnd[1]-1, dateArrEnd[2]).getTime();
            if($scope.idCardFace) reqPayload.idCardFace = $scope.idCardFace;
            if($scope.idCardBack) reqPayload.idCardBack = $scope.idCardBack;
            if($scope.idCardHold) reqPayload.idCardHold = $scope.idCardHold;
            reqPayload.contractFiles = $scope.contractFiles;
            // console.log('reqPayload--'+ JSON.stringify(reqPayload));
            //防止重复提交数据
            $scope.isSaveBtnDis = true;

            $http({
                method: 'POST',
                url: 'api/v1/host/contract/save',
                headers: {'X-Auth-Token': $scope.sessionId},
                data: reqPayload
            }).success(function(res, status){
                if(res.isSuccess){
                    dataWareUp(res);
                    SearchService.getTips("保存成功");
                    $scope.isSaveBtnDis = false;
                    // console.log('save data success---'+JSON.stringify(res));
                }
            }).error(function(res, status){
                SearchService.getTips("保存失败");
                $scope.isSaveBtnDis = false;
                console.log(res);
            });
        };

        $scope.upload = function (file, imgSrc, contractFiles) {
            var uploadFile = {sessionId: $scope.sessionId};
            if(file) {
                uploadFile.fileName = file.name;
                fileReader.readAsDataUrl(file, $scope)
                    .then(function(result) {
                        uploadFile.fileBase64 = result.split(',')[1];
                        $http({
                            method: 'POST',
                            url: '/file/upload',
                            headers: {'X-Auth-Token': $scope.sessionId},
                            data: uploadFile
                        }).success(function(res, status){
                            if(res.isSuccess){
                                if(imgSrc) $scope[imgSrc] = {fileName: file.name, fileAddress: res.downloadPath};
                                if(contractFiles){
                                    contractFiles.push({fileName: file.name, fileAddress: res.downloadPath});
                                }
                                SearchService.getTips("上传成功");
                                console.log('file upload success---'+JSON.stringify(res));
                            }
                        }).error(function(res, status){
                            SearchService.getTips("上传失败");
                            console.log(res);
                        });
                    });
            }
        };

}]);
