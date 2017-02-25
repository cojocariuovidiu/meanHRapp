angular.module("chartControllers", ["chart.js", 'interviewServices'])

.controller("chartCtrl", function(Interview, $scope) {

    var app = this

    $scope.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    $scope.series = ['Interviews', 'Employees'];
    $scope.data = []

    var jan2017Total = 0
    var feb2017Total = 0

    this.loadChartData = function() {
        Interview.getChartData().then(function(response) {

            $scope.data = []

            response.data.forEach(function(element) {
                var momenYear = moment(element.dataapplicazione).format('YYYY')

                if (momenYear == 2017) {
                    var momentDate = moment(element.dataapplicazione).format('M')
                    if (momentDate == 1) {
                        jan2017Total++
                    } else
                    if (momentDate == 2) {
                        feb2017Total++
                    }
                } else if (momenYear == 2016) {

                } else {
                    // console.log(momenYear)
                }
            }, this);
            console.log('jan2017Total', jan2017Total)
            console.log('feb2017Total', feb2017Total)

            $scope.data.push(jan2017Total)
            $scope.data.push(feb2017Total)

            console.log($scope.data)
        })
    }

    app.loadChartData()


});