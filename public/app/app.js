angular.module('userApp', [
    'appRoutes',
    'userControllers',
    'userServices',
    'ngAnimate',
    'mainController',
    'authServices',
    'interviewServices',
])

.config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors')
})