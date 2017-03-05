'use strict'

angular.module("employeeControllers", [])

.controller("empCtrl", function(shareData, Employee, $mdDialog, $scope, $http) {
    var emp = this

    Employee.getEmployees().then((response) => {
        console.log(response.data)
        emp.employeessList = response.data
    })

    //Loading the Modal
    emp.editEmployee = function(id) {
        if (id) {
            console.log('editing', id)

            // Employee.edit(id).then(function(response) {
            //     console.log(response)
            // })

            $http.get('/api/getEmployee/' + id).then(function(response) {
                emp.editedObject = response.data.item
                console.log(emp.editedObject)
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
                //console.log('new interview:', newInterview, app.username)

                console.log(newEmployee)

                //CREATE Interview
                Employee.create({
                    new: newEmployee,
                    // interviewStatus: $scope.interviewStatus,
                    // username: int.username
                    username: shareData.loggedUser
                }).then(function() {
                    // checkDisplaying()
                    $mdDialog.hide();
                })
            } else {
                //Update Interview
                console.log('editing', editedObject._id)
                $http.put('/api/editinterview/' + editedObject._id, {
                    updateData: newEmployee,
                    // editedBy: int.username,
                    editedBy: shareData.loggedUser,
                    // interviewStatus: $scope.interviewStatus,
                    cv: $scope.cv
                }).then(function(response) {
                    console.log('Data updated status:', newInterview)
                }).then(function(response) {
                    checkDisplaying()
                    $mdDialog.hide();
                })
            }
        })
    }
})