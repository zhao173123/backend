backStart.factory('HttpCallService', ['$http', '$q', function($http, $q){
    var httpCallService = {};
    httpCallService.httpCall = function(method, url, req, succCB, errCB){
        var payLoad = {method: method, url: url};
        if(req) payLoad.data = req;
        $http(payLoad).success(function(res, status){
            succCB(res, status);
        }).error(function(res, status){
            errCB(res, status);
        });
    };
    httpCallService.getData = function (url) {
        var deferred = $q.defer();
        $http.get(url).success(function (data) {
            deferred.resolve(data);
        }).error(function (err) {
            console.log('GET请求数据失败---'+JSON.stringify(err));
            deferred.reject(err);
        });
        return deferred.promise;
    };
    return httpCallService;
}]);
