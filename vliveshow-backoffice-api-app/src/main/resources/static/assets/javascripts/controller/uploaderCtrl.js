/**
 * Created by rex_fzhou on 2016/8/10.
 */
backStart.controller('UploaderController', ['$scope', '$http', 'fileReader', function($scope, $http, fileReader){
    $scope.getFile = function () {
        fileReader.readAsDataUrl($scope.file, $scope)
            .then(function(result) {
                $scope.imageSrc = result;
            });
    };
    $scope.upLoadImg = function () {
        console.log('uploadImg....')
        var fd = new FormData();
        fd.append('file', $scope.imageSrc);
        $http({
            url : '/',
            method : "POST",
            data : fd

        }).success(function (data) {

        }).error(function (message) { //

        })
    }

}]);