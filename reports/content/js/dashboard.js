/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7746478873239436, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login"], "isController": false}, {"data": [0.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login-5"], "isController": false}, {"data": [0.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login-4"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/admin/organization"], "isController": false}, {"data": [0.5, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login-1"], "isController": false}, {"data": [0.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-0"], "isController": false}, {"data": [0.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees/7/screen/personal/attachments?limit=50&offset=0"], "isController": false}, {"data": [0.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewMyDetails-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-4"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewMyDetails-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-5"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-6"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-7"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/admin/subunits?mode=tree"], "isController": false}, {"data": [0.5, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewCompanyStructure"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees/7"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/core/i18n/messages"], "isController": false}, {"data": [0.5, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewOrganizationGeneralInformation"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/admin/employment-statuses"], "isController": false}, {"data": [0.0, 500, 1500, "Login"], "isController": true}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewAdminModule-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewAdminModule-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewMyDetails-4"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewMyDetails-5"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/admin/subunits"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewMyDetails-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewMyDetails-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewCompanyStructure-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewCompanyStructure-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewOrganizationGeneralInformation-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewCompanyStructure-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/admin/job-titles"], "isController": false}, {"data": [0.5, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewOrganizationGeneralInformation-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewOrganizationGeneralInformation-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewOrganizationGeneralInformation-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewCompanyStructure-5"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewOrganizationGeneralInformation-5"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewCompanyStructure-4"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/admin/users?limit=50&offset=0&sortField=u.userName&sortOrder=ASC"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewOrganizationGeneralInformation-4"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewCompanyStructure-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees/7/custom-fields?screen=personal"], "isController": false}, {"data": [0.0, 500, 1500, "Organizational Details"], "isController": true}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewAdminModule-6"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewAdminModule-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees?limit=50&offset=0&model=detailed&includeEmployees=onlyCurrent&sortField=employee.firstName&sortOrder=ASC"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewAdminModule-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewMyDetails"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewAdminModule-5"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewAdminModule-4"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees/7/personal-details"], "isController": false}, {"data": [0.0, 500, 1500, "Homepage"], "isController": true}, {"data": [0.0, 500, 1500, "My Info Details"], "isController": true}, {"data": [0.5, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees"], "isController": false}, {"data": [0.5, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewAdminModule"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/leave/holidays?fromDate=2022-01-01&toDate=2022-12-31"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/leave/workweek?model=indexed"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 67, 0, 0.0, 670.6119402985076, 155, 7550, 327.0, 1248.4000000000026, 2577.999999999998, 7550.0, 1.3325377883850438, 148.62768496420048, 1.2482442074383453], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/login", 1, 0, 0.0, 7550.0, 7550, 7550, 7550.0, 7550.0, 7550.0, 7550.0, 0.13245033112582782, 470.5145384933775, 0.45891970198675497], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/login-5", 1, 0, 0.0, 2365.0, 2365, 2365, 2365.0, 2365.0, 2365.0, 2365.0, 0.4228329809725158, 602.7137288583509, 0.24651493128964058], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/login-4", 1, 0, 0.0, 2720.0, 2720, 2720, 2720.0, 2720.0, 2720.0, 2720.0, 0.3676470588235294, 416.6450051700367, 0.21793141084558823], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/admin/organization", 1, 0, 0.0, 303.0, 303, 303, 303.0, 303.0, 303.0, 303.0, 3.3003300330033003, 4.183426155115511, 1.5212458745874589], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/login-1", 1, 0, 0.0, 866.0, 866, 866, 866.0, 866.0, 866.0, 866.0, 1.1547344110854503, 1.887720121247113, 0.6754745236720554], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/login-0", 1, 0, 0.0, 4612.0, 4612, 4612, 4612.0, 4612.0, 4612.0, 4612.0, 0.21682567215958368, 0.9367546617519514, 0.11370643159150043], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-0", 1, 0, 0.0, 1067.0, 1067, 1067, 1067.0, 1067.0, 1067.0, 1067.0, 0.9372071227741331, 1.6263838448922212, 0.7623960285848173], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/login-3", 1, 0, 0.0, 1974.0, 1974, 1974, 1974.0, 1974.0, 1974.0, 1974.0, 0.5065856129685917, 241.98516258232016, 0.29633279508611954], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-1", 1, 0, 0.0, 409.0, 409, 409, 409.0, 409.0, 409.0, 409.0, 2.444987775061125, 4.0351849022004895, 1.5400557762836187], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/login-2", 1, 0, 0.0, 1012.0, 1012, 1012, 1012.0, 1012.0, 1012.0, 1012.0, 0.9881422924901185, 504.01046813241106, 0.5876744688735178], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-2", 1, 0, 0.0, 400.0, 400, 400, 400.0, 400.0, 400.0, 400.0, 2.5, 19.2529296875, 1.58203125], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees/7/screen/personal/attachments?limit=50&offset=0", 1, 0, 0.0, 649.0, 649, 649, 649.0, 649.0, 649.0, 649.0, 1.5408320493066257, 1.6762567411402156, 0.8682227465331278], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate", 1, 0, 0.0, 2195.0, 2195, 2195, 2195.0, 2195.0, 2195.0, 2195.0, 0.4555808656036447, 7.259930239179955, 2.590226366742597], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-3", 1, 0, 0.0, 293.0, 293, 293, 293.0, 293.0, 293.0, 293.0, 3.4129692832764507, 3.302981015358362, 2.44640571672355], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewMyDetails-0", 1, 0, 0.0, 580.0, 580, 580, 580.0, 580.0, 580.0, 580.0, 1.7241379310344827, 36.754108297413794, 1.003502155172414], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-4", 1, 0, 0.0, 293.0, 293, 293, 293.0, 293.0, 293.0, 293.0, 3.4129692832764507, 3.3096469709897613, 2.4864014505119454], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewMyDetails-1", 1, 0, 0.0, 159.0, 159, 159, 159.0, 159.0, 159.0, 159.0, 6.289308176100629, 6.086625393081761, 4.20720322327044], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-5", 1, 0, 0.0, 293.0, 293, 293, 293.0, 293.0, 293.0, 293.0, 3.4129692832764507, 3.3096469709897613, 2.453071672354949], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-6", 1, 0, 0.0, 293.0, 293, 293, 293.0, 293.0, 293.0, 293.0, 3.4129692832764507, 3.3129799488054608, 2.483068472696246], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-7", 1, 0, 0.0, 293.0, 293, 293, 293.0, 293.0, 293.0, 293.0, 3.4129692832764507, 3.3129799488054608, 2.449738694539249], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/admin/subunits?mode=tree", 1, 0, 0.0, 315.0, 315, 315, 315.0, 315.0, 315.0, 315.0, 3.1746031746031744, 5.530753968253968, 1.6741071428571428], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewCompanyStructure", 1, 0, 0.0, 656.0, 656, 656, 656.0, 656.0, 656.0, 656.0, 1.524390243902439, 22.636599657012194, 6.038014481707317], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees/7", 1, 0, 0.0, 339.0, 339, 339, 339.0, 339.0, 339.0, 339.0, 2.949852507374631, 3.4165283923303833, 1.3510554941002948], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/core/i18n/messages", 6, 0, 0.0, 330.8333333333333, 302, 420, 314.0, 420.0, 420.0, 420.0, 0.15503475362393737, 2.5373314804527016, 0.08713134835017183], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewOrganizationGeneralInformation", 1, 0, 0.0, 1064.0, 1064, 1064, 1064.0, 1064.0, 1064.0, 1064.0, 0.9398496240601504, 30.30923255404135, 3.7355351268796992], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/admin/employment-statuses", 1, 0, 0.0, 383.0, 383, 383, 383.0, 383.0, 383.0, 383.0, 2.6109660574412534, 3.3070536879895562, 1.3794264033942558], "isController": false}, {"data": ["Login", 1, 0, 0.0, 4308.0, 4308, 4308, 4308.0, 4308.0, 4308.0, 4308.0, 0.23212627669452182, 9.61533230327298, 1.9596988886954505], "isController": true}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewAdminModule-1", 1, 0, 0.0, 392.0, 392, 392, 392.0, 392.0, 392.0, 392.0, 2.5510204081632653, 25.589923469387752, 1.4947385204081631], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewAdminModule-0", 1, 0, 0.0, 326.0, 326, 326, 326.0, 326.0, 326.0, 326.0, 3.067484662576687, 5.07752588190184, 1.7973542944785275], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewMyDetails-4", 1, 0, 0.0, 155.0, 155, 155, 155.0, 155.0, 155.0, 155.0, 6.451612903225806, 6.262600806451613, 4.38508064516129], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewMyDetails-5", 1, 0, 0.0, 174.0, 174, 174, 174.0, 174.0, 174.0, 174.0, 5.747126436781609, 5.578753591954023, 3.850125718390805], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/admin/subunits", 1, 0, 0.0, 337.0, 337, 337, 337.0, 337.0, 337.0, 337.0, 2.967359050445104, 6.5142804154302665, 1.5358401335311571], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewMyDetails-2", 1, 0, 0.0, 174.0, 174, 174, 174.0, 174.0, 174.0, 174.0, 5.747126436781609, 5.573141163793104, 3.91186242816092], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewMyDetails-3", 1, 0, 0.0, 191.0, 191, 191, 191.0, 191.0, 191.0, 191.0, 5.235602094240838, 5.077102421465969, 3.5125572643979055], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewCompanyStructure-2", 1, 0, 0.0, 195.0, 195, 195, 195.0, 195.0, 195.0, 195.0, 5.128205128205129, 4.972956730769231, 3.4905849358974357], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewCompanyStructure-1", 1, 0, 0.0, 195.0, 195, 195, 195.0, 195.0, 195.0, 195.0, 5.128205128205129, 4.962940705128205, 3.430488782051282], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewOrganizationGeneralInformation-1", 1, 0, 0.0, 270.0, 270, 270, 270.0, 270.0, 270.0, 270.0, 3.7037037037037037, 3.5843460648148144, 2.4775752314814814], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewCompanyStructure-0", 1, 0, 0.0, 452.0, 452, 452, 452.0, 452.0, 452.0, 452.0, 2.2123893805309733, 22.126054341814157, 1.307124585176991], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/admin/job-titles", 1, 0, 0.0, 377.0, 377, 377, 377.0, 377.0, 377.0, 377.0, 2.6525198938992043, 12.15910974801061, 1.378066976127321], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewOrganizationGeneralInformation-0", 1, 0, 0.0, 767.0, 767, 767, 767.0, 767.0, 767.0, 767.0, 1.303780964797914, 35.72410772490222, 0.7881254074315515], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewOrganizationGeneralInformation-3", 1, 0, 0.0, 270.0, 270, 270, 270.0, 270.0, 270.0, 270.0, 3.7037037037037037, 3.5915798611111107, 2.4848090277777777], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewOrganizationGeneralInformation-2", 1, 0, 0.0, 270.0, 270, 270, 270.0, 270.0, 270.0, 270.0, 3.7037037037037037, 3.5915798611111107, 2.520978009259259], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewCompanyStructure-5", 1, 0, 0.0, 194.0, 194, 194, 194.0, 194.0, 194.0, 194.0, 5.154639175257732, 5.0036243556701026, 3.4532055412371134], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewOrganizationGeneralInformation-5", 1, 0, 0.0, 270.0, 270, 270, 270.0, 270.0, 270.0, 270.0, 3.7037037037037037, 3.595196759259259, 2.4811921296296293], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewCompanyStructure-4", 1, 0, 0.0, 193.0, 193, 193, 193.0, 193.0, 193.0, 193.0, 5.181347150259067, 5.0295498704663215, 3.5216968911917097], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/admin/users?limit=50&offset=0&sortField=u.userName&sortOrder=ASC", 1, 0, 0.0, 383.0, 383, 383, 383.0, 383.0, 383.0, 383.0, 2.6109660574412534, 30.367779046997388, 1.4788674934725847], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewOrganizationGeneralInformation-4", 1, 0, 0.0, 270.0, 270, 270, 270.0, 270.0, 270.0, 270.0, 3.7037037037037037, 3.595196759259259, 2.517361111111111], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewCompanyStructure-3", 1, 0, 0.0, 195.0, 195, 195, 195.0, 195.0, 195.0, 195.0, 5.128205128205129, 4.972956730769231, 3.4405048076923075], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees/7/custom-fields?screen=personal", 1, 0, 0.0, 340.0, 340, 340, 340.0, 340.0, 340.0, 340.0, 2.941176470588235, 3.4983915441176467, 1.6113281249999998], "isController": false}, {"data": ["Organizational Details", 1, 0, 0.0, 4563.0, 4563, 4563, 4563.0, 4563.0, 4563.0, 4563.0, 0.21915406530791148, 17.82959572923515, 3.4514625109577035], "isController": true}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewAdminModule-6", 1, 0, 0.0, 155.0, 155, 155, 155.0, 155.0, 155.0, 155.0, 6.451612903225806, 6.262600806451613, 4.322076612903226], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewAdminModule-3", 1, 0, 0.0, 157.0, 157, 157, 157.0, 157.0, 157.0, 157.0, 6.369426751592357, 6.1766023089171975, 4.335439888535032], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees?limit=50&offset=0&model=detailed&includeEmployees=onlyCurrent&sortField=employee.firstName&sortOrder=ASC", 1, 0, 0.0, 689.0, 689, 689, 689.0, 689.0, 689.0, 689.0, 1.4513788098693758, 23.823022496371554, 0.8986075834542816], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewAdminModule-2", 1, 0, 0.0, 173.0, 173, 173, 173.0, 173.0, 173.0, 173.0, 5.780346820809248, 5.594066112716764, 3.8667359104046244], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewMyDetails", 1, 0, 0.0, 783.0, 783, 783, 783.0, 783.0, 783.0, 783.0, 1.277139208173691, 33.41764447637292, 5.04744372605364], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewAdminModule-5", 1, 0, 0.0, 173.0, 173, 173, 173.0, 173.0, 173.0, 173.0, 5.780346820809248, 5.611000722543353, 3.9288294797687864], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewAdminModule-4", 1, 0, 0.0, 182.0, 182, 182, 182.0, 182.0, 182.0, 182.0, 5.4945054945054945, 5.328167925824176, 3.686255151098901], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees/7/personal-details", 1, 0, 0.0, 345.0, 345, 345, 345.0, 345.0, 345.0, 345.0, 2.898550724637681, 4.110054347826087, 1.5511775362318843], "isController": false}, {"data": ["Homepage", 1, 0, 0.0, 7868.0, 7868, 7868, 7868.0, 7868.0, 7868.0, 7868.0, 0.12709710218607015, 463.32553539654293, 0.505285452147941], "isController": true}, {"data": ["My Info Details", 1, 0, 0.0, 4770.0, 4770, 4770, 4770.0, 4770.0, 4770.0, 4770.0, 0.20964360587002095, 9.780979756289309, 1.8898634040880504], "isController": true}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees", 1, 0, 0.0, 527.0, 527, 527, 527.0, 527.0, 527.0, 527.0, 1.8975332068311195, 12.869500118595825, 0.8653789136622391], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewAdminModule", 1, 0, 0.0, 922.0, 922, 922, 922.0, 922.0, 922.0, 922.0, 1.0845986984815619, 17.93400894793926, 4.926238815075922], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/leave/holidays?fromDate=2022-01-01&toDate=2022-12-31", 2, 0, 0.0, 353.5, 332, 375, 353.5, 375.0, 375.0, 375.0, 1.9120458891013383, 5.405637547801147, 0.9448195506692161], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/leave/workweek?model=indexed", 2, 0, 0.0, 330.0, 324, 336, 330.0, 336.0, 336.0, 336.0, 1.9286403085824495, 2.094382835101254, 0.9078170202507233], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 67, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
