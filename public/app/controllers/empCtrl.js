'use strict'

angular.module("employeeControllers", [])

.controller("empCtrl", function(shareData, Employee, $mdDialog, $scope, $http) {
    var emp = this
    var displayingObject = {}

    Employee.getEmployees().then((response) => {
        console.log(response.data)
        emp.employeessList = response.data
    })

    //Loading the Modal
    emp.editEmployee = function(id) {
        if (id) {
            console.log('editing', id)

            $http.get('/api/getEmployee/' + id).then(function(response) {
                emp.editedObject = response.data.item
                $mdDialog.show({
                        controller: DialogController,
                        templateUrl: 'app/views/dialogs/editEmployee.html',
                        locals: {
                            editedObject: emp.editedObject
                        },
                        parent: angular.element(document.body),
                        //targetEvent: ev,
                        clickOutsideToClose: false,
                        fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
                    })
                    // .then(function(answer) {
                    //     $scope.status = 'You said the information was "' + answer + '".';
                    // }, function() {
                    //     $scope.status = 'You cancelled the dialog.';
                    // });
            })
        } else {
            console.log('new employee')
            emp.editedObject = {}
            $mdDialog.show({
                controller: DialogController,
                templateUrl: 'app/views/dialogs/editEmployee.html',
                locals: {
                    editedObject: emp.editedObject
                },
                parent: angular.element(document.body),
                //targetEvent: ev,
                clickOutsideToClose: false,
                fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            })
        }
    }

    function DialogController($scope, $mdDialog, editedObject) {

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

        $scope.editedObject = editedObject
        $scope.newEmployee = angular.copy($scope.editedObject)

        $scope.submitEmployee = ((newEmployee) => {

            function isEmpty(obj) {
                return Object.keys(obj).length === 0;
            }

            if (isEmpty(editedObject)) {
                console.log('new Emp:')
                Employee.create({
                    newEmployee: newEmployee,
                    username: shareData.loggedUser
                }).then(function() {
                    checkDisplaying()
                    $mdDialog.hide();
                })
            } else {
                //Update Employee
                $http.put('/api/editEmployee/' + editedObject._id, {
                    updateData: newEmployee,
                    // editedBy: int.username,
                    editedBy: shareData.loggedUser
                        // interviewStatus: $scope.interviewStatus,
                        // buletin: $scope.buletin
                }).then(function(response) {
                    console.log('Data updated status:', newEmployee)
                }).then(function(response) {
                    checkDisplaying()
                    $mdDialog.hide();
                })
            }
        })
    }

    function checkDisplaying() {
        getEmployeesFiltered('All')
    }

    function getEmployeesFiltered(option) {
        if (option == 'All') {
            Employee.getEmployees().then(function(response) {
                console.log(response.data)
                emp.employeessList = response.data
                displayingObject = {
                    activator: 'All'
                }
                $scope.displaying = displayingObject.message
            })
            console.log('promisse all')
            console.log('Displaying', option)
        }
    }
})