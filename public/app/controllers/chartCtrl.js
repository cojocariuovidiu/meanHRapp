angular.module("chartControllers", ["chart.js", 'interviewServices'])

// .config(['ChartJsProvider', function(ChartJsProvider) {
//     // Configure all charts
//     ChartJsProvider.setOptions({
//         //chartColors: ['#FF5252', '#FF8A80'],
//         responsive: false
//     });
//     // Configure all line charts
//     ChartJsProvider.setOptions('line', {
//         showLines: false
//     });
// }])

.controller("chartCtrl", function(Interview, $scope) {

    var app = this

    app.barChart = {};
    app.barChart.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    app.barChart.series = ['Interviews', 'Employees']
    app.barChart.data = []
    app.barChart.options = {
        responsive: false,
        maintainAspectRatio: true
    }

    // $scope.options = { legend: { display: true } }; // missing 
    // $scope.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    // $scope.series = ['Interviews', 'Employees'];
    //$scope.data = []

    this.loadChartData = function(option) {
        $scope.selectedYear = option
        if (option == 2017) {
            Interview.getChartData().then(function(response) {
                app.barChart.data = []
                jan2017Total = 0
                feb2017Total = 0
                mar2017Total = 0

                response.data.forEach(function(element) {
                    var momenYear = moment(element.dataapplicazione).format('YYYY')
                    if (momenYear == 2017) {
                        var momentDate = moment(element.dataapplicazione).format('M')
                        if (momentDate == 1) {
                            jan2017Total++
                        } else
                        if (momentDate == 2) {
                            feb2017Total++
                        } else
                        if (momentDate == 3) {
                            mar2017Total++
                        }
                    } else {
                        //console.log(momenYear)
                    }
                }, this);

                app.barChart.data.push(jan2017Total)
                app.barChart.data.push(feb2017Total)
                app.barChart.data.push(mar2017Total)
            })
        } else if (option == 2016) {
            Interview.getChartData().then(function(response) {
                app.barChart.data = []
                jan2016Total = 0
                feb2016Total = 0
                mar2016Total = 0
                apr2016Total = 0
                mai2016Total = 0
                jun2016Total = 0
                jul2016Total = 0
                aug2016Total = 0
                sep2016Total = 0
                oct2016Total = 0
                nov2016Total = 0
                dec2016Total = 0

                response.data.forEach(function(element) {
                    var momenYear = moment(element.dataapplicazione).format('YYYY')
                    if (momenYear == 2016) {
                        var momentDate = moment(element.dataapplicazione).format('M')
                        if (momentDate == 1) {
                            jan2016Total++
                        } else if (momentDate == 2) {
                            feb2016Total++
                        } else if (momentDate == 3) {
                            mar2016Total++
                        } else if (momentDate == 4) {
                            apr2016Total++
                        } else if (momentDate == 5) {
                            mai2016Total++
                        } else if (momentDate == 6) {
                            jun2016Total++
                        } else if (momentDate == 7) {
                            jul2016Total++
                        } else if (momentDate == 8) {
                            aug2016Total++
                        } else if (momentDate == 9) {
                            sep2016Total++
                        } else if (momentDate == 10) {
                            oct2016Total++
                        } else if (momentDate == 11) {
                            nov2016Total++
                        } else if (momentDate == 12) {
                            dec2016Total++
                        }
                    } else {
                        //console.log(momenYear)
                    }
                }, this);

                app.barChart.data.push(jan2016Total)
                app.barChart.data.push(feb2016Total)
                app.barChart.data.push(mar2016Total)
                app.barChart.data.push(apr2016Total)
                app.barChart.data.push(mai2016Total)
                app.barChart.data.push(jun2016Total)
                app.barChart.data.push(jul2016Total)
                app.barChart.data.push(aug2016Total)
                app.barChart.data.push(jun2016Total)
                app.barChart.data.push(jul2016Total)
                app.barChart.data.push(aug2016Total)
                app.barChart.data.push(sep2016Total)
                app.barChart.data.push(oct2016Total)
                app.barChart.data.push(nov2016Total)
                app.barChart.data.push(dec2016Total)
            })
        }

    }

    $scope.$on('chart-destroy', function(evt, chart) {
        console.log('destroy');
    });
    $scope.$on('chart-update', function(evt, chart) {
        console.log('update');
    });

    // $scope.$on('chart-create', function(evt, chart) {
    //     console.log(chart);
    // });

    // $scope.onClick = function(points, evt) {
    //     console.log(points, evt);
    // };

    app.loadChartData(2017)

});