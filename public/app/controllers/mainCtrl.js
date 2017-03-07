angular.module('mainController', ['ngMaterial'])

.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('docs-dark')
})

.controller('mainCtrl', function($scope, shareData, $mdSidenav, Auth, $timeout, $location, $rootScope, $route) {
    var main = this;

    main.loadme = false;

    main.checkSession = function() {
        if (Auth.isLoggedIn()) {
            main.checkingsession = true;
        }
    }

    main.checkSession();

    // $rootScope.$on('$routeChangeSuccess', function(e, current, pre) {
    //     console.log('Current route name: ' + $location.path());
    //     // Get all URL parameter
    //     console.log($routeParams);
    // });

    $rootScope.$on('$routeChangeStart', function(e, current, pre) {
        if (!main.checkingsession) main.checkSession();

        if (Auth.isLoggedIn()) {

            // Get current route and set it to the nav
            var currentRoute = $location.path()
            while (currentRoute.charAt(0) === '/') {
                currentRoute = currentRoute.substr(1);
            }
            $scope.currentNavItem = currentRoute

            main.isLoggedIn = true;

            Auth.getUser().then(function(data) {
                //to accest username from the front-end
                main.username = data.data.username
                main.useremail = data.data.email
                main.group = data.data.group
                main.loadme = true;
                //share logged user to other controllers
                shareData.loggedUser = data.data.username
            })
        } else {
            //console.log('failure, User is NOT logged in ');
            main.isLoggedIn = false;
            main.username = null;
            main.loadme = true;
        }
    })

    main.doLogin = function(loginData) {
        main.successMsg = false;
        main.errorMsg = false;
        main.isLoading = true;

        Auth.login(main.loginData).then(function(data) {
            //console.log(data.data.success, data.data.message);
            if (data.data.success) {
                //Create Success message
                main.successMsg = data.data.message + '...Redirecting';
                $timeout(function() {
                    //Redirect To HomePage
                    main.checkSession();

                    //loading twich to hack the error :-(
                    // getInterviewsFiltered('All')
                    console.log('got int on login')
                    $location.path('/interviews')
                    main.isLoading = false
                    main.loginData = null;
                    main.successMsg = false;

                    // main.group = data.data.group
                })

            } else {
                //Create error message
                main.errorMsg = data.data.message;
                $timeout(function() {
                    main.isLoading = false
                }, 500)
            }
        })
    }

    main.logout = function() {
        Auth.logout();
        $location.path('/login');
        $route.reload();
    }

    // main.goProfile = function() {
    //     $location.path('/profile');
    //     $route.reload();
    // }


    // main.toggleLeft = buildToggler('left');

    // function buildToggler(componentId) {
    //     return function() {
    //         $mdSidenav(componentId).toggle();
    //         // showToast()
    //     };
    // }

    main.menu = [{
            link: '/',
            title: 'Home',
            icon: 'dashboard'
        },
        {
            link: '/interviews',
            title: 'Interviste',
            icon: 'message'
        },
        {
            link: '/employees',
            title: 'Dipendenti',
            icon: 'message'
        }
        // {
        //     link: '/statistics',
        //     title: 'Statistiche',
        //     icon: 'message'
        // }
    ];
    main.admin = [{
            link: '',
            title: 'Log Out',
            icon: 'delete',
        },
        {
            link: '/profile',
            title: 'Profilo',
            icon: 'settings'
        }
    ];

});




// .config(function($mdThemingProvider) {
//   $mdThemingProvider.theme('default')
//     .primaryPalette('pink')
//     .accentPalette('orange');
// });