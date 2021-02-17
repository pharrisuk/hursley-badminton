angular.module('badminton-booking')

.controller('LoginCtrl', ['$scope', '$rootScope', '$state', '$stateParams', 'navService', 'firebase', 'balance', 'court', 'players', 'toasterService',

    function ($scope, $rootScope, $state, $stateParams, navService, firebase, balance, court, players, toasterService) {
        $scope.formData = {};

        $scope.firebase = firebase;

        $scope.home = function () {
            $state.go("home", {}, true);
        }

        $scope.login = function () {
            firebase.login(null, $scope.formData.email, $scope.formData.password).then(function () {
                $state.go("home", {}, true);
            }, function (error) {
                console.log(error);
                toasterService.displayToast(error.message, "error");
            });
        }

        $scope.register = function () {
            firebase.register($scope.formData.email, $scope.formData.password).then(function () {
                $state.go("home", {}, true);
            }, function (error) {
                console.log(error);
                toasterService.displayToast(error.message, "error");
            });
        }

        $scope.resetpw = function () {
            firebase.resetpw($scope.formData.email).then(function () {
                toasterService.displayToast("An email has been sent with a link to reset your password");
                //$state.go("home", {}, true);
            }, function (error) {
                console.log(error);
                toasterService.displayToast(error.message, "error");
            });
        }
    }
]);