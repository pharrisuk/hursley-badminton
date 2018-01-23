angular.module('badminton-booking')

.controller('MyProfileCtrl', ['$scope', '$state', '$stateParams', '$http', '$filter', 'firebase', 'balance', 'toasterService', function ($scope, $state, $stateParams, $http, $filter, firebase, balance, toasterService) {

    $scope.isDisabled = false;

    $scope.currentFile = null;

    $scope.setFile = function (element) {
        $scope.currentFile = element.files[0];
        $scope.$apply();
    }

    $scope.uploadFile = function () {
        var formData = new FormData();
        formData.append("file", $scope.currentFile);
        formData.append("name", $scope.firebase.getUser().uid);
        return $http.post("/upload", formData, {
            headers: {
                'Content-Type': undefined
            },
            transformRequest: angular.identity
        }).then(function () {
            var user = $scope.firebase.getUser();
            user.photoURL = "/uploads/" + $scope.currentFile.name;
            firebase.update(user).then(function () {
                $scope.user = firebase.getUser();
                $scope.origUser = angular.copy($scope.user);
                toasterService.displayToast("Profile photo updated", "success");
            }, function (error) {
                toasterService.displayToast(error, "error");
            });
        }, function (error) {
            toasterService.displayToast(error, "error");
        });;
    }


    $scope.cancel = function () {
        $state.go('home', {}, {
            reload: true
        });
    };

    if (firebase.isLoggedIn()) {
        $scope.user = firebase.getUser();

        $scope.origUser = angular.copy($scope.user);

        balance.get($scope.user.uid).then(function (data) {
            $scope.balance = $filter('number')(data.balance, 2);
        });

    } else {
        $scope.cancel();
    }

    $scope.firebase = firebase;

    $scope.isDisabled = function () {
        return angular.equals($scope.user, $scope.origUser)
    };

    $scope.save = function () {
        firebase.update($scope.user).then(function () {
            $scope.origUser = angular.copy($scope.user);
        }, function () {

        });
    };

}]);