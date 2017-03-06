angular.module('mainController', ['ngMaterial'])

.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('docs-dark')
})

.controller('mainCtrl', function(shareData, $mdSidenav, Auth, $timeout, $location, $rootScope, $route) {
    var main = this;

    main.loadme = false;

    main.checkSession = function() {
        if (Auth.isLoggedIn()) {
            main.checkingsession = true;
        }
    }

    main.GoInterviews = function() {
        $location.path('/interviews')
    }

    main.GoEmployees = function() {
        $location.path('/employees')
    }

    main.checkSession();

    $rootScope.$on('$routeChangeStart', function() {
        if (!main.checkingsession) main.checkSession();

        if (Auth.isLoggedIn()) {
            //console.log('success, User is logged in ');

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
        // showModal(2)
        buildToggler('left')
        Auth.logout();
        $location.path('/login');
        $route.reload();
    }


    main.toggleLeft = buildToggler('left');

    function buildToggler(componentId) {
        return function() {
            $mdSidenav(componentId).toggle();
            // showToast()
        };
    }

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