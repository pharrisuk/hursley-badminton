angular.module('badminton-booking')

.controller('AdminCtrl', ['$scope', '$state', '$stateParams', 'toasterService', '$mdDialog', '$filter', '$mdMedia', 'court', 'balance', 'players',

    function ($scope, $state, $stateParams, toasterService, $mdDialog, $filter, $mdMedia, court, balance, players) {

        $scope.bookingTime = moment("12:00", "HH:mm").toDate();
        $scope.selectedCourt = null;
        $scope.noCost = false;
        $scope.notes = "";
        $scope.$mdMedia = $mdMedia;

        court.get().then(function (data) {
            $scope.allCourts = data;
            $scope.selectedCourt = data[1];
        }, function (error) {
            console.log(error);
        });

        function fetchBalance(player) {
            balance.get(player.uid).then(function (data) {
                player.balance = data.balance;
            });
        }

        function getAllPlayerBalances() {
            players.get().then(function (data) {
                $scope.players = data;
                for (key in $scope.players) {
                    fetchBalance($scope.players[key]);
                }
            }, function (error) {
                reject(error);
            });
        }

        getAllPlayerBalances();

        $scope.addBooking = function () {

            if ($scope.bookingDate == null || $scope.bookingTime == null || $scope.selectedCourt == null) {
                toasterService.displayToast("Error. All fields are required.", "error");
            } else {

                var date = moment($scope.bookingDate);
                var time = moment($scope.bookingTime);
                date.hour(time.hour());
                date.minute(time.minute());

                var timestamp = date.toDate().getTime();

                var newBooking = {
                    "id": new Date().getTime(), // unique...
                    "timestamp": timestamp,
                    "court": $scope.selectedCourt.name,
                    "players": [],
                    "reserves": [],
                    "noCost": $scope.noCost,
                    "comments": $scope.notes
                };

                court.addBooking(newBooking).then(function (data) {
                    toasterService.displayToast("Success. New booking has been added.", "success");
                }, function (error) {
                    reject(error);
                });
            }
        };

        $scope.setNewBalance = function (ev, player) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.prompt()
                .title('What is the new balance for ' + player.name + '?')
                .textContent('Current Balance : ' + $filter('currency')(player.balance, '£', 2))
                .placeholder('New Balance')
                .ariaLabel('New Balance')
                //.initialValue('Buddy')
                .targetEvent(ev)
                .ok('Set Balance')
                .cancel('Cancel');

            $mdDialog.show(confirm).then(function (result) {
                player.balance = result;
                balance.set(player).then(function () {
                    toasterService.displayToast("Success. Player balance has been updated.", "success");
                    getAllPlayerBalances();
                    $rootScope.$emit("balanceUpdated");
                }, function (error) {
                    toasterService.displayToast("Error. Balance has not been updated. " + error, "error");
                });
            }, function () {
                // don't need to do anything.
            });
        };

    }
]);