/**
 * Created by rex_fzhou on 2016/11/9.
 */
backStart.factory('ImgUploadService', ['$http', function($http){
    var ImgUploadService = {};

    ImgUploadService.upload = function (hostName, tokenCode, file, succCB, errCB) {
        var formData = new FormData(file);
        formData.append('imageFile', file);
        $http({
            method: 'POST',
            url: hostName + "v1/host/application/image?token=" + tokenCode,
            headers: {'Content-Type':undefined},
            data: formData
        }).success(function(res){
            if(res.success){
                succCB({success:true, imgSrc:res.results.url});
            }else {
                errCB({success:false}) ;
            }
        }).error(function(res){
            console.log('Image upload error--' + res);
            errCB();
        });
    };
    return ImgUploadService;
}]);