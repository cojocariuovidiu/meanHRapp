angular.module('employeeServices', [])

.factory('Employee', function($http) {
    employeeFactory = {};

    ////Interview.getinterviews()
    employeeFactory.getEmployees = function() {
        return $http.get('/api/getemployees')
    }

    employeeFactory.create = ((newEmployee) => {
        return $http.post('/api/employee', newEmployee)
            .then((response) => {
                console.log('Employee created', response.data.success)
            })
    })

    return employeeFactory;
})