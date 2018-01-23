angular.module('badminton-booking')

.directive('badmintonCourt', [function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'app/directives/court/court.html',
        scope: {
            data: '=',
            user: '=',
            funds: '=',

            add: '&',
            remove: '&',

            reserve: '&',
            unreserve: '&',

            delete: '&'
        },
        link: function (scope, element, attrs) {

            scope.isPlayer = function (arr, email) {
                if (arr) {
                    for (var i = 0; i < arr.length; i++) {
                        if (arr[i].email == email) {
                            return true;
                        }
                    }
                    return false;
                } else {
                    return false;
                }
            };

            scope.canAddAsPlayer = function (data, user, funds) {
                if (user == null || !user.isLoggedIn()) {
                    return false;
                } else {
                    if (data.noCost) {
                        return false;
                    }
                    if (data.players == null && funds > -1.2) {
                        // no existing players and appropriate balance.
                        return true;
                    }
                    if (!scope.isPlayer(data.players, user.getEmail()) && data.players.length < 4 && funds > -1.2) {
                        return true;
                    }
                    return false;
                }
            };

            scope.canAddAsReserve = function (data, user, funds) {
                if (user == null || !user.isLoggedIn()) {
                    return false;
                } else {
                    if (data.noCost) {
                        return true;
                    }
                    if (data.players == null) {
                        // no existing players and appropriate balance.
                        return false;
                    }
                    if (!scope.isPlayer(data.players, user.getEmail()) && (data.reserves == null || !scope.isPlayer(data.reserves, user.getEmail())) && funds > -1.2) {
                        return true;
                    }
                    return false;
                }
            };
        }
    };
}]);