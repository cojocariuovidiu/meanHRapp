function ChartFilterYear(option) {
    //Declare and reset values on function call
    // var janTotal = 0,
    //     febTotal = 0,
    //     marTotal = 0,
    //     aprTotal = 0,
    //     mayTotal = 0,
    //     junTotal = 0,
    //     julTotal = 0,
    //     augTotal = 0,
    //     sepTotal = 0,
    //     octTotal = 0,
    //     novTotal = 0,
    //     decTotal = 0,
    //     janEmp = 0,
    //     febEmp = 0,
    //     marEmp = 0,
    //     aprEmp = 0,
    //     mayEmp = 0,
    //     junEmp = 0,
    //     julEmp = 0,
    //     augEmp = 0,
    //     sepEmp = 0,
    //     octEmp = 0,
    //     novEmp = 0,
    //     decEmp = 0

    var monthInterviews = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    var monthAssunti = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

    //Load all data from the DB
    Interview.getinterviews().then(function(response) {
        response.data.forEach(function(element) {
            var esitocolloquio = element.esitocolloquio
            var momenYear = moment(element.dataapplicazione).format('YYYY')

            if (momenYear == option) {
                var momentDate = moment(element.dataapplicazione).format('M')

                for (var i = 0; i < monthInterviews.length; i++) {
                    if (momentDate == i + 1) {
                        monthInterviews[i]++
                            if (element.esitocolloquio == 'assunto') {
                                monthAssunti[i]++
                            }
                    }
                }


                //     if (momentDate == 1) {
                //         janTotal++
                //         if (element.esitocolloquio == 'assunto') {
                //             janEmp++
                //         }
                //     } else
                //     if (momentDate == 2) {
                //         febTotal++
                //         if (element.esitocolloquio == 'assunto') {
                //             febEmp++
                //         }
                //     } else
                //     if (momentDate == 3) {
                //         marTotal++
                //         if (element.esitocolloquio == 'assunto') {
                //             marEmp++
                //         }
                //     } else
                //     if (momentDate == 4) {
                //         aprTotal++
                //         if (element.esitocolloquio == 'assunto') {
                //             aprEmp++
                //         }
                //     } else
                //     if (momentDate == 5) {
                //         mayTotal++
                //         if (element.esitocolloquio == 'assunto') {
                //             mayEmp++
                //         }
                //     } else
                //     if (momentDate == 6) {
                //         junTotal++
                //         if (element.esitocolloquio == 'assunto') {
                //             junEmp++
                //         }
                //     } else
                //     if (momentDate == 7) {
                //         julTotal++
                //         if (element.esitocolloquio == 'assunto') {
                //             julEmp++
                //         }
                //     } else
                //     if (momentDate == 8) {
                //         augTotal++
                //         if (element.esitocolloquio == 'assunto') {
                //             augEmp++
                //         }
                //     } else
                //     if (momentDate == 9) {
                //         sepTotal++
                //         if (element.esitocolloquio == 'assunto') {
                //             sepEmp++
                //         }
                //     } else
                //     if (momentDate == 10) {
                //         octTotal++
                //         if (element.esitocolloquio == 'assunto') {
                //             octEmp++
                //         }
                //     } else
                //     if (momentDate == 11) {
                //         novTotal++
                //         if (element.esitocolloquio == 'assunto') {
                //             novEmp++
                //         }
                //     } else
                //     if (momentDate == 12) {
                //         decTotal++
                //         if (element.esitocolloquio == 'assunto') {
                //             decEmp++
                //         }
                //     }
                // } else {
                //     //console.log(momenYear)
            }
        }, this);

        // $scope.barChart.Interviews.push(janTotal, febTotal, marTotal, aprTotal, mayTotal, junTotal, julTotal, augTotal, sepTotal, octTotal, novTotal, decTotal)
        // $scope.barChart.Assunti.push(janEmp, febEmp, marEmp, aprEmp, mayEmp, junEmp, julEmp, augEmp, sepEmp, octEmp, novEmp, decEmp)

        // $scope.barChart.Interviews = monthInterviews
        // $scope.barChart.Assunti = monthAssunti

        $scope.barChart.data.push(monthInterviews)
        $scope.barChart.data.push(monthAssunti)



        // console.log(chart.barChart.data)
    })
}