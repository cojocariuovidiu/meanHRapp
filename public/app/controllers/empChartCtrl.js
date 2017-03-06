'use strict'

angular.module("empChartControllers", ["chart.js"])

.controller("empChartCtrl", function(Employee, $scope) {

    var empChart = this

    empChart.barChart = {};
    empChart.barChart.labels = ['Maran', 'Triboo', 'No Dpt']
    empChart.barChart.series = ['Dipendenti']

    empChart.colours = [{
        fillColor: 'rgba(151,187,205,0.2)',
        strokeColor: 'red',
        pointColor: 'rgba(151,187,205,1)',
        pointStrokeColor: 'red',
        pointHighlightFill: 'red',
        pointHighlightStroke: 'rgba(151,187,205,0.8)'
    }, {
        fillColor: 'rgba(151,187,205,0.2)',
        strokeColor: 'blue',
        pointColor: 'rgba(151,187,205,1)',
        pointStrokeColor: '#fff',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(151,187,205,0.8)'
    }]

    empChart.barChart.options = {
        responsive: false,
        maintainAspectRatio: true,
        scales: {
            yAxes: [{
                display: true,
                ticks: {
                    suggestedMin: 0, // minimum will be 0, unless there is a lower value.
                    // OR //
                    beginAtZero: true // minimum value will be 0.
                }
            }]
        },
        // colours = [{
        //     fillColor: 'rgba(151,187,205,0.2)',
        //     strokeColor: 'red',
        //     pointColor: 'rgba(151,187,205,1)',
        //     pointStrokeColor: '#fff',
        //     pointHighlightFill: '#fff',
        //     pointHighlightStroke: 'rgba(151,187,205,0.8)'
        // }, {
        //     fillColor: 'rgba(151,187,205,0.2)',
        //     strokeColor: 'blue',
        //     pointColor: 'rgba(151,187,205,1)',
        //     pointStrokeColor: '#fff',
        //     pointHighlightFill: '#fff',
        //     pointHighlightStroke: 'rgba(151,187,205,0.8)'
        // }]
    }
    empChart.barChart.data = []
    empChart.barChart.Employees = []


    //Button/OnLoad function
    this.loadChartData = function(option) {
        empChart.selectedChartOrder = option
        $scope.selectedYear = empChart.selectedChartOrder
        console.log($scope.selectedYear)
        empChart.barChart.data = []
        empChart.barChart.Employees = []

        if (option == 2017) {
            ChartFilterYear(option)
        } else if (option == 2016) {
            ChartFilterYear(option)
        } else {
            console.log('chart year != 2016 or 2017')
        }
    }

    //Load 2017 on start
    empChart.selectedChartOrder = (2017)
    empChart.loadChartData(empChart.selectedChartOrder)

    //Filter function used for each year
    function ChartFilterYear(option) {
        var maranTotal = 0
        var tribooTotal = 0
        var noDepTotal = 0

        //Load all data from the DB
        Employee.getEmployees().then(function(response) {
            response.data.forEach(function(element) {
                console.log(element.department)
                if (element.department === "Maran") {
                    maranTotal++
                } else if (element.department === "Triboo") {
                    tribooTotal++
                } else {
                    noDepTotal++
                }
            }, this);
            empChart.barChart.Employees.push(maranTotal, tribooTotal, noDepTotal)
            empChart.barChart.data.push(empChart.barChart.Employees)
            console.log(empChart.barChart.data)
        })
    }

    $scope.$on('chart-destroy', function(evt, chart) {
        // console.log('destroy');
    });
    $scope.$on('chart-update', function(evt, chart) {
        console.log('update');
    });

});