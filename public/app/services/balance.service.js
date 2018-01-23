app.service('balance', ['$rootScope', '$q', '$http', function ($rootScope, $q, $http) {
    return {
        init: function (user) {
            var _this = this;
            return $q(function (resolve, reject) {
                var newBalance = {
                    "balance": 0,
                    "uid": user.uid.replace(/\./g, "")
                };

                _this.set(newBalance).then(function (data) {
                    resolve();
                }, function (error) {
                    reject(error);
                });
            });
        },
        get: function (id) {
            return $q(function (resolve, reject) {
                var ref = "balance";
                if (id != null) {
                    ref = "balance/" + id;
                }

                firebase.database().ref(ref).once('value').then(function (snapshot) {
                    resolve(snapshot.val());
                }, function (error) {
                    reject(error);
                });
            });
        },
        set: function (user) {
            return $q(function (resolve, reject) {
                if (user.uid != null) {
                    var userId = user.uid;
                    var balance = {
                        "uid": userId,
                        "balance": user.balance
                    }
                    firebase.database().ref('balance/' + userId).set(balance).then(function () {
                        resolve();
                    }, function (error) {
                        reject(error);
                    });
                } else {
                    reject("No object ID specfied");
                }
            });
        },
    }
}]);