'use strict'

angular.module("empChartControllers", ["chart.js"])

.controller("empChartCtrl", function(Employee, $scope) {

    var empChart = this

    empChart.dougChart = {};
    empChart.dougChart.labels = ['Maran', 'Triboo', 'No Dpt']
    empChart.dougChart.series = ['Dipendenti']
    empChart.dougChart.colors = ["#F7464A", "#97BBCD", "#000000"]

    empChart.dougChart.options = {
        responsive: false,
        maintainAspectRatio: true,
        legend: { display: true }
    }
    empChart.dougChart.data = []
    empChart.dougChart.Employees = []

    //Button/OnLoad function
    this.loadChartData = function(option) {

        empChart.dougChart.data = []
        empChart.dougChart.Employees = []

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
            empChart.dougChart.data.push(maranTotal, tribooTotal, noDepTotal)
                // empChart.dougChart.data.push(empChart.dougChart.Employees)
            console.log(empChart.dougChart.data)
        })
    }

    $scope.$on('chart-destroy', function(evt, chart) {
        // console.log('destroy');
    });
    $scope.$on('chart-update', function(evt, chart) {
        console.log('update');
    });
});