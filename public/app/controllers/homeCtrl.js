angular.module('homeController', [])

    .controller('homeCtrl', function ($scope, $location) {

        $location.path('/interviste');

    });
