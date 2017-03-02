'use strict'

angular.module("employeeControllers", [])

.controller("empCtrl", function(Employee) {
    var emp = this

    Employee.getEmployees().then(function(response) {
        console.log(response.data)
        emp.employeessList = response.data
    })

})