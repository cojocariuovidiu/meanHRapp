angular.module('employeeServices', [])

.factory('Employee', function($http) {
    employeeFactory = {};

    //Employee.getEmployees()
    employeeFactory.getEmployees = function(username) {
        return $http.post('/api/getemployees', {username: username})
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

    //Employee.editEmployee(id, newEmployee, currentCI)
    employeeFactory.editEmployee = function(id, newEmployee, currentCI) {
        console.log(id, newEmployee, currentCI)

        return $http.put('/api/editEmployee/' + id, {
            updateData: newEmployee,
            ci: currentCI
        })
    }

    //Employee.delete(editedObject._id)
    employeeFactory.delete = function(id) {
        return $http.delete('/api/employees/' + id)
    }

    //Employee.getEmployeesByDepartment(option)
    employeeFactory.getEmployeesByDepartment = function(username, option) {
        return $http.post('/api/getEmployeesByDepartment', {
            username: username,
            option: option
        })
    }

    //Employee.RangeFilter(fromDate, toDate)
    employeeFactory.RangeFilter = function(fromDate, toDate) {
        return $http.post('/api/getEmployeesRangeFilter', {
            from: fromDate,
            to: toDate
        })
    }

    return employeeFactory;
})