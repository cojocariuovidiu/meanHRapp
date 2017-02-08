angular.module('userServices', [])

.factory('User', function($http) {
    userFactory = {};

    //User.create(regData)
    userFactory.create = function(regData) {
        return $http.post('/api/users', regData) //regData from userCtrl
    }

    //User.renewSession(username)
    userFactory.renewSession = function(username) {
        return $http.get('/api/renewToken/' + username)
    }

    return userFactory;
})