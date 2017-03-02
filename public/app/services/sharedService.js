angular.module('sharedService', [])

.service('shareData', function() {
    // this.test = function() {
    //     console.log('shared service ok')

    //     return 'ok'
    // }

    var shareData = this
    shareData.loggedUser = "guest"
})