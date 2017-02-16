angular.module('mainController', ['authServices', 'userServices', 'interviewServices', 'ngMaterial', 'md.data.table'])

.controller('mainCtrl', function(uploadFile, $mdSidenav, $mdDialog, Interview, Auth, $scope, $http, $timeout, $location, $rootScope, $window, $interval, $route, User, AuthToken) { //Auth from authServices
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
                    $location.path('/')
                    app.isLoading = false
                    app.loginData = null;
                    app.successMsg = false;
                    app.checkSession();
                }, 1000)

            } else {
                //Create error message
                app.errorMsg = data.data.message;
                $timeout(function() {
                    app.isLoading = false
                }, 1000)
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

    ////////////////////InterviewController
    //on load get data from db
    Interview.getinterviews().then(function(response) {
        app.interviewsList = response.data
            //console.log(app.interviewsList);
    })

    //submit new Interview
    // this.submitInterview = function(obj) {
    //     // console.log(app.newInterview);
    //     Interview.create({ newInterview: app.newInterview, username: app.username })
    // }

    //highlight cliecked row using ng-class="{selected : item._id === idSelectedRow._id}"
    $scope.idSelectedRow = null;
    $scope.clickedItem = function(item) {
        $scope.idSelectedRow = item;
    }

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
                        clickOutsideToClose: true,
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
                clickOutsideToClose: true,
                fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            })
        }
    }

    $scope.deleteInterview = function(idArray) {


        idArray.forEach(function(element) {
            console.log('deleteing:', element._id)

            $http.delete('/api/interviews/' + element._id).then(function(response) {
                console.log(response.data.success, response.data.message)
                Interview.getinterviews().then(function(response) {
                    app.interviewsList = response.data
                        //console.log(app.interviewsList);
                })
            })
        }, this);

        $scope.selected = []
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
            console.log(data);
        };

        $scope.editedObject = editedObject
        $scope.newInterview = angular.copy($scope.editedObject)


        if ($scope.newInterview.dataapplicazione) {
            $scope.newInterview.dataapplicazione = new Date($scope.newInterview.dataapplicazione)
            console.log($scope.newInterview.dataapplicazione)
        }

        $scope.submitInterview = function(newInterview) {
            function isEmpty(obj) {
                return Object.keys(obj).length === 0;
            }

            if (isEmpty(editedObject)) {
                console.log('new interview:', newInterview, app.username)
                Interview.create({ newInterview: newInterview, username: app.username }).then(function() {
                    Interview.getinterviews().then(function(response) {
                        app.interviewsList = response.data
                    })
                    $mdDialog.hide();
                })
            } else {
                console.log('editing', editedObject._id)
                console.log('sending data:', newInterview)
                $http.put('/api/editinterview/' + editedObject._id, {
                    updateData: newInterview,
                    editedBy: app.username,
                    cv: $scope.cv
                }).then(function(response) {
                    console.log('Data updated status:', newInterview)
                }).then(function(response) {
                    Interview.getinterviews().then(function(response) {
                        app.interviewsList = response.data
                            //console.log(app.interviewsList);
                    })
                    $mdDialog.hide();
                })
            }
        }

        //Upload File Code:
        $scope.file = {}
        $scope.SubmitUpload = function() {
            $scope.uploading = true
            console.log($scope.file.upload.name)
            uploadFile.upload($scope.file).then(function(data) {
                if (data.data.success) {
                    $scope.uploading = false
                    $scope.alert = 'alert alert-success'
                    $scope.message = data.data.message
                        // $scope.file = {}
                    $scope.cv = data.data.cv
                } else {
                    $scope.uploading = false
                    $scope.alert = 'alert alert-danger'
                    $scope.message = data.data.message;
                    $scope.file = {}
                }
            })
        }

    }

    //MD TABLE ///
    $scope.selected = [];

    $scope.sort = {
        order: 'dataapplicazione',
        limit: '5',
        page: 1
    };

    $scope.limitOptions = [5, 10, 15, {
        label: 'All',
        value: function() {
            return app.interviewsList.length;
        }
    }];

    function success(interviews) {
        $scope.interviewsList = interviews;
    }

    $scope.promiseInterviews = function() {
        // console.log($scope.sort.order)
        //console.log($scope.selected)
        //$scope.promise = Interview.getinterviews($scope.sort, success).$promise;
    };


    $scope.loadStuff = function() {
        $scope.promise = $timeout(function() {
            // loading
            console.log('loading stuff')
        }, 2000);
    }



    /////////////////////////MENU
    $scope.toggleLeft = buildToggler('left');
    $scope.toggleRight = buildToggler('right');

    function buildToggler(componentId) {
        return function() {
            $mdSidenav(componentId).toggle();
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

})


//config
.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('docs-dark')
});

// .config(function($mdThemingProvider) {
//   $mdThemingProvider.theme('default')
//     .primaryPalette('pink')
//     .accentPalette('orange');
// });