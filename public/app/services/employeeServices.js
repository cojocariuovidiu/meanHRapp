angular.module('employeeServices', [])

.factory('Employee', function($http) {
    employeeFactory = {};

    ////Interview.getinterviews()
    employeeFactory.getEmployees = function() {
        return $http.get('/api/getemployees')
    }

    return employeeFactory;
})