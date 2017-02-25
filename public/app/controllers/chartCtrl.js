angular.module("chartControllers", ["chart.js", 'interviewServices'])

.controller("chartCtrl", function(Interview, $scope) {

    var app = this

    $scope.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    $scope.series = ['Interviews', 'Employees'];

    $scope.data = [
        [65, 59, 80, 81, 56, 55, 40, 80, 81, 56, 55, 40],
        [28, 48, 40, 19, 86, 27, 90, 80, 81, 56, 55, 40]
    ];

    this.loadChartData = function() {
        Interview.getChartData().then(function(response) {
            var jan2017Total = 0

            response.data.forEach(function(element) {
                var momenYear = moment(element.dataapplicazione).format('YYYY')

                if (momenYear == 2017) {
                    var momentDate = moment(element.dataapplicazione).format('M')

                    if (momentDate == 1) {
                        jan2017Total++
                    }
                    console.log("2017:", momentDate)

                } else if (momenYear == 2016) {
                    var momentDate = moment(element.dataapplicazione).format('M')
                    console.log("2016:", momentDate)
                } else {
                    // console.log(momenYear)
                }
            }, this);
            console.log('jan2017Total', jan2017Total)
        })
    }
});