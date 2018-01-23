var app = angular.module('badminton-booking', [
    'ui.router',
    'ngAria',
    'ngMaterial',
    'ngAnimate',
    'mdPickers',
    'jshor.angular-addtocalendar',
    'ui.bootstrap'
]);

app.config(function ($urlRouterProvider, $stateProvider, $locationProvider, $mdThemingProvider) {
    $locationProvider.html5Mode({
        enabled: true
    });

    $urlRouterProvider
        .otherwise('home');

    $stateProvider
        .state('myprofile', {
            url: '/myprofile',
            templateUrl: 'app/pages/myprofile/myprofile.html',
            controller: 'MyProfileCtrl',
            params: {
                icon: 'fa-user',
                title: 'My Profile'
            }
        })
        .state('login', {
            url: '/login',
            templateUrl: 'app/pages/login/login.html',
            controller: 'LoginCtrl',
            params: {
                icon: 'fa-envelope',
                title: 'Login / Register'
            }
        })
        .state('home', {
            url: '/',
            templateUrl: 'app/pages/home/home.html',
            controller: 'HomeCtrl',
            params: {
                icon: 'fa-home',
                title: 'Home Page'
            }
        })
        .state('courts', {
            url: '/courts',
            templateUrl: 'app/pages/courts/courts.html',
            controller: 'CourtsCtrl',
            params: {
                icon: 'fa-calendar',
                title: 'Courts'
            }
        })
        .state('admin', {
            url: '/admin',
            templateUrl: 'app/pages/admin/admin.html',
            controller: 'AdminCtrl',
            params: {
                icon: 'fa-cog',
                title: 'Administration'
            }
        });
});


app.controller('MainCtrl', ['$scope', '$stateParams', '$state', '$rootScope', '$http', '$mdSidenav', '$filter', 'firebase', 'balance', 'navService',


    function ($scope, $stateParams, $state, $rootScope, $http, $mdSidenav, $filter, firebase, balance, navService) {

        navService.setNav({
            icon: '',
            title: false
        });

        $scope.nav = navService;
        $scope.firebase = firebase;
        $rootScope.userData = firebase.getUser();
        $rootScope.userBalance = -0.01;

        $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
            $scope.closeMenu();
            navService.setNav(toParams);
        });

        $rootScope.$on('balanceUpdated', function () {
            if ($scope.firebase.getUser() != null) {
                balance.get($scope.firebase.getUser().uid.replace(/\./g, "")).then(function (data) {
                    $rootScope.userBalance = $filter('number')(data.balance, 2);
                });
            }
        });

        $scope.toggleMenu = function () {
            $mdSidenav("left")
                .toggle()
                .then(function () {
                    //console.debug("toggle " + navID + " is done");
                });
        };

        $scope.closeMenu = function () {
            $mdSidenav("left")
                .close()
                .then(function () {
                    //console.debug("toggle " + navID + " is done");
                });
        }

        $scope.navigate = function (state, params) {
            $scope.toggleMenu();
            if (params == null) {
                $state.go(state, {}, {
                    "reload": true
                });
            } else {
                $state.go(state, params, {
                    "reload": true
                });
            }
        }
}]);

app.filter("email", function () {
    return function (emailAddr) {
        return emailAddr.substr(0, emailAddr.indexOf("@"));
    }
});