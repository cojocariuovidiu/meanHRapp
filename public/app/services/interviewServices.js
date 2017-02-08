angular.module('interviewServices', [])

.factory('Interview', function($http) {
    interviewFactory = {};

    interviewFactory.getinterviews = function() {
        return $http.get('/api/getinterviews')
    }

    //Interview.create(newInterview)
    interviewFactory.create = function(obj) {
        return $http.post('/api/interview', obj).then(function(response) {
            console.log(response.data.success);
        })
    }

    return interviewFactory;
})