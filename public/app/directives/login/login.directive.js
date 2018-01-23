angular.module('badminton-booking')

.directive('login', ['$state', function ($state) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'app/directives/login/login.html',
        scope: {
            'firebase': "=",
            'small': "="
        },
        link: function (scope, element, attrs) {

            scope.login = function () {
                $state.go("login", {}, true);
            }
        }
    }
}]);