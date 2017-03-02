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
    'sharedService'
])

.config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors')
})