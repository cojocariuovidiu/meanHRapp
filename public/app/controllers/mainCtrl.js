angular.module('mainController', ['authServices', 'userServices', 'interviewServices', 'ngMaterial'])

.controller('mainCtrl', function($mdDialog, Interview, Auth, $scope, $http, $timeout, $location, $rootScope, $window, $interval, $route, User, AuthToken) { //Auth from authServices
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

    var showModal = function(option) {
        app.choiceMade = false;
        app.modalHeader = undefined;
        app.modalBody = undefined;
        app.hideButton = false;

        if (option === 1) {
            app.modalHeader = 'Edit Interview'
            app.modalBody = 'editing stuff'
            $('#myModal').modal({ backdrop: "static" }) //can't click on background

        } else if (option === 2) {
            //logout portion
            app.hideButton = true;
            app.modalHeader = 'Logging Out';
            $('#myModal').modal({ backdrop: "static" }) //can't click on background
            $timeout(function() {
                Auth.logout();
                $location.path('/login');
                hideModal();
                $route.reload();
            }, 2000);
        }
    }

    app.renewSession = function() {

        app.choiceMade = true;

        User.renewSession(app.username).then(function(data) {
            if (data.data.success) {
                AuthToken.setToken(data.data.token); //reset the token
                app.checkSession()
            } else {
                app.modalBody = data.data.message;
            }
        });

        hideModal();
        console.log('session has been renewed');
    }

    app.endSession = function() {
        app.choiceMade = false;
        hideModal();
        $timeout(function() {
                showModal(2)
            }, 1000) //1000 timeout between popop modals
    }

    var hideModal = function() {
        $('#myModal').modal('hide');
    }

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
                }, 2000)

            } else {
                //Create error message
                app.errorMsg = data.data.message;
                $timeout(function() {
                    app.isLoading = false
                }, 2000)
            }
        })
    }

    this.logout = function() {
        showModal(2)
    }

    ////////////////////InterviewController
    //on load get data from db
    Interview.getinterviews().then(function(response) {
        app.interviewsList = response.data
            //console.log(app.interviewsList);
    })

    //submit new Interview
    this.submitInterview = function(obj) {
        // console.log(app.newInterview);
        Interview.create({ newInterview: app.newInterview, username: app.username })
    }

    //highlight cliecked row using ng-class="{selected : item._id === idSelectedRow._id}"
    $scope.idSelectedRow = null;
    $scope.clickedItem = function(item) {
        $scope.idSelectedRow = item;
    }

    //sorting defaults
    $scope.sortType = 'dataapplicazione'; // set the default sort type
    $scope.sortReverse = false; // set the default sort order

    $scope.edit = function(id) {
        console.log(id);
        $http.post('/api/getinterview', { id: id }).then(function(response) {

            // $location.path('/tabella/edit');
            $scope.editedUser = response.data;
            app.editedUser = response.data
            showModal(1)
        })
    }

    $scope.showDialog = function() {
        // $mdDialog.show({
        //         controller: DialogController,
        //         templateUrl: 'dialog1.tmpl.html',
        //         parent: angular.element(document.body),
        //         //targetEvent: ev,
        //         clickOutsideToClose: false,
        //         fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        //     })
        //     .then(function(answer) {
        //         $scope.status = 'You said the information was "' + answer + '".';
        //     }, function() {
        //         $scope.status = 'You cancelled the dialog.';
        //     });

        $mdDialog.show(
            $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(true)
            .title('This is an alert title')
            .textContent('You can specify some description text in here.')
            .ariaLabel('Alert Dialog Demo')
            .ok('Got it!')
            //.targetEvent(ev)
        );
    }
})