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

    //Employee.getEmployee()
    employeeFactory.getEmployee = function(id) {
        return $http.post('/api/getEmployee/', { id: id })
    }

    //Employee.editEmployee
    employeeFactory.editEmployee = function(id, newEmployee, currentCI) {
        console.log(id, newEmployee, currentCI)

        return $http.put('/api/editEmployee/' + id, {
            updateData: newEmployee,
            //editedBy: editedBy,
            ci: currentCI
        })
    }

    //Employee.delete(editedObject._id)
    employeeFactory.delete = function(id) {
        return $http.delete('/api/employees/' + id)
    }

    employeeFactory.getEmployeesByDepartment = function(option) {
        return $http.post('/api/getEmployeesByDepartment', {
            option: option
        })
    }

    return employeeFactory;
})