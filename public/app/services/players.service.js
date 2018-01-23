app.service('players', ['$rootScope', '$q', '$http', function ($rootScope, $q, $http) {
    return {
        get: function (id) {
            return $q(function (resolve, reject) {
                var ref = "players";
                if (id != null) {
                    ref = "players/" + id;
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
                    firebase.database().ref('players/' + userId).set(user).then(function () {
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