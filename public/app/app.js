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
    'intChartControllers',
    'empChartControllers',
    'employeeControllers',
    'interviewControllers',
    'sharedService',
    'employeeServices',
    'appInfoDirective'
])

.config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors')
})