'use strict'

angular.module("interviewControllers", ['md.data.table'])

.controller("intCtrl", function(shareData, $mdToast, uploadFile, $mdSidenav, $mdDialog, Interview, $scope, $http, $timeout, $location, $rootScope, $window, $interval) {
    console.log('intCtrl ok')

    var int = this
    var displayingObject = {}

    getInterviewsFiltered('All')

    $scope.sortType = 'dataapplicazione'; // set the default sort type
    $scope.sortReverse = false; // set the default sort order

    $scope.editInterview = function(id) {
        if (id) {
            $http.get('/api/getinterview/' + id).then(function(response) {

                console.log(response.data.item)

                int.editedObject = response.data.item

                console.log(int.editedObject)

                $mdDialog.show({
                        controller: DialogController,
                        templateUrl: 'app/views/dialogs/editInterview.html',
                        locals: {
                            editedObject: int.editedObject
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
            int.editedObject = {}
            $mdDialog.show({
                controller: DialogController,
                templateUrl: 'app/views/dialogs/editInterview.html',
                locals: {
                    editedObject: int.editedObject
                },
                parent: angular.element(document.body),
                //targetEvent: ev,
                clickOutsideToClose: false,
                fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            })
        }
    }

    function DialogController($scope, $mdDialog, editedObject) {
        $scope.sessi = ['M', 'F']

        $scope.esitocolloqui = [
            'assunto',
            'scartato',
            'rifiuta',
            'attendo risposta',
            'da rivedere',
            'irreperibile',
            'non interessato'
        ]

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

        //to get the edited data in input boxes
        $scope.editedObject = editedObject
        $scope.newInterview = angular.copy($scope.editedObject)

        if ($scope.newInterview.dataapplicazione) {
            $scope.newInterview.dataapplicazione = new Date($scope.newInterview.dataapplicazione)
                //console.log($scope.newInterview.dataapplicazione)
        }

        $scope.submitInterview = function(newInterview) {
            function isEmpty(obj) {
                return Object.keys(obj).length === 0;
            }

            if (isEmpty(editedObject)) {
                //console.log('new interview:', newInterview, app.username)

                console.log('new int:', newInterview)

                //CREATE Interview
                Interview.create({
                    newInterview: newInterview,
                    interviewStatus: $scope.interviewStatus,
                    // username: int.username
                    username: shareData.loggedUser
                }).then(function() {
                    checkDisplaying()
                    $mdDialog.hide();
                })
            } else {
                console.log('edited:', newInterview)

                let currentCV = ((!$scope.cv) ? newInterview.cv : $scope.cv);
                let currentCI = ((!$scope.ci) ? newInterview.ci : $scope.ci);

                $http.put('/api/editinterview/' + editedObject._id, {
                    updateData: newInterview,
                    // editedBy: int.username,
                    editedBy: shareData.loggedUser,
                    interviewStatus: $scope.interviewStatus,
                    cv: currentCV,
                    ci: currentCI
                }).then(function(response) {
                    console.log('Data updated status:', newInterview)
                }).then(function(response) {
                    checkDisplaying()
                    $mdDialog.hide();
                })
            }
            showToast('Intervista salvato con successo !')
        }

        //Upload File Code:
        $scope.file = {}
        $scope.uploadCVEnabled = true
        $scope.uploadCIEnabled = true
        console.log('enabling buttons', $scope.uploadButtonsAreEnabled)

        $scope.SubmitUploadCV = function() {
            $scope.uploadCVEnabled = false
                // $scope.uploading = true
            console.log('enabling buttons', $scope.uploadButtonsAreEnabled)
            uploadFile.uploadCV($scope.file).then(function(data) {
                if (data.data.success) {
                    // $scope.uploading = false
                    $scope.alert = 'alert alert-success'
                    $scope.message = data.data.message
                        // $scope.file = {}
                    $scope.cv = data.data.cv
                } else {
                    // $scope.uploading = false
                    $scope.alert = 'alert alert-danger'
                    $scope.message = data.data.message;
                    $scope.file = {}
                }
            })
        }
        $scope.SubmitUploadCI = function() {
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
                    $http.delete('/api/interviews/' + editedObject._id).then(function(response) {
                        //console.log(response.data.success, response.data.message)
                        checkDisplaying()
                    })
                });
        };

        // $scope.isEmployee = editedObject.employee
        // console.log($scope.isEmployee)

        // $scope.AddRemoveEmployee = function() {
        //     console.log('before add/remove: ', $scope.isEmployee)
        //     if ($scope.isEmployee) {
        //         $scope.isEmployee = false
        //     } else {
        //         $scope.isEmployee = true
        //     }
        //     console.log('after click:', $scope.isEmployee)
        // }

        // $scope.status = editedObject.status
        // console.log($scope.status)

        $scope.interviewStatus = editedObject.interviewStatus
        $scope.SetStatus = function(option) {
            if (option == 'isEmployee') {
                status = 'isEmployee'
            } else if (option == 'callLater') {
                status = 'callLater'
            } else if (option == 'clear') {
                status = 'clear'
            }
            return $scope.interviewStatus = status
        }
    }

    //Call Sort Modal
    $scope.sortModal = function() {
        $mdDialog.show({
            controller: SortDialogController,
            templateUrl: 'app/views/dialogs/sortInterviews.html',
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
    $scope.intChartModal = function() {
        $mdDialog.show({
            controller: ChartDialogController,
            templateUrl: 'app/views/pages/interviews/intChart.html',
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
        };

        $scope.getAll = function() {
            getInterviewsFiltered('All')
            $mdDialog.hide();
        };
        $scope.getEmployees = function() {
            getInterviewsFiltered('isEmployee')
            $mdDialog.hide();
        };
        $scope.getCallLater = function() {
            getInterviewsFiltered('callLater')
            $mdDialog.hide();
        };
        $scope.cancel = function() {
            $mdDialog.cancel();
        };
    }

    //Controller for Intervirews Chart
    function ChartDialogController($scope, $mdDialog) {
        $scope.barChart = {};
        $scope.barChart.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        $scope.barChart.series = ['Interviste', 'Dipendenti']
        $scope.barChart.options = {
            responsive: false,
            maintainAspectRatio: true,
            legend: { display: true }
        }
        $scope.barChart.data = []
        $scope.barChart.Interviews = []
        $scope.barChart.Employees = []

        //Button/OnLoad function
        $scope.loadChartData = function(option) {
            $scope.selectedChartOrder = option
            $scope.selectedYear = $scope.selectedChartOrder
            console.log($scope.selectedYear)
            $scope.barChart.data = []
            $scope.barChart.Interviews = []
            $scope.barChart.Employees = []

            if (option == 2017) {
                ChartFilterYear(option)
            } else if (option == 2016) {
                ChartFilterYear(option)
            } else {
                console.log('chart year != 2016 or 2017')
            }
        }

        //Load 2017 on start
        $scope.selectedChartOrder = (2017)
        $scope.loadChartData($scope.selectedChartOrder)

        //Filter function used for each year
        function ChartFilterYear(option) {
            //Declare and reset values on function call
            var janTotal = 0,
                febTotal = 0,
                marTotal = 0,
                aprTotal = 0,
                mayTotal = 0,
                junTotal = 0,
                julTotal = 0,
                augTotal = 0,
                sepTotal = 0,
                octTotal = 0,
                novTotal = 0,
                decTotal = 0,
                janEmp = 0,
                febEmp = 0,
                marEmp = 0,
                aprEmp = 0,
                mayEmp = 0,
                junEmp = 0,
                julEmp = 0,
                augEmp = 0,
                sepEmp = 0,
                octEmp = 0,
                novEmp = 0,
                decEmp = 0

            //Load all data from the DB
            Interview.getinterviews().then(function(response) {
                response.data.forEach(function(element) {
                    var interviewStatus = element.interviewStatus
                    var momenYear = moment(element.dataapplicazione).format('YYYY')

                    if (momenYear == option) {
                        var momentDate = moment(element.dataapplicazione).format('M')
                        if (momentDate == 1) {
                            janTotal++
                            if (element.interviewStatus == 'isEmployee') {
                                janEmp++
                            }
                        } else
                        if (momentDate == 2) {
                            febTotal++
                            if (element.interviewStatus == 'isEmployee') {
                                febEmp++
                            }
                        } else
                        if (momentDate == 3) {
                            marTotal++
                            if (element.interviewStatus == 'isEmployee') {
                                marEmp++
                            }
                        } else
                        if (momentDate == 4) {
                            aprTotal++
                            if (element.interviewStatus == 'isEmployee') {
                                aprEmp++
                            }
                        } else
                        if (momentDate == 5) {
                            mayTotal++
                            if (element.interviewStatus == 'isEmployee') {
                                mayEmp++
                            }
                        } else
                        if (momentDate == 6) {
                            junTotal++
                            if (element.interviewStatus == 'isEmployee') {
                                junEmp++
                            }
                        } else
                        if (momentDate == 7) {
                            julTotal++
                            if (element.interviewStatus == 'isEmployee') {
                                julEmp++
                            }
                        } else
                        if (momentDate == 8) {
                            augTotal++
                            if (element.interviewStatus == 'isEmployee') {
                                augEmp++
                            }
                        } else
                        if (momentDate == 9) {
                            sepTotal++
                            if (element.interviewStatus == 'isEmployee') {
                                sepEmp++
                            }
                        } else
                        if (momentDate == 10) {
                            octTotal++
                            if (element.interviewStatus == 'isEmployee') {
                                octEmp++
                            }
                        } else
                        if (momentDate == 11) {
                            novTotal++
                            if (element.interviewStatus == 'isEmployee') {
                                novEmp++
                            }
                        } else
                        if (momentDate == 12) {
                            decTotal++
                            if (element.interviewStatus == 'isEmployee') {
                                decEmp++
                            }
                        }
                    } else {
                        //console.log(momenYear)
                    }
                }, this);

                $scope.barChart.Interviews.push(janTotal, febTotal, marTotal, aprTotal, mayTotal, junTotal, julTotal, augTotal, sepTotal, octTotal, novTotal, decTotal)
                $scope.barChart.Employees.push(janEmp, febEmp, marEmp, aprEmp, mayEmp, junEmp, julEmp, augEmp, sepEmp, octEmp, novEmp, decEmp)

                $scope.barChart.data.push($scope.barChart.Interviews)
                $scope.barChart.data.push($scope.barChart.Employees)

                // console.log(chart.barChart.data)
            })
        }

        $scope.$on('chart-destroy', function(evt, chart) {
            // console.log('destroy');
        });
        $scope.$on('chart-update', function(evt, chart) {
            console.log('update');
        });
    }

    function getInterviewsFiltered(option) {
        if (option == 'All') {
            // app.loadAll = true
            $scope.promise = $timeout(function() {
                Interview.getinterviews().then(function(response) {
                    int.interviewsList = response.data
                    displayingObject = {
                        message: option + ' (Totale: ' + int.interviewsList.length + ' )',
                        activator: 'All'
                    }
                    $scope.displaying = displayingObject.message
                    $scope.limitOptions = [5, 10, 30, {
                        label: 'All',
                        value: function() {
                            return int.interviewsList.length;
                        }
                    }];
                })
                console.log('promisse all')
            }, 400);
            console.log('Displaying', option)
        } else if (option == 'isEmployee') {
            FilterByStatus('isEmployee')
        } else if (option == 'callLater') {
            FilterByStatus('callLater')
        } else {
            console.log('something wrong on getInterviewsFiltered')
        }
    }
    //executed on filter with option
    function FilterByStatus(option) {
        $scope.promise = $timeout(function() {
            $http.post('/api/getInterviewsByStatus', { option: option }).then(function(response) {
                int.interviewsList = response.data
                displayingObject = {
                    activator: option
                }
            })
        }, 400)
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
                $http.post('/api/getInterviewsRangeFilter', { from: fromDate, to: toDate }).then(function(response) {
                    int.interviewsList = response.data
                    displayingObject = {
                        activator: 'Range'
                    }
                }, this)
                console.log('promisse range')
            }, 400);
        }
    }

    //MD TABLE ///
    $scope.sort = {
        //defaults
        order: '-dataapplicazione',
        limit: '10',
        page: 1
    };



    function success(interviews) {
        $scope.interviewsList = interviews;
    }

    // $scope.promiseThReorder = function() {
    //     $scope.promise = $timeout(function() {
    //         console.log('promisse reorder')
    //     }, 500);
    // };

    $scope.refresh = function() {
        checkDisplaying()
        $scope.promise = $timeout(function() {
            console.log('refreshing data')
        }, 400);
    }

    function checkDisplaying() {
        if (displayingObject.activator == 'All') {
            getInterviewsFiltered('All')
        } else if (displayingObject.activator == 'Range') {
            RangeFilter($scope.fromDate, $scope.toDate)
        } else {
            FilterByStatus(displayingObject.activator)
        }
    }

    /////////////////////////MENU
    $scope.toggleLeft = buildToggler('left');

    function buildToggler(componentId) {
        return function() {
            $mdSidenav(componentId).toggle();
            // showToast()
        };
    }
    $scope.menu = [{
            link: '/',
            title: 'Home',
            icon: 'dashboard'
        },
        {
            link: '/employees',
            title: 'Dipendenti',
            icon: 'message'
        },
        {
            link: '/interviews',
            title: 'Interviste',
            icon: 'message'
        },
        {
            link: '/statistics',
            title: 'Statistiche',
            icon: 'message'
        },
        {
            link: '/interviews2',
            title: 'Test',
            icon: 'message'
        },
    ];
    $scope.admin = [{
            link: '',
            title: 'Log Out',
            icon: 'delete',
        },
        {
            link: '/profile',
            title: 'Profilo',
            icon: 'settings'
        }
    ];

    var showToast = function(message) {
        $mdToast.show(
            $mdToast.simple()
            .action('OK')
            .textContent(message)
            .hideDelay(4000)
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
        //     .hideDelay(4000)
        //     .action('OK')
        //     //.action('x')
        // );
    }

});