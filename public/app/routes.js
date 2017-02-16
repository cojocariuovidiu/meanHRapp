var app = angular.module('appRoutes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'app/views/pages/home.html'
        })
        .when('/about', {
            templateUrl: 'app/views/pages/about.html',
            authenticated: true
        })
        .when('/register', {
            templateUrl: 'app/views/pages/users/register.html',
            controller: 'regCtrl',
            controllerAs: 'register',
            authenticated: false
        })
        .when('/login', {
            templateUrl: 'app/views/pages/users/login.html',
            authenticated: false
        })
        .when('/logout', {
            templateUrl: 'app/views/pages/users/logout.html',
            authenticated: true
        })
        .when('/profile', {
            templateUrl: 'app/views/pages/users/profile.html',
            authenticated: true
        })
        .when('/tabella', {
            templateUrl: 'app/views/pages/tableData/tabella.html',
            authenticated: true
        })
        .when('/tabella/interview', {
            templateUrl: 'app/views/pages/tableData/interview.html',
            authenticated: true
        })
        .when('/tabella/edit', {
            templateUrl: 'app/views/pages/tableData/editinterview.html',
            authenticated: true
        })
        .when('/interviews', {
            templateUrl: 'app/views/pages/interviews/interviews.html',
            authenticated: true
        })
        .otherwise({ redirectTo: '/' });

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    })
});

//restrict routes
app.run(['$rootScope', 'Auth', '$location', function($rootScope, Auth, $location) {
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
        if (next.$$route.authenticated == true) {
            //console.log('needs to be auth');
            if (!Auth.isLoggedIn()) {
                event.preventDefault(); //prevent from navigating
                $location.path('/login')
            }

        } else if (next.$$route.authenticated == false) {
            //console.log('does not need to be auth');
            if (Auth.isLoggedIn()) {
                event.preventDefault();
                // $location.path('/about')
            }

        }
        // console.log(Auth.isLoggedIn());
        // console.log(next.$$route.authenticated);

    })
}])