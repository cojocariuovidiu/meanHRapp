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
    app.barChart.options = {
        responsive: false,
        maintainAspectRatio: true
    }
    app.barChart.data = []
    app.barChart.Interviews = []
    app.barChart.Employees = []

    // $scope.options = { legend: { display: true } }; // missing 
    // $scope.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    // $scope.series = ['Interviews', 'Employees'];
    //$scope.data = []

    this.loadChartData = function(option) {
        $scope.selectedYear = option
        app.barChart.data = []
        app.barChart.Interviews = []
        app.barChart.Employees = []
            // app.barChart.Employees = []

        if (option == 2017) {
            Interview.getChartData().then(function(response) {
                janTotal = 0
                febTotal = 0
                marTotal = 0
                aprTotal = 0
                mayTotal = 0
                junTotal = 0
                julTotal = 0
                augTotal = 0
                sepTotal = 0
                oct2017Total = 0
                nov2017Total = 0
                dec2017Total = 0
                jan2017Emp = 0
                feb2017Emp = 0
                mar2017Emp = 0
                apr2017Emp = 0
                mai2017Emp = 0
                jun2017Emp = 0
                jul2017Emp = 0
                aug2017Emp = 0
                sep2017Emp = 0
                oct2017Emp = 0
                nov2017Emp = 0
                dec2017Emp = 0

                response.data.forEach(function(element) {
                    var interviewStatus = element.interviewStatus

                    var momenYear = moment(element.dataapplicazione).format('YYYY')
                    if (momenYear == 2017) {
                        var momentDate = moment(element.dataapplicazione).format('M')
                        if (momentDate == 1) {
                            janTotal++
                            if (element.interviewStatus == 'isEmployee') {
                                jan2017Emp++
                            }
                        } else
                        if (momentDate == 2) {
                            febTotal++
                            if (element.interviewStatus == 'isEmployee') {
                                feb2017Emp++
                            }
                        } else
                        if (momentDate == 3) {
                            marTotal++
                            if (element.interviewStatus == 'isEmployee') {
                                mar2017Emp++
                            }
                        } else
                        if (momentDate == 4) {
                            aprTotal++
                            if (element.interviewStatus == 'isEmployee') {
                                apr2017Emp++
                            }
                        } else
                        if (momentDate == 5) {
                            mayTotal++
                            if (element.interviewStatus == 'isEmployee') {
                                mai2017Emp++
                            }
                        } else
                        if (momentDate == 6) {
                            junTotal++
                            if (element.interviewStatus == 'isEmployee') {
                                jun2017Emp++
                            }
                        } else
                        if (momentDate == 7) {
                            julTotal++
                            if (element.interviewStatus == 'isEmployee') {
                                jul2017Emp++
                            }
                        } else
                        if (momentDate == 8) {
                            augTotal++
                            if (element.interviewStatus == 'isEmployee') {
                                aug2017Emp++
                            }
                        } else
                        if (momentDate == 9) {
                            sepTotal++
                            if (element.interviewStatus == 'isEmployee') {
                                sep2017Emp++
                            }
                        } else
                        if (momentDate == 10) {
                            oct2017Total++
                            if (element.interviewStatus == 'isEmployee') {
                                oct2017Emp++
                            }
                        } else
                        if (momentDate == 11) {
                            nov2017Total++
                            if (element.interviewStatus == 'isEmployee') {
                                nov2017Emp++
                            }
                        } else
                        if (momentDate == 12) {
                            dec2017Total++
                            if (element.interviewStatus == 'isEmployee') {
                                dec2017Emp++
                            }
                        }
                    } else {
                        //console.log(momenYear)
                    }
                }, this);

                app.barChart.Interviews.push(janTotal, febTotal, marTotal, aprTotal, mayTotal, junTotal, julTotal, augTotal, sepTotal, oct2017Total, nov2017Total, dec2017Total)
                app.barChart.Employees.push(jan2017Emp, feb2017Emp, mar2017Emp, apr2017Emp, mai2017Emp, jun2017Emp, jul2017Emp, aug2017Emp, sep2017Emp, oct2017Emp, nov2017Emp, dec2017Emp)

                app.barChart.data.push(app.barChart.Interviews)
                app.barChart.data.push(app.barChart.Employees)

                console.log(app.barChart.data)
            })
        } else if (option == 2016) {

            Interview.getChartData().then(function(response) {
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

                app.barChart.Interviews.push(jan2016Total)
                app.barChart.Interviews.push(feb2016Total)
                app.barChart.Interviews.push(mar2016Total)
                app.barChart.Interviews.push(apr2016Total)
                app.barChart.Interviews.push(mai2016Total)
                app.barChart.Interviews.push(jun2016Total)
                app.barChart.Interviews.push(jul2016Total)
                app.barChart.Interviews.push(aug2016Total)
                app.barChart.Interviews.push(jun2016Total)
                app.barChart.Interviews.push(jul2016Total)
                app.barChart.Interviews.push(aug2016Total)
                app.barChart.Interviews.push(sep2016Total)
                app.barChart.Interviews.push(oct2016Total)
                app.barChart.Interviews.push(nov2016Total)
                app.barChart.Interviews.push(dec2016Total)
                app.barChart.data.push(app.barChart.Interviews)
                app.barChart.data.push(app.barChart.Employees)
                console.log(app.barChart.data)
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