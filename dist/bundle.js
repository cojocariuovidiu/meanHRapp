/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

angular.module('mainController', ['ngMaterial'])

.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('docs-dark')
})
// .config( function($mdThemingProvider) {
//         $mdThemingProvider.theme('default')
//         .primaryPalette('indigo')
//         .accentPalette('grey')
//         .warnPalette('red');
//     })

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
                    // console.log('got int on login')
                    $location.path('/interviste')
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

});




// .config(function($mdThemingProvider) {
//   $mdThemingProvider.theme('default')
//     .primaryPalette('pink')
//     .accentPalette('orange');
// });

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(0);
(function webpackMissingModule() { throw new Error("Cannot find module \"run\""); }());
(function webpackMissingModule() { throw new Error("Cannot find module \"dev\""); }());


/***/ })
/******/ ]);