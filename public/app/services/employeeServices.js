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

    // employeeFactory.edit = ((id) => {
    //     $http.get('/editEmployee/' + id)
    // })

    return employeeFactory;
})