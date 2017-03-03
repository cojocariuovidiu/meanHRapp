'use strict'

angular.module("employeeControllers", [])

.controller("empCtrl", function(Employee, $mdDialog, $scope) {
    var emp = this

    Employee.getEmployees().then((response) => {
        console.log(response.data)
        emp.employeessList = response.data
    })

    //Loading the Modal
    emp.editEmployee = function(id) {
        console.log('editing')
        $mdDialog.show({
            controller: DialogController,
            templateUrl: 'app/views/dialogs/editEmployee.html',
            // locals: {
            //     editedObject: emp.editedObject
            // },
            parent: angular.element(document.body),
            //targetEvent: ev,
            clickOutsideToClose: false,
            fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        })

    }

    function DialogController($scope, $mdDialog) {

        $scope.hide = function() {
            $mdDialog.hide();
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.save = function(data) {
            $mdDialog.hide(data);
            //console.log(data);
        };

        $scope.submitEmployee = ((newEmployee) => {
            Employee.create({ newEmployee: newEmployee })
        })
    }



})