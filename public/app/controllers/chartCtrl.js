'use strict'

angular.module("chartControllers", ["chart.js", 'interviewServices'])

.controller("chartCtrl", function(Interview, $scope) {

    var chart = this

    chart.barChart = {};
    chart.barChart.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    chart.barChart.series = ['Interviste', 'Dipendenti']
    chart.barChart.options = {
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
    chart.barChart.data = []
    chart.barChart.Interviews = []
    chart.barChart.Employees = []

    //Button/OnLoad function
    this.loadChartData = function(option) {
        $scope.selectedYear = option
        chart.barChart.data = []
        chart.barChart.Interviews = []
        chart.barChart.Employees = []

        if (option == 2017) {
            ChartFilterYear(option)
        } else if (option == 2016) {
            ChartFilterYear(option)
        } else {
            console.log('chart year != 2016 or 2017')
        }
    }

    //Load 2017 on start
    chart.loadChartData(2017)

    //Filter function used for each year
    function ChartFilterYear(option) {
        //Declare and reset values on function call
        var janTotal = 0,
            febTotal = 0,
            marTotal = 0,
            aprTotal = 0,
            mayTotal = 0,
            junTotal = 0,
            julTotal = 0,
            augTotal = 0,
            sepTotal = 0,
            octTotal = 0,
            novTotal = 0,
            decTotal = 0,
            janEmp = 0,
            febEmp = 0,
            marEmp = 0,
            aprEmp = 0,
            mayEmp = 0,
            junEmp = 0,
            julEmp = 0,
            augEmp = 0,
            sepEmp = 0,
            octEmp = 0,
            novEmp = 0,
            decEmp = 0

        //Load all data from the DB
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

            chart.barChart.Interviews.push(janTotal, febTotal, marTotal, aprTotal, mayTotal, junTotal, julTotal, augTotal, sepTotal, octTotal, novTotal, decTotal)
            chart.barChart.Employees.push(janEmp, febEmp, marEmp, aprEmp, mayEmp, junEmp, julEmp, augEmp, sepEmp, octEmp, novEmp, decEmp)

            chart.barChart.data.push(chart.barChart.Interviews)
            chart.barChart.data.push(chart.barChart.Employees)

            console.log(chart.barChart.data)
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