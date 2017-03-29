angular.module('userApp', [
    'appRoutes',
    'userControllers',
    'userServices',
    'ngAnimate',
    'mainController',
    'authServices',
    'interviewServices',
    'fileModelDirective',
    'uploadFileService',
    'employeeControllers',
    'interviewControllers',
    'sharedService',
    'employeeServices',
    'appInfoDirective',
    'logoutControllers',
    'homeController'
])

.config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors')
})