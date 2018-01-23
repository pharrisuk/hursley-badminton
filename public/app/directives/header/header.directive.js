angular.module('badminton-booking')

.directive('badmintonBookingHeader', [function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'app/directives/header/header.html',
        scope: {
            mode: '=',
            pageTitle: '=',
            pageIcon: '=',
            toggleSideMenu: '&',
            isLoading: '='
        },
        link: function (scope, element, attrs) {

        }
    };
}]);