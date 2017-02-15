angular.module('userApp', [
    'appRoutes',
    'userControllers',
    'userServices',
    'ngAnimate',
    'mainController',
    'authServices',
    'interviewServices',
    'fileModelDirective',
    'uploadFileService'
])

.config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors')
})