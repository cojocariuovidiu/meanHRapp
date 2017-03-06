angular.module('uploadFileService', [])

.service('uploadFile', function($http) {
    this.uploadCV = function(file) {
        var fd = new FormData()
        fd.append('myfile', file.upload)

        return $http.post('/api/uploadCV', fd, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        })
    }
    this.uploadCI = function(file) {
        var fd = new FormData()
        fd.append('myfile', file.upload)

        return $http.post('/api/uploadCI', fd, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        })
    }
})