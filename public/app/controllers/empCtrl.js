'use strict'

angular.module("employeeControllers", ["chart.js"])

.config(function($mdThemingProvider, $mdDateLocaleProvider) {
    $mdThemingProvider.theme('dark-grey').backgroundPalette('grey').dark();
    $mdThemingProvider.theme('dark-orange').backgroundPalette('orange').dark();
    $mdThemingProvider.theme('dark-purple').backgroundPalette('deep-purple').dark();
    $mdThemingProvider.theme('dark-blue').backgroundPalette('blue').dark();

    $mdDateLocaleProvider.firstDayOfWeek = 1;
})

.controller("empCtrl", function($mdToast, $timeout, uploadFile, shareData, Employee, $mdDialog, $scope, $http) {
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

        $scope.departments = ['Maran BO', 'Triboo', 'Aria']
        $scope.sessi = ['F', 'M']
        $scope.statusList = ['Lavora a Bitech', 'Non lavora più a Bitech']

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
        if ($scope.newEmployee.leavingDate) {
            $scope.newEmployee.leavingDate = new Date($scope.newEmployee.leavingDate)
                //console.log($scope.newEmployee.dataapplicazione)
        }

        $scope.submitEmployee = ((newEmployee) => {
            function isEmpty(obj) {
                return Object.keys(obj).length === 0
            }
            if (isEmpty(editedObject)) {
                // console.log('new Emp:', newEmployee, shareData.loggedUser)
                Employee.create({
                    newEmployee: newEmployee,
                    username: shareData.loggedUser
                }).then(function() {
                    checkDisplaying()
                    $mdDialog.hide();
                })
            } else {
                let currentCI = ((!$scope.ci) ? newEmployee.ci : $scope.ci);
                //Update Employee
                $http.put('/api/editEmployee/' + editedObject._id, {
                    updateData: newEmployee,
                    editedBy: shareData.loggedUser,
                    ci: currentCI
                        // interviewStatus: $scope.interviewStatus,
                        // buletin: $scope.buletin
                }).then(function(response) {
                    // console.log('Data updated status:', newEmployee)
                }).then(function(response) {
                    checkDisplaying()
                    $mdDialog.hide();
                })
            }
            showToast('Dipendente salvato con successo !')
            console.log('Dipendente salvato con successo !')
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
                    // console.log('Dialog Canceled')
                },
                function() {
                    $http.delete('/api/employees/' + editedObject._id).then(function(response) {
                        //console.log(response.data.success, response.data.message)
                        checkDisplaying()
                    })
                });
        }

        $scope.file = {}
        $scope.uploadCIEnabled = true
        $scope.SubmitUpload = function() {
            $scope.uploadCIEnabled = false
                // $scope.uploading = true
                // console.log($scope.file.upload.name)
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
                    $scope.limitOptions = [5, 10, 30, {
                        label: 'All',
                        value: function() {
                            return emp.employeessList.length;
                        }
                    }];
                })
            }, 200)
            console.log('Displaying', option)
        } else if (option == 'Maran BO') {
            FilterByDepartment('Maran BO')
        } else if (option == 'Triboo') {
            FilterByDepartment('Triboo')
        } else if (option == 'Aria') {
            FilterByDepartment('Aria')
        } else {
            console.log('something wrong on getEmployeesFiltered')
        }
    }

    //executed on filter with option
    function FilterByDepartment(option) {
        $scope.promise = $timeout(function() {
            $http.post('/api/getEmployeesByDepartment', { option: option }).then(function(response) {
                // console.log(response.data)

                emp.employeessList = response.data
                displayingObject = {
                    activator: option
                }
            })
        }, 200)
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

    //Call Chart Modal
    $scope.empChartModal = function() {
        $mdDialog.show({
            controller: ChartDialogController,
            templateUrl: 'app/views/pages/employees/empChart.html',
            // locals: {
            //     editedObject: editedObject
            // },
            parent: angular.element(document.body),
            //targetEvent: ev,
            clickOutsideToClose: true,
            fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        })
    }

    //Controller for Intervirews Chart
    function ChartDialogController($scope, $mdDialog) {
        $scope.dougChart = {};
        $scope.dougChart.labels = ['Maran BO', 'Triboo', 'Aria', 'No Dpt']
        $scope.dougChart.series = ['Dipendenti']
            // $scope.dougChart.colors = ["#F7464A", "#97BBCD", "#000000"]

        $scope.dougChart.options = {
            responsive: false,
            maintainAspectRatio: true,
            legend: { display: true }
        }
        $scope.dougChart.data = []
        $scope.dougChart.Employees = []

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        //Button/OnLoad function
        $scope.loadChartData = function() {

            $scope.dougChart.data = []
            $scope.dougChart.Employees = []

            var totals = [0, 0, 0, 0]

            //Load all data from the DB
            Employee.getEmployees().then(function(response) {

                for (var i = 0; i < response.data.length; i++) {
                    if (response.data[i].department == $scope.dougChart.labels[0]) { //Maran
                        totals[0]++
                    } else if (response.data[i].department === $scope.dougChart.labels[1]) { //Triboo
                        totals[1]++
                    } else if (response.data[i].department === $scope.dougChart.labels[2]) { //Aria
                        totals[2]++
                    } else {
                        totals[3]++
                    }
                }
                console.log(totals)
                $scope.dougChart.data = totals
            })
        }

        $scope.loadChartData()

        $scope.$on('chart-destroy', function(evt, chart) {
            // console.log('destroy');
        });
        $scope.$on('chart-update', function(evt, chart) {
            console.log('update');
        });
    }

    //Controler for SortModal
    function SortDialogController($scope, $mdDialog) {
        $scope.RangeFilter = function(fromDate, toDate) {
            RangeFilter(fromDate, toDate)
            $mdDialog.hide()
        }
        $scope.getAll = function() {
            getEmployeesFiltered('All')
            $mdDialog.hide()
        }
        $scope.getDepartment = function(option) {
            // console.log(option)
            getEmployeesFiltered(option)
            $mdDialog.hide()
        }
        $scope.cancel = function() {
            $mdDialog.cancel()
        }
    }

    function RangeFilter(fromDate, toDate) {
        if (fromDate == undefined || fromDate == null || toDate == undefined || toDate == null) {
            showToast('Selezionare Da - A periodo')
        } else {
            var momentFrom = moment(fromDate).format('MMM/D/YYYY')
            var momentTo = moment(toDate).format('MMM/D/YYYY')
                // console.log('momentfrom', momentFrom)
                // console.log('momentto', momentTo)

            $scope.fromDate = fromDate
            $scope.toDate = toDate

            $scope.promise = $timeout(function() {
                $http.post('/api/getEmployeesRangeFilter', { from: fromDate, to: toDate }).then(function(response) {
                    // console.log(response.data)

                    emp.employeessList = response.data
                    displayingObject = {
                        activator: 'Range'
                    }
                }, this)
            }, 200);
        }
    }

    //MD TABLE ///
    $scope.sort = {
        //defaults
        order: '-employmentdate',
        limit: '10',
        page: 1
    };

    function success(employees) {
        $scope.employeessList = employees;
    }

    emp.refresh = function() {
        $scope.promise = $timeout(function() {
            checkDisplaying()
        }, 200);
    }

    var showToast = function(message) {
        $mdToast.show(
            $mdToast.simple()
            .action('OK')
            .textContent(message)
            .hideDelay(2000)
            .highlightAction(true)
            .capsule(true)
            .position('top right')
            // .theme(string)
        );
        // $mdToast.show(
        //     $mdToast.simple()
        //     .textContent('Error!')
        //     .highlightAction(true)
        //     .parent(document.querySelectorAll('#toaster'))
        //     .position('bottom right')
        //     .hideDelay(3000)
        //     .action('OK')
        //     //.action('x')
        // );
    }
})