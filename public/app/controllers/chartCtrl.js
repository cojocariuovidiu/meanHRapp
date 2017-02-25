angular.module("chartControllers", ["chart.js", 'interviewServices'])

.controller("chartCtrl", function(Interview, $scope) {

    var app = this

    $scope.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    $scope.series = ['Interviews', 'Employees'];
    $scope.data = []

    this.loadChartData = function() {
        Interview.getChartData().then(function(response) {

            $scope.data = []
            jan2017Total = 0
            feb2017Total = 0

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

            $scope.data.push(jan2017Total)
            $scope.data.push(feb2017Total)
        })
    }

    app.loadChartData()

});