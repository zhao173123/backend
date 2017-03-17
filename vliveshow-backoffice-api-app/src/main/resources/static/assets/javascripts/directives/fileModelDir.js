backStart.directive('idenFront', ['$parse', function ($parse) {
    return{
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.idenFront);
            var modelSetter = model.assign;
            element.bind('change', function(event){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
                //附件预览
                scope.file = (event.srcElement || event.target).files[0];
                scope.getIdenFrontFile();
            });
        }
    }
}]);

backStart.directive('idenBack', ['$parse', function ($parse) {
    return{
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.idenBack);
            var modelSetter = model.assign;
            element.bind('change', function(event){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
                //附件预览
                scope.file = (event.srcElement || event.target).files[0];
                scope.getIdenBackFile();
            });
        }
    }
}]);

backStart.directive('idenHand', ['$parse', function ($parse) {
    return{
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.idenHand);
            var modelSetter = model.assign;
            element.bind('change', function(event){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
                //附件预览
                scope.file = (event.srcElement || event.target).files[0];
                scope.getIdenHandFile();
            });
        }
    }
}]);
backStart.directive('contractFile', ['$parse', function ($parse) {
    return{
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.contractFile);
            var modelSetter = model.assign;
            element.bind('change', function(event){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
                //附件预览
                scope.file = (event.srcElement || event.target).files[0];
                scope.getContractFile();
            });
        }
    }
}]);