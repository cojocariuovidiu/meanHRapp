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
    'chartControllers',
    'employeeControllers',
    'interviewControllers',
    'sharedService',
    'employeeServices'
])

.config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors')
})