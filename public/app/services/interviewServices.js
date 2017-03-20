angular.module('interviewServices', [])

.factory('Interview', function($http) {
    interviewFactory = {};

    //Interview.getinterviews()
    interviewFactory.getinterviews = function() {
        return $http.get('/api/getinterviews')
    }

    //Interview.getinterview(id)
    interviewFactory.getClickedInterview = function(id) {
        return $http.get('/api/getClickedInterview/' + id)
    }

    //Interview.create(newInterview)
    interviewFactory.create = function(interview) {
        console.log('id from int service:', interview)
        return $http.post('/api/interview', interview)
            .then(function(response) {
                console.log("Data saved status:", response.data.success);
            })
    }

    //Interview.editInterview(id, newInterview, currentCV, currentCI)
    interviewFactory.editInterview = function(id, newInterview, currentCV, currentCI) {
        return $http.put('/api/editInterview/' + id, {
            updateData: newInterview,
            cv: currentCV,
            ci: currentCI
        })
    }

    //Interview.delete(id)
    interviewFactory.delete = function(id) {
        return $http.delete('/api/interviews/' + id)
    }

    //Interview.getInterviewsByStatus(option)
    interviewFactory.getInterviewsByStatus = function(option) {
        return $http.post('/api/getInterviewsByStatus', { option: option })
    }

    return interviewFactory;
})