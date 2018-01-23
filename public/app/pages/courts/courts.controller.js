angular.module('badminton-booking')

.controller('CourtsCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$http', 'firebase', 'toasterService', 'court',

    function ($scope, $rootScope, $state, $stateParams, $http, firebase, toasterService, court) {

        var courtCost = 0.7;

        $scope.firebase = firebase;

        $scope.now = new Date().getTime();

        function getCourts() {
            court.getBookings().then(function (data) {
                var bookings = [];
                for (key in data) {
                    bookings.push(data[key]);
                }

                $scope.bookings = bookings.sort(function (a, b) {
                    if (a.timestamp > b.timestamp) {
                        return 1;
                    }
                    if (a.timestamp < b.timestamp) {
                        return -1;
                    }
                    return 0;
                });

                for (var i = 0; i < $scope.bookings.length; i++) {
                    for (var p = 0; p < $scope.bookings[i].players.length; p++) {
                        getProfileImage($scope.bookings[i].players[p]);
                    }
                }

            });
        }

        var getProfileImage = function (player) {
            var url = "https://hursley-badminton.firebaseio.com/players/" + player.uid + "/photoURL.json";
            $http.get(url).then(function (resp) {
                player.photoURL = resp.data;
            }, function (error) {
                player.photoURL = "/images/cock.jpg";
            });
        }

        getCourts();

        $rootScope.$on("courtDeleted", function () {
            getCourts();
        });;

        $scope.addToBooking = court.addToBooking;

        $scope.removeFromBooking = court.removeFromBooking;

        $scope.deleteBooking = court.deleteBooking;
    }
]);