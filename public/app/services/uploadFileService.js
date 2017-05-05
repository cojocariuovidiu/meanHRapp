angular.module('uploadFileService', [])

    .service('uploadFile', function ($http) {

        this.uploadCV = function (file, uploadYear, uploadMonth) {
            var fd = new FormData()
            fd.append('myfile', file.upload)

            // fd.append('myfile', uploadYear, uploadMonth)

            // console.log(fd.get("myfile"))

            // for (var pair of fd.entries()) {
            //     console.log(pair[1]);
            // }

            var dynamicPath = 'CV ' + uploadYear + '/' +'CV '+ uploadMonth

            return $http.post('/api/uploadCV', fd, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined,
                    'path': dynamicPath                    
                },
            })
        }

        this.uploadCI = function (file) {
            var fd = new FormData()
            fd.append('myfile', file.upload)

            return $http.post('/api/uploadCI', fd, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            })
        }
    })