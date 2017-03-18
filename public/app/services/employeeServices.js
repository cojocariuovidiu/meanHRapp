angular.module('employeeServices', [])

.factory('Employee', function($http) {
    employeeFactory = {};

    //Employee.getEmployees()
    employeeFactory.getEmployees = function() {
        return $http.get('/api/getemployees')
    }

    //Employee.create
    employeeFactory.create = ((newEmployee) => {
        return $http.post('/api/employee', newEmployee)
            .then((response) => {
                console.log('Employee created', response.data.success)
            })
    })

    //Employee.getWorkingEmployees()
    employeeFactory.getWorkingEmployees = function() {
        return $http.get('/api/getWorkingEmployees')
    }

    employeeFactory.getEmployee = function(id) {
        return $http.post('/api/getEmployee/', { id: id })
    }

    return employeeFactory;
})