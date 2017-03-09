'use strict'

angular.module("logoutControllers", [])

.controller("logoutCtrl", function($location, $route, Auth) {
    Auth.logout();
    $location.path('/login');
    $route.reload();
})