'use strict'

angular.module("employeeControllers", [])

.controller("empCtrl", function($timeout, uploadFile, shareData, Employee, $mdDialog, $scope, $http) {
    var emp = this
    var displayingObject = {}

    getEmployeesFiltered('All')

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

        $scope.departments = ['Maran', 'Trbioo']
        $scope.sessi = ['F', 'M']

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

        if ($scope.newEmployee.employmentdate) {
            $scope.newEmployee.employmentdate = new Date($scope.newEmployee.employmentdate)
                //console.log($scope.newEmployee.dataapplicazione)
        }

        $scope.submitEmployee = ((newEmployee) => {
            function isEmpty(obj) {
                return Object.keys(obj).length === 0;
            }
            if (isEmpty(editedObject)) {
                console.log('new Emp:', newEmployee, shareData.loggedUser)
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
                    editedBy: shareData.loggedUser,
                    ci: $scope.ci
                        // interviewStatus: $scope.interviewStatus,
                        // buletin: $scope.buletin
                }).then(function(response) {
                    // console.log('Data updated status:', newEmployee)
                }).then(function(response) {
                    checkDisplaying()
                    $mdDialog.hide();
                })
            }
        })

        $scope.showConfirm = function() {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .title('Sei sicuro di voler eliminare?')
                //.textContent('All of the banks have agreed to forgive you your debts.')
                .ariaLabel('Danger')
                //.targetEvent(ev)
                .ok('No')
                .cancel('Si');

            $mdDialog.show(confirm).then(
                function() {
                    console.log('Dialog Canceled')
                },
                function() {
                    $http.delete('/api/employees/' + editedObject._id).then(function(response) {
                        //console.log(response.data.success, response.data.message)
                        checkDisplaying()
                    })
                });
        }

        //Upload File Code:
        $scope.Browse = function() {
            $scope.browseClicked = true
        }
        $scope.file = {}
        $scope.SubmitUpload = function() {
            // $scope.uploading = true
            console.log($scope.file.upload.name)
            uploadFile.uploadCI($scope.file).then(function(data) {
                if (data.data.success) {
                    // $scope.uploading = false
                    $scope.alert = 'alert alert-success'
                    $scope.message = data.data.message
                        // $scope.file = {}
                    $scope.ci = data.data.ci
                } else {
                    // $scope.uploading = false
                    $scope.alert = 'alert alert-danger'
                    $scope.message = data.data.message;
                    $scope.file = {}
                }
            })
        }
    }

    function checkDisplaying() {
        if (displayingObject.activator == 'All') {
            getEmployeesFiltered('All')
        } else if (displayingObject.activator == 'Range') {
            RangeFilter($scope.fromDate, $scope.toDate)
        }
    }

    function getEmployeesFiltered(option) {
        if (option == 'All') {
            $scope.promise = $timeout(function() {

                Employee.getEmployees().then(function(response) {
                    console.log(response.data)
                    emp.employeessList = response.data
                    displayingObject = {
                        activator: 'All'
                    }
                    $scope.displaying = displayingObject.message
                })
            }, 500)
            console.log('Displaying', option)
        } else if (option == 'Triboo') {
            FilterByDepartment('Triboo')
        } else if (option == 'Maran') {
            FilterByDepartment('Maran')
        } else {
            console.log('something wrong on getEmployeesFiltered')
        }
    }

    //executed on filter with option
    function FilterByDepartment(option) {
        $scope.promise = $timeout(function() {
            $http.post('/api/getEmployeesByDepartment', { option: option }).then(function(response) {
                console.log(response.data)

                emp.interviewsList = response.data
                displayingObject = {
                    activator: option
                }
            })
        }, 500)
    }

    //Call Sort Modal
    emp.sortModal = function() {
        $mdDialog.show({
            controller: SortDialogController,
            templateUrl: 'app/views/dialogs/sortEmployees.html',
            // locals: {
            //     editedObject: editedObject
            // },
            parent: angular.element(document.body),
            //targetEvent: ev,
            clickOutsideToClose: true,
            fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        })
    }

    //Controler for SortModal
    function SortDialogController($scope, $mdDialog) {
        $scope.RangeFilter = function(fromDate, toDate) {
            RangeFilter(fromDate, toDate);
            $mdDialog.hide();
        }
        $scope.getAll = function() {
            getEmployeesFiltered('All')
            $mdDialog.hide();
        }
        $scope.getDepartment = function(option) {
            console.log(option)
            getEmployeesFiltered(option)
            $mdDialog.hide();
        }
        $scope.cancel = function() {
            $mdDialog.cancel();
        }
    }

    function RangeFilter(fromDate, toDate) {
        if (fromDate == undefined || fromDate == null || toDate == undefined || toDate == null) {
            showToast('Select From - To Period')
        } else {
            var momentFrom = moment(fromDate).format('MMM/D/YYYY')
            var momentTo = moment(toDate).format('MMM/D/YYYY')
                // console.log('momentfrom', momentFrom)
                // console.log('momentto', momentTo)

            $scope.fromDate = fromDate
            $scope.toDate = toDate

            $scope.promise = $timeout(function() {
                $http.post('/api/getEmployeesRangeFilter', { from: fromDate, to: toDate }).then(function(response) {
                    console.log(response.data)

                    emp.employeessList = response.data
                    displayingObject = {
                        activator: 'Range'
                    }
                }, this)
                console.log('promisse range')
            }, 500);
        }
    }

    //MD TABLE ///
    $scope.sort = {
        //defaults
        order: '-employmentdate',
        limit: '10',
        page: 1
    };

    $scope.limitOptions = [5, 10, 30, {
        label: 'All',
        value: function() {
            return emp.employeessList.length;
        }
    }];

    function success(employees) {
        $scope.employeessList = employees;
    }

    emp.refresh = function() {
        checkDisplaying()
        $scope.promise = $timeout(function() {
            console.log('refreshing data')
        }, 500);
    }
})