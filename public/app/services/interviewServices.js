angular.module('interviewServices', [])

.factory('Interview', function($http) {
    interviewFactory = {};

    ////Interview.getinterviews()
    interviewFactory.getinterviews = function() {
        return $http.get('/api/getinterviews')
    }

    //Interview.create(newInterview)
    interviewFactory.create = function(id) {
        return $http.post('/api/interview', id).then(function(response) {
            console.log("Data saved status:", response.data.success);
        })
    }

    //Interview.update(updateInterview)
    // interviewFactory.update = function(id) {
    //     return $http.put('/api/getinterviews', id).then(function(response) {
    //         console.log('Data updated status:', response.data.success)
    //     })
    // }

    // interviewFactory.delete = function(id) {
    //     return $http.delete('/api/interviews/', id).then(function(response) {
    //         console.log('Data delete status:', response.data.success)
    //     })
    // }

    // interviewFactory.getinterview = function() {
    //     return $http.get('/api/getinterview')
    // }
    return interviewFactory;
})