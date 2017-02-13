angular.module('interviewServices', [])

.factory('Interview', function($http) {
    interviewFactory = {};

    ////Interview.getinterviews()
    interviewFactory.getinterviews = function() {
        return $http.get('/api/getinterviews')
    }

    //Interview.create(newInterview)
    interviewFactory.create = function(obj) {
        return $http.post('/api/interview', obj).then(function(response) {
            console.log("Data saved status:", response.data.success);
        })
    }


    // interviewFactory.getinterview = function() {
    //     return $http.get('/api/getinterview')
    // }
    return interviewFactory;
})