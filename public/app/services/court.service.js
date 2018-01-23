app.service('court', ['$q', '$http', '$rootScope', 'toasterService', 'balance', 'firebase', function ($q, $http, $rootScope, toasterService, balance, fb) {

    var courtCost = 0.7;

    return {
        get: function () {
            return $q(function (resolve, reject) {
                var ref = "courts";

                firebase.database().ref(ref).once('value').then(function (snapshot) {
                    resolve(snapshot.val());
                }, function (error) {
                    reject(error);
                });
            });
        },
        getBookings: function () {
            return $q(function (resolve, reject) {
                var ref = "bookings";

                firebase.database().ref(ref).once('value').then(function (snapshot) {
                    resolve(snapshot.val());
                }, function (error) {
                    reject(error);
                });
            });
        },
        addBooking: function (booking) {
            return $q(function (resolve, reject) {
                firebase.database().ref('bookings/' + booking.id).set(booking).then(function () {
                    resolve();
                }, function (error) {
                    reject(error);
                });
            });
        },

        deleteBooking: function (booking) {
            firebase.database().ref('bookings/' + booking.id).set(null).then(function () {
                toasterService.displayToast("Successfully deleted", "success");

                $rootScope.$emit("courtDeleted");
            });
        },
        addToBooking: function (booking, reserve) {
            var playerName = fb.getUser().displayName;
            var photo = fb.getUser().photoURL;
            var playerEmail = fb.getUser().email;
            var uid = fb.getUser().uid;
            if (reserve) {
                if (booking.reserves == null) {
                    booking.reserves = [];
                }
                booking.reserves.push({
                    "name": playerName,
                    "email": playerEmail,
                    "photoURL": photo,
                    "uid": uid
                });
            } else {
                if (booking.players == null) {
                    booking.players = [];
                }
                booking.players.push({
                    "name": playerName,
                    "email": playerEmail,
                    "photoURL": photo,
                    "uid": uid
                });
            }

            firebase.database().ref('bookings/' + booking.id).set(JSON.parse(angular.toJson(booking))).then(function () {
                toasterService.displayToast("Success. You have been added to the court.", "success");

                if (!reserve) {
                    // if reserve, don't charge them.
                    balance.get(fb.getUser().uid).then(function (user) {
                        user.balance = parseFloat(user.balance) - courtCost;
                        balance.set(user).then(function (updatedBalance) {
                            $rootScope.$emit('balanceUpdated');
                        }, function (error) {
                            toasterService.displayToast("Error. " + error, "error");
                        });
                    });
                }
            }, function (error) {
                reject(error);
            });
        },

        removeFromBooking: function (booking, reserve) {
            var playerName = fb.getUser().displayName;
            var playerEmail = fb.getUser().email;

            var newPlayers = [];
            var arr = [];
            if (reserve) {
                arr = booking.reserves;
            } else {
                arr = booking.players;
            }
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].email != playerEmail) {
                    newPlayers.push(arr[i]);
                }
            }
            if (reserve) {
                booking.reserves = newPlayers;
            } else {
                booking.players = newPlayers;
            }

            firebase.database().ref('bookings/' + booking.id).set(JSON.parse(angular.toJson(booking))).then(function () {
                toasterService.displayToast("Success. You have been removed from the court.", "success");

                if (!reserve) {
                    // haven't been charged if they were a reserve..
                    balance.get(fb.getUser().uid).then(function (user) {
                        user.balance = parseFloat(user.balance) + courtCost;
                        balance.set(user).then(function (updatedBalance) {
                            $rootScope.$emit('balanceUpdated');
                        }, function (error) {
                            toasterService.displayToast("Error. " + error, "error");
                        });
                    });
                }
            }, function (error) {
                toasterService.displayToast("Error. " + error, "error");
            });
        }
    }
}]);