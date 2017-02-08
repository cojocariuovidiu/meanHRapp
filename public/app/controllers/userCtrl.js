angular.module('userControllers', ['userServices'])

.controller('regCtrl', function($http, $location, $timeout, User) {

    var app = this;

    this.regUser = function(regData) {
        app.successMsg = false;
        app.errorMsg = false;
        app.isLoading = true;

        User.create(app.regData).then(function(data) {
            console.log(data.data.success, data.data.message);
            if (data.data.success) {
                //Create Success message
                app.successMsg = data.data.message + '...Redirecting';
                $timeout(function() {
                    //Redirect To HomePage
                    $location.path('/')
                    app.isLoading = false
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
})