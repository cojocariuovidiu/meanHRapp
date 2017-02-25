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
            response.data.forEach(function(element) {
                var momentDate = moment(element.dataapplicazione).format('M')
                console.log(momentDate)
            }, this);
        })
    }
});