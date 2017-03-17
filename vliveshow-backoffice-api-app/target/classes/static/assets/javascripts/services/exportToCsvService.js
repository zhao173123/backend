/**
 * Created by rex_fzhou on 2016/8/31.
 */
backStart.factory('ExportToCsvService',
    function(){
        var ExportToCsvService = {};

        ExportToCsvService.exportToCsv = function (JSONData, ReportTitle, ShowLabel) {
            //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
            var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
            var CSV = '';

            if (ShowLabel) {
                var row = "";
                for (var index in arrData[0]) {
                    row += index + ',';
                }
                CSV += row.slice(0, -1) + '\r\n';
            }

            for (var i = 0; i < arrData.length; i++) {
                var row = "";

                for (var index in arrData[i]) {
                    var str = arrData[i][index] == undefined ? '' : arrData[i][index];
                    row += '"' + str + '",';
                }
                row.slice(0, row.length - 1);
                CSV += row + '\r\n';
            }
            if (CSV == '') {
                alert("Invalid data");
                return;
            }

            var uri = 'data:text/csv;charset=utf-8,\uFEFF' + encodeURI(CSV);

            var link = document.createElement("a");
            link.href = uri;
            link.style = "visibility:hidden";
            link.download = ReportTitle + ".csv";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        return ExportToCsvService;
    });