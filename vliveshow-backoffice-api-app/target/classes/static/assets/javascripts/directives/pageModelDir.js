/**
 * Created by ivyguo on 2016/9/2.
 */
backStart.directive('page', function () {
    return {
        restrict: 'A',
        templateUrl:'../page.html',
        scope: {
            itemsSource: '=',
            pageSize: '=',
            currentPage: '=',
            currentList:'='
        },
        controller: function ($scope) {
            $scope.getPageNum = function () {   //pageNum
                var pageNum = 0, temp = 0;
                temp = $scope.itemsSource.length % $scope.pageSize;
                if (temp === 0) {
                    pageNum = Math.floor($scope.itemsSource.length / $scope.pageSize);
                } else {
                    pageNum = Math.floor($scope.itemsSource.length / $scope.pageSize) + 1;
                }
                return pageNum;
            };
            $scope.getPageShowArray = function (currenPage, len) {
                var result = [];
                if (currenPage - 1 === 0) {
                    var resultLen = len > $scope.pageNum ? $scope.pageNum : len;
                    for (var i = 0; i < resultLen; i++) {
                        result.push(i + 1);
                    }
                } else {
                    var resultLen = len > $scope.pageNum ? $scope.pageNum : len;
                    for (var i = 0; i < resultLen; i++) {
                        result.push(currenPage - 1 + i);
                    }
                }
                return result;
            };
            $scope.showPage = function (Id) {
                $scope.currentPage = Id;
                var start = (Id - 1) * $scope.pageSize;
                var end = Id * $scope.pageSize;
                $scope.currentList = $scope.itemsSource.slice(start, end);
                $scope.$parent[$scope.currentList] =  $scope.currentList;
                return $scope.currentList;

            };
            $scope.prevClick=function () {  //上一页
                var Id = ($scope.currentPage - 1) == 0 ? 1 : $scope.currentPage - 1;
                $scope.showPage(Id);
            };
            $scope.nextClick = function () { // 下一页
                var Id = $scope.currentPage + 1 > $scope.pageNum ? $scope.pageNum : $scope.currentPage + 1;
                $scope.showPage(Id);
            };
            $scope.firstClick = function () { // 首页
                var Id = 1;
                $scope.showPage(Id);
            };
            $scope.lastClick = function () { // 尾页
                var Id = $scope.pageNum;
                $scope.showPage(Id);
            };
        },
        link: function (scope, element, attrs) {
            scope.$watch("itemsSource",function(){
                if(scope.itemsSource == undefined){
                    return false;
                }
                scope.pageNum = scope.getPageNum();
                scope.pageBoxArray = scope.getPageShowArray(scope.currentPage, scope.pageNum);
                scope.$parent[scope.currentList] = scope.showPage(1);
            })
        }
    };
});