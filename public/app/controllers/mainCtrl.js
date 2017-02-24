angular.module('mainController', ['authServices', 'userServices', 'interviewServices', 'ngMaterial', 'md.data.table'])

//config
.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('docs-dark')
})

.controller('mainCtrl', function($mdToast, uploadFile, $mdSidenav, $mdDialog, Interview, Auth, $scope, $http, $timeout, $location, $rootScope, $window, $interval, $route, User, AuthToken) { //Auth from authServices
    var app = this;

    app.loadme = false;

    app.checkSession = function() {
        if (Auth.isLoggedIn()) {
            app.checkingsession = true;

            //THIS PART WITH SOME authServices part is for token expire
            // var interval = $interval(function() {
            //     //console.log('testing if login token is expired every 10 sec');
            //     var token = $window.localStorage.getItem('token')
            //     if (token === null) {
            //         $interval.cancel(interval) //cancel checking when the token is expired
            //     } else {
            //         //converts the token time to timestamp so we can compare it to localtime
            //         //so we can determine how much time is left on the token
            //         self.parseJwt = function(token) {
            //             var base64Url = token.split('.')[1];
            //             var base64 = base64Url.replace('-', '+').replace('_', '/');
            //             return JSON.parse($window.atob(base64));
            //         }
            //         var expireTime = self.parseJwt(token);
            //         var timeStamp = Math.floor(Date.now() / 1000);
            //         //console.log(expireTime.exp);
            //         //console.log(timeStamp);
            //         var timeCheck = expireTime.exp - timeStamp;
            //         console.log('timecheck', timeCheck);
            //         if (timeCheck <= 25) {
            //             console.log('token has expired');
            //             showModal(1) //option 1 
            //             $interval.cancel(interval) //cancel checking when the token is expired
            //         } else {
            //             console.log('token not yet expired');
            //         }
            //     }
            //     //console.log(token);
            // }, 2000)
        }
    }

    app.checkSession();

    // var showModal = function(option) {
    //     app.choiceMade = false;
    //     app.modalHeader = undefined;
    //     app.modalBody = undefined;
    //     app.hideButton = false;

    //     if (option === 1) {
    //         app.modalHeader = 'Edit Interview'
    //         app.modalBody = 'editing stuff'
    //         $('#myModal').modal({ backdrop: "static" }) //can't click on background

    //     } else if (option === 2) {
    //         //logout portion
    //         // $timeout(function() {
    //         Auth.logout();
    //         $location.path('/login');
    //         $route.reload();
    //         //}, 2000);
    //     }
    // }

    // app.renewSession = function() {

    //     app.choiceMade = true;

    //     User.renewSession(app.username).then(function(data) {
    //         if (data.data.success) {
    //             AuthToken.setToken(data.data.token); //reset the token
    //             app.checkSession()
    //         } else {
    //             app.modalBody = data.data.message;
    //         }
    //     });

    //     // hideModal();
    //     console.log('session has been renewed');
    // }

    // app.endSession = function() {
    //     app.choiceMade = false;
    //     // hideModal();
    //     $timeout(function() {
    //             // showModal(2)
    //         }, 1000) //1000 timeout between popop modals
    // }

    // var hideModal = function() {
    //     $('#myModal').modal('hide');
    // }



    var displayingObject = {}

    getInterviewsFiltered('All')

    //$rootScope.$on('$viewContentLoaded', function() {
    $rootScope.$on('$routeChangeStart', function() {

        if (!app.checkingsession) app.checkSession();

        //Auth in authservices
        if (Auth.isLoggedIn()) {
            //console.log('success, User is logged in ');

            app.isLoggedIn = true;

            Auth.getUser().then(function(data) {
                //to accest username from the front-end
                app.username = data.data.username
                app.useremail = data.data.email
                app.loadme = true;
            })
        } else {
            //console.log('failure, User is NOT logged in ');
            app.isLoggedIn = false;
            app.username = null;
            app.loadme = true;
        }
    })

    this.doLogin = function(loginData) {
        app.successMsg = false;
        app.errorMsg = false;
        app.isLoading = true;

        Auth.login(app.loginData).then(function(data) {
            //console.log(data.data.success, data.data.message);
            if (data.data.success) {
                //Create Success message
                app.successMsg = data.data.message + '...Redirecting';
                $timeout(function() {
                    //Redirect To HomePage
                    app.checkSession();
                    getInterviewsFiltered()
                    $location.path('/interviews')
                    app.isLoading = false
                    app.loginData = null;
                    app.successMsg = false;
                })

            } else {
                //Create error message
                app.errorMsg = data.data.message;
                $timeout(function() {
                    app.isLoading = false
                }, 500)
            }
        })
    }

    this.logout = function() {
        // showModal(2)
        buildToggler('left')
        Auth.logout();
        $location.path('/login');
        $route.reload();
    }


    //submit new Interview
    // this.submitInterview = function(obj) {
    //     // console.log(app.newInterview);
    //     Interview.create({ newInterview: app.newInterview, username: app.username })
    // }


    //sorting defaults
    $scope.sortType = 'dataapplicazione'; // set the default sort type
    $scope.sortReverse = false; // set the default sort order

    $scope.editInterview = function(id) {
        if (id) {
            $http.get('/api/getinterview/' + id).then(function(response) {
                editedObject = response.data.item

                $mdDialog.show({
                        controller: DialogController,
                        templateUrl: 'app/views/dialogs/editInterview.html',
                        locals: {
                            editedObject: editedObject
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
            editedObject = {}
            $mdDialog.show({
                controller: DialogController,
                templateUrl: 'app/views/dialogs/editInterview.html',
                locals: {
                    editedObject: editedObject
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
                Interview.create({ newInterview: newInterview, username: app.username }).then(function() {
                    checkDisplaying()
                    $mdDialog.hide();
                })
            } else {
                console.log('editing', editedObject._id)
                $http.put('/api/editinterview/' + editedObject._id, {
                    updateData: newInterview,
                    editedBy: app.username,
                    interviewStatus: $scope.interviewStatus,
                    cv: $scope.cv
                }).then(function(response) {
                    console.log('Data updated status:', newInterview)
                }).then(function(response) {
                    checkDisplaying()
                    $mdDialog.hide();
                })
            }
        }

        $scope.Browse = function() {
            $scope.browseClicked = true
        }

        //Upload File Code:
        $scope.file = {}
        $scope.SubmitUpload = function() {
            // $scope.uploading = true
            console.log($scope.file.upload.name)
            uploadFile.upload($scope.file).then(function(data) {
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

        $scope.showConfirm = function() {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .title('Are you sure you want to delete?')
                //.textContent('All of the banks have agreed to forgive you your debts.')
                .ariaLabel('Danger')
                //.targetEvent(ev)
                .ok('Cancel')
                .cancel('Ok');

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
            templateUrl: 'app/views/dialogs/sortDialog.html',
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

    function getInterviewsFiltered(option) {
        if (option == 'All') {
            // app.loadAll = true
            $scope.promise = $timeout(function() {
                Interview.getinterviews().then(function(response) {
                    app.interviewsList = response.data
                    displayingObject = {
                        message: option + ' (Total: ' + app.interviewsList.length + ' )',
                        activator: 'All'
                    }
                    $scope.displaying = displayingObject.message
                })
                console.log('promisse all')
            }, 500);
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
                app.interviewsList = response.data
                displayingObject = {
                    activator: option
                }
            })
        }, 500)
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
                $http.post('/api/getRangeFilter', { from: fromDate, to: toDate }).then(function(response) {
                    app.interviewsList = response.data
                    displayingObject = {
                        message: momentFrom + ' - ' + momentTo + ' (Total: ' + app.interviewsList.length + ' )',
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
        order: '-dataapplicazione',
        limit: '10',
        page: 1
    };

    $scope.limitOptions = [5, 10, 30, {
        label: 'All',
        value: function() {
            return app.interviewsList.length;
        }
    }];

    function success(interviews) {
        $scope.interviewsList = interviews;
    }

    // $scope.promiseThReorder = function() {
    //     $scope.promise = $timeout(function() {
    //         console.log('promisse reorder')
    //     }, 500);
    // };

    $scope.loadStuff = function() {
        checkDisplaying()
        $scope.promise = $timeout(function() {
            console.log('loading stuff')
        }, 500);
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
            link: '/interviews',
            title: 'Interviews',
            icon: 'message'
        },
        {
            link: '/agenda',
            title: 'Agenda',
            icon: 'message'
        },
        {
            link: '/statistics',
            title: 'Statistics',
            icon: 'message'
        }
    ];
    $scope.admin = [{
            link: '',
            title: 'Log Out',
            icon: 'delete',
        },
        {
            link: '/profile',
            title: 'Profile',
            icon: 'settings'
        }
    ];

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

});




// .config(function($mdThemingProvider) {
//   $mdThemingProvider.theme('default')
//     .primaryPalette('pink')
//     .accentPalette('orange');
// });