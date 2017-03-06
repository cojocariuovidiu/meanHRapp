'use strict'

angular.module("empChartControllers", ["chart.js"])

.controller("empChartCtrl", function(Employee, $scope) {

    var empChart = this

    empChart.barChart = {};
    empChart.barChart.labels = ['Maran', 'Triboo']
    empChart.barChart.series = ['Dipendenti']
    empChart.barChart.options = {
        responsive: false,
        maintainAspectRatio: true,
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

        //Load all data from the DB
        Employee.getEmployees().then(function(response) {
            console.log(response.data)
        })
    }

    $scope.$on('chart-destroy', function(evt, chart) {
        // console.log('destroy');
    });
    $scope.$on('chart-update', function(evt, chart) {
        console.log('update');
    });

});