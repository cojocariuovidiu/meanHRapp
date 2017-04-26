angular.module('mainController', ['ngMaterial'])

    .config(function ($mdThemingProvider) {
        $mdThemingProvider.theme('docs-dark')
    })
    // .config( function($mdThemingProvider) {
    //         $mdThemingProvider.theme('default')
    //         .primaryPalette('indigo')
    //         .accentPalette('grey')
    //         .warnPalette('red');
    //     })

    .controller('mainCtrl', function ($scope, $mdToast, shareData, Auth, $timeout, $location, $rootScope, $route) {
        var main = this;

        main.loadme = false;

        main.checkSession = function () {
            if (Auth.isLoggedIn()) {
                main.checkingsession = true;
            }
        }

        main.checkSession();

        var showToast = function (message) {
            $mdToast.show(
                $mdToast.simple()
                    .action('OK')
                    .textContent(message)
                    .hideDelay(2000)
                    .highlightAction(true)
                    .capsule(true)
                    .position('top right')
                // .theme(string)
            );
        }

        $rootScope.$on('$routeChangeStart', function (e, current, pre) {
            if (!main.checkingsession) main.checkSession();

            if (Auth.isLoggedIn()) {

                // Get current route and set it to the nav
                var currentRoute = $location.path()
                while (currentRoute.charAt(0) === '/') {
                    currentRoute = currentRoute.substr(1);
                }
                $scope.currentNavItem = currentRoute

                main.isLoggedIn = true;

                Auth.getUser().then(function (data) {
                    main.username = data.data.username
                    main.useremail = data.data.email
                    main.group = data.data.group
                    main.loadme = true;
                    shareData.loggedUser = data.data.username
                })
            } else {
                main.isLoggedIn = false;
                main.username = null;
                main.loadme = true;
            }
        })

        main.doLogin = function (loginData) {
            main.errorMsg = false;
            //main.isLoading = true;

            Auth.login(main.loginData).then(function (data) {
                if (data.data.success) {
                    showToast(data.data.message + '...Redirecting')
                    // main.isLoading = false
                    $timeout(function () {
                        main.checkSession();
                        $location.path('/interviste')
                        main.loginData = null;
                    }, 2000)

                } else {
                    //Create error message
                    showToast(data.data.message)
                    // main.isLoading = false
                }
            })
        }

        main.logout = function () {
            Auth.logout();
            $location.path('/login');
            $route.reload();
        }

    });




// .config(function($mdThemingProvider) {
//   $mdThemingProvider.theme('default')
//     .primaryPalette('pink')
//     .accentPalette('orange');
// });