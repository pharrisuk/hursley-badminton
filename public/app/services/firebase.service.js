app.service('firebase', ['$rootScope', '$state', '$q', '$http', 'players', 'balance', 'toasterService', function ($rootScope, $state, $q, $http, players, balance, toasterService) {

    var userData = null;
    var credential = null;

    firebase.auth().onAuthStateChanged(function (authData) {
        if (authData === null) {
            userData = null;
        } else {
            userData = authData.providerData[0]; // This will display the user's name in our view
            if (userData.providerId == "password") {
                userData.uid = userData.uid.replace(/\./g, "");
            }
            // can't use this... need to get data from db... 
            players.get(userData.uid.replace(/\./g, "")).then(function (user) {
                userData = user;
                $rootScope.$emit('balanceUpdated');
            }, function () {
                toasterService.displayToast("Error checking for existing user...", "Error");
            });
        }
        $rootScope.$apply();
    });

    function createUser(user) {
        user.roles = ["player"];
        firebase.database().ref('players/' + user.uid.replace(/\./g, "")).set(user).then(function () {
            userData = user;
            balance.init(user);
            $rootScope.$emit('balanceUpdated');
            $rootScope.$apply();
            toasterService.displayToast("New User created. :)", "Success");
        }, function (error) {
            toasterService.displayToast("Unable to create new user.", "Error");
        });
    }

    return {
        set: function (user) {
            userData = user;
        },
        getUser: function () {
            return userData;
        },
        getName: function () {
            return userData.displayName;
        },
        getEmail: function () {
            return userData.email;
        },
        data: function () {
            return userData;
        },
        update: function (user) {
            return $q(function (resolve, reject) {
                firebase.database().ref('players/' + user.uid.replace(/\./g, "")).set(user).then(function () {
                    userData = user;
                    $rootScope.$apply();
                    toasterService.displayToast("Profile Updated", "Success");
                    resolve();
                }, function (error) {
                    toasterService.displayToast("Unable to update user.", "Error");
                    reject();
                });
            });
        },
        login: function (authMethod, email, password) {
            return $q(function (resolve, reject) {
                var provider = null;
                if (authMethod == "facebook") {
                    provider = new firebase.auth.FacebookAuthProvider();
                }

                if (authMethod == "google") {
                    provider = new firebase.auth.GoogleAuthProvider();
                }

                if (provider != null) {

                    firebase.auth().signInWithPopup(provider).then(function (result) {
                        // This gives you a Google Access Token. You can use it to access the Google API.
                        var token = result.credential.accessToken;
                        credential = result.credential;
                        var user = result.user.providerData[0];
                        players.get(user.uid).then(function (existingUser) {
                            if (existingUser == null) {
                                createUser(user);
                            }
                            resolve();
                        }, function () {
                            toasterService.displayToast("Error checking for existing user...", "Error");
                        });
                    }).catch(function (error) {
                        toasterService.displayToast(error.message, "Error");
                        reject(error.message);
                    });
                } else {
                    firebase.auth().signInWithEmailAndPassword(email, password).then(function (result) {
                        // This gives you a Google Access Token. You can use it to access the Google API.
                        console.log(result);
                        var user = result;
                        players.get(user.email.replace(/\./g, "")).then(function (existingUser) {
                            if (existingUser == null) {
                                createUser(user);
                            }
                            resolve();
                        }, function () {
                            toasterService.displayToast("Error checking for existing user...", "Error");
                        });
                    }).catch(function (error) {
                        reject(error.message);
                    });

                }
            });
        },
        register: function (email, password) {
            var _this = this;
            return $q(function (resolve, reject) {
                firebase.auth().createUserWithEmailAndPassword(email, password).then(function (result) {
                    console.log("Result s= ", result);
                    createUser({
                        "displayName": "",
                        "email": email,
                        "photoURL": "/images/cock.jpg",
                        "providerId": "password",
                        "roles": ["player"],
                        "uid": email.replace(/\./g, "")
                    });
                    _this.login(null, email, password);
                    resolve();
                }).catch(function (error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    // ...
                    reject(error);
                });
            });
        },


        logout: function () {
            firebase.auth().signOut().then(function () {
                // Sign-out successful.
                userData = null;
                $state.go("home", {}, {
                    reload: true
                });
            }, function (error) {
                // An error happened.
            });
        },
        isLoggedIn: function () {
            return userData != null;
        },
        hasRole: function (role) {
            if (userData != null) {
                if (userData.roles != null && userData.roles.indexOf(role) >= 0) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }
    }
}]);