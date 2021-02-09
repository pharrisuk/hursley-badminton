angular.module('badminton-booking')

.controller('HomeCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$http', 'firebase', 'balance', 'court', 'players',

    function ($scope, $rootScope, $state, $stateParams, $http, firebase, balance, court, players) {

        $scope.firebase = firebase;

        $scope.now = moment().toDate().getTime();

        function getAllPlayers() {
            players.get().then(function (data) {
                $scope.players = data;
            }, function (error) {
                console.log(error);
            });
        }

        getAllPlayers();

        function getCourts() {
            court.getBookings().then(function (data) {
                var bookings = [];
                for (key in data) {
                    if (data[key].timestamp + (1000 * 60 * 60) > $scope.now) {
                        bookings.push(data[key]);
                    }
                }

                var allBookings = bookings.sort(function (a, b) {
                    if (a.timestamp > b.timestamp) {
                        return 1;
                    }
                    if (a.timestamp < b.timestamp) {
                        return -1;
                    }
                    return 0;
                });

                $scope.bookings = [];
                if (allBookings.length > 0) {
                    if (allBookings.length == 1) {
                        $scope.bookings = allBookings;
                    } else {
                        $scope.bookings = [allBookings[0], allBookings[1]];
                    }
                }

                for (var i = 0; i < $scope.bookings.length; i++) {
                    if ($scope.bookings[i].players != null) {
                        for (var p = 0; p < $scope.bookings[i].players.length; p++) {
                            getProfileImage($scope.bookings[i].players[p]);
                        }
                    }
                }
            });
        }

        var getProfileImage = function (player) {
            var url = "https://hursleybadminton.firebaseio.com/players/" + player.uid + "/photoURL.json";
            $http.get(url).then(function (resp) {
                player.photoURL = resp.data;
            }, function (error) {
                player.photoURL = "/images/cock.jpg";
            });
        }

        var getNews = function () {
            var url = "https://hursleybadminton.firebaseio.com/news.json";
            $http.get(url).then(function (resp) {
                console.log("news = ", resp.data);
                $scope.news = resp.data;
            }, function (error) {
                $scope.news = null;
            });
        }

        $rootScope.$on("courtDeleted", function () {
            getCourts();
        });;

        getCourts();
        getNews();

        $scope.addToBooking = court.addToBooking;

        $scope.removeFromBooking = court.removeFromBooking;

        $scope.deleteBooking = court.deleteBooking;

    }
]);