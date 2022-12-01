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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.763953488372093, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://blazedemo.com/purchase.php"], "isController": false}, {"data": [0.675, 500, 1500, "https://blazedemo.com/reserve.php-0"], "isController": false}, {"data": [0.95, 500, 1500, "https://blazedemo.com/purchase.php-5"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/purchase.php-4"], "isController": false}, {"data": [0.775, 500, 1500, "https://blazedemo.com/reserve.php-3"], "isController": false}, {"data": [0.75, 500, 1500, "https://blazedemo.com/reserve.php-4"], "isController": false}, {"data": [0.85, 500, 1500, "https://blazedemo.com/reserve.php-1"], "isController": false}, {"data": [0.325, 500, 1500, "https://blazedemo.com/confirmation.php"], "isController": false}, {"data": [0.8, 500, 1500, "https://blazedemo.com/reserve.php-2"], "isController": false}, {"data": [0.8, 500, 1500, "https://blazedemo.com/reserve.php-5"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/purchase.php-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/purchase.php-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/purchase.php-1"], "isController": false}, {"data": [0.875, 500, 1500, "https://blazedemo.com/purchase.php-0"], "isController": false}, {"data": [0.775, 500, 1500, "https://blazedemo.com/confirmation.php-5"], "isController": false}, {"data": [0.8, 500, 1500, "https://blazedemo.com/confirmation.php-4"], "isController": false}, {"data": [0.825, 500, 1500, "https://blazedemo.com/confirmation.php-3"], "isController": false}, {"data": [0.95, 500, 1500, "https://blazedemo.com/confirmation.php-2"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [0.875, 500, 1500, "https://blazedemo.com/confirmation.php-1"], "isController": false}, {"data": [0.275, 500, 1500, "https://blazedemo.com/reserve.php"], "isController": false}, {"data": [0.625, 500, 1500, "https://blazedemo.com/confirmation.php-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 420, 0, 0.0, 533.5095238095236, 40, 3913, 368.5, 934.2000000000003, 1471.1, 2292.390000000009, 3.606791072333336, 83.05783693439933, 4.617511078001151], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://blazedemo.com/purchase.php", 20, 0, 0.0, 806.8500000000001, 673, 1131, 753.0, 1124.5, 1130.75, 1131.0, 1.6929067208396817, 81.86377788005755, 7.649491598950398], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-0", 20, 0, 0.0, 699.8000000000001, 347, 2385, 573.0, 1424.3000000000013, 2340.1499999999996, 2385.0, 1.8273184102329831, 13.199877227044313, 1.3107083714024668], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-5", 20, 0, 0.0, 332.95, 274, 704, 290.5, 666.7000000000007, 703.8, 704.0, 1.7560804284836247, 0.30011140135218195, 1.3350670054438494], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-4", 20, 0, 0.0, 296.19999999999993, 266, 387, 290.5, 361.7000000000001, 385.95, 387.0, 1.7560804284836247, 0.303541245939064, 1.3350670054438494], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-3", 20, 0, 0.0, 529.15, 265, 1238, 381.0, 930.2000000000002, 1222.9999999999998, 1238.0, 2.2854530910753055, 44.262798537310026, 1.6404375214261229], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-4", 20, 0, 0.0, 646.4, 264, 1423, 529.0, 1215.8000000000002, 1412.7999999999997, 1423.0, 2.289639381797367, 141.92186605609618, 1.642324341728678], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-1", 20, 0, 0.0, 306.2, 40, 740, 284.5, 698.0000000000002, 738.35, 740.0, 2.3476933912431037, 96.51793967895293, 1.6816729516375162], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php", 20, 0, 0.0, 1261.05, 691, 3264, 1028.0, 1760.1000000000001, 3189.249999999999, 3264.0, 0.2981692408611128, 14.146296039194349, 1.377868015385533], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-2", 20, 0, 0.0, 470.80000000000007, 258, 1009, 351.5, 711.4, 994.1499999999999, 1009.0, 2.289639381797367, 32.597175515168864, 1.638970377790498], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-5", 20, 0, 0.0, 422.99999999999994, 274, 829, 322.5, 620.9, 818.6499999999999, 829.0, 2.2851919561243146, 4.7332931044332724, 1.6413659020795246], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-3", 20, 0, 0.0, 297.0999999999999, 263, 388, 292.0, 372.60000000000014, 387.5, 388.0, 1.7559262510974538, 0.30179982440737485, 1.3349497914837576], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-2", 20, 0, 0.0, 293.50000000000006, 272, 379, 289.0, 324.6, 376.4, 379.0, 1.756388864494599, 0.3018793360850092, 1.3318710481250549], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-1", 20, 0, 0.0, 118.64999999999998, 41, 398, 99.5, 198.0, 387.9999999999999, 398.0, 1.7921146953405018, 73.67709033378136, 1.2837071572580645], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-0", 20, 0, 0.0, 457.1, 370, 716, 421.5, 630.6000000000003, 712.3499999999999, 716.0, 1.7371666811430557, 11.391674085816033, 1.3257771106575176], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-5", 20, 0, 0.0, 512.6, 277, 1539, 363.5, 828.0, 1503.4999999999995, 1539.0, 0.300187617260788, 0.0513015947467167, 0.228218808630394], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-4", 20, 0, 0.0, 489.8, 279, 1010, 364.0, 897.3000000000002, 1004.6499999999999, 1010.0, 0.3002642325246217, 0.051901141754744175, 0.22827705568400192], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-3", 20, 0, 0.0, 458.8, 274, 1011, 355.0, 741.1, 997.6499999999999, 1011.0, 0.30018311169813583, 0.0515939723231171, 0.22821538325878785], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-2", 20, 0, 0.0, 372.1000000000001, 279, 847, 333.0, 628.6000000000005, 837.2499999999999, 847.0, 0.3002552169343943, 0.05160636541059901, 0.22768376557573938], "isController": false}, {"data": ["Test", 10, 0, 0.0, 6933.2, 5352, 8669, 6761.5, 8606.8, 8669.0, 8669.0, 0.6288121738036848, 304.08840902659875, 16.905467914858832], "isController": true}, {"data": ["https://blazedemo.com/confirmation.php-1", 20, 0, 0.0, 322.1, 48, 1220, 169.0, 749.6, 1196.6499999999996, 1220.0, 0.3012320390396723, 12.384196284679337, 0.2157750982769527], "isController": false}, {"data": ["https://blazedemo.com/reserve.php", 20, 0, 0.0, 1398.7, 629, 3913, 1183.5, 2537.1000000000013, 3847.499999999999, 3913.0, 1.779042874933286, 259.731573007472, 7.654748932574274], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-0", 20, 0, 0.0, 710.8499999999999, 387, 1717, 677.0, 938.9000000000002, 1678.5499999999995, 1717.0, 0.2995402057841214, 1.6907640521799037, 0.2593187426051011], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 420, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
