'use strict'

angular.module("chartControllers", ["chart.js", 'interviewServices'])

.controller("chartCtrl", function(Interview, $scope) {

    var app = this

    app.barChart = {};
    app.barChart.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    app.barChart.series = ['Interviews', 'Employees']
    app.barChart.options = {
        responsive: false,
        maintainAspectRatio: true,
        //hide grid lines
        scales: {
            xAxes: [{
                gridLines: {
                    display: false
                }
            }],
            yAxes: [{
                gridLines: {
                    display: false
                }
            }]
        }
    }
    app.barChart.data = []
    app.barChart.Interviews = []
    app.barChart.Employees = []

    //Button/OnLoad function
    this.loadChartData = function(option) {
        $scope.selectedYear = option
        app.barChart.data = []
        app.barChart.Interviews = []
        app.barChart.Employees = []

        if (option == 2017) {
            ChartFilterYear(option)
        } else if (option == 2016) {
            ChartFilterYear(option)
        } else {
            console.log('chart year != 2016 or 2017')
        }
    }

    //Load 2017 on start
    app.loadChartData(2017)

    //Filter function used for each year
    function ChartFilterYear(option) {
        var janTotal = 0
        var febTotal = 0
        var marTotal = 0
        var aprTotal = 0
        var mayTotal = 0
        var junTotal = 0
        var julTotal = 0
        var augTotal = 0
        var sepTotal = 0
        var octTotal = 0
        var novTotal = 0
        var decTotal = 0
        var janEmp = 0
        var febEmp = 0
        var marEmp = 0
        var aprEmp = 0
        var mayEmp = 0
        var junEmp = 0
        var julEmp = 0
        var augEmp = 0
        var sepEmp = 0
        var octEmp = 0
        var novEmp = 0
        var decEmp = 0

        Interview.getChartData().then(function(response) {
            response.data.forEach(function(element) {
                var interviewStatus = element.interviewStatus
                var momenYear = moment(element.dataapplicazione).format('YYYY')

                if (momenYear == option) {
                    var momentDate = moment(element.dataapplicazione).format('M')
                    if (momentDate == 1) {
                        janTotal++
                        if (element.interviewStatus == 'isEmployee') {
                            janEmp++
                        }
                    } else
                    if (momentDate == 2) {
                        febTotal++
                        if (element.interviewStatus == 'isEmployee') {
                            febEmp++
                        }
                    } else
                    if (momentDate == 3) {
                        marTotal++
                        if (element.interviewStatus == 'isEmployee') {
                            marEmp++
                        }
                    } else
                    if (momentDate == 4) {
                        aprTotal++
                        if (element.interviewStatus == 'isEmployee') {
                            aprEmp++
                        }
                    } else
                    if (momentDate == 5) {
                        mayTotal++
                        if (element.interviewStatus == 'isEmployee') {
                            mayEmp++
                        }
                    } else
                    if (momentDate == 6) {
                        junTotal++
                        if (element.interviewStatus == 'isEmployee') {
                            junEmp++
                        }
                    } else
                    if (momentDate == 7) {
                        julTotal++
                        if (element.interviewStatus == 'isEmployee') {
                            julEmp++
                        }
                    } else
                    if (momentDate == 8) {
                        augTotal++
                        if (element.interviewStatus == 'isEmployee') {
                            augEmp++
                        }
                    } else
                    if (momentDate == 9) {
                        sepTotal++
                        if (element.interviewStatus == 'isEmployee') {
                            sepEmp++
                        }
                    } else
                    if (momentDate == 10) {
                        octTotal++
                        if (element.interviewStatus == 'isEmployee') {
                            octEmp++
                        }
                    } else
                    if (momentDate == 11) {
                        novTotal++
                        if (element.interviewStatus == 'isEmployee') {
                            novEmp++
                        }
                    } else
                    if (momentDate == 12) {
                        decTotal++
                        if (element.interviewStatus == 'isEmployee') {
                            decEmp++
                        }
                    }
                } else {
                    //console.log(momenYear)
                }
            }, this);

            app.barChart.Interviews.push(janTotal, febTotal, marTotal, aprTotal, mayTotal, junTotal, julTotal, augTotal, sepTotal, octTotal, novTotal, decTotal)
            app.barChart.Employees.push(janEmp, febEmp, marEmp, aprEmp, mayEmp, junEmp, julEmp, augEmp, sepEmp, octEmp, novEmp, decEmp)

            app.barChart.data.push(app.barChart.Interviews)
            app.barChart.data.push(app.barChart.Employees)

            console.log(app.barChart.data)
        })
    }

    $scope.$on('chart-destroy', function(evt, chart) {
        console.log('destroy');
    });
    $scope.$on('chart-update', function(evt, chart) {
        console.log('update');
    });

});

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



// $scope.$on('chart-create', function(evt, chart) {
//     console.log(chart);
// });

// $scope.onClick = function(points, evt) {
//     console.log(points, evt);
// };