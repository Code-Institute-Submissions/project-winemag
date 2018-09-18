// --------------------------------------------------------------------------------------------------
//                         JQUERY/JS 
// --------------------------------------------------------------------------------------------------

$(document).ready(function() {
    $('.sidenav').sidenav();
});

// --------------------------------------------------------------------------------------------------
//                         RENDERING THE GRAPHS
// --------------------------------------------------------------------------------------------------

let urlStr = window.location.href;
let n = urlStr.lastIndexOf('/');
let region = urlStr.substring(n+1);

queue()
    .defer(d3.json, '/data'+region)
    .await(makeGraph);

function makeGraph(error, wineData) {
    let ndx = crossfilter(wineData);

    wineData.forEach(function(d) {
        d.year = parseInt(d.year);
        d.length_description = parseInt(d.length_description);
        if (d.taster_name == "") {
            d.taster_name = "unknown"
        }
    });

    priceAndPointsByCountry(ndx);
    showSelectMenuYear(ndx);
    showSelectMenuVariety(ndx);
    boxplotPointsByTaster(ndx);
    winesByCountry(ndx);
    scatterPriceByPoints(ndx)

    dc.renderAll();
}

// --------------------------------------------------------------------------------------------------
//                         GRAPHS
// --------------------------------------------------------------------------------------------------

function scatterPriceByPoints(ndx) {
    let priceDim = ndx.dimension(function(d) {
        return [d.price, d.points];
    });
    let pointsGroup = priceDim.group();

    let pointsByPriceScatter = dc.scatterPlot("#points-by-price-scatter");
    pointsByPriceScatter
        .height(300)
        .width(1200)
        .x(d3.scale.linear().domain([0, 700]))
        .y(d3.scale.linear().domain([70, 100]))
        .brushOn(true)
        .symbolSize(2)
        .clipPadding(0)
        .xAxisLabel("Price")
        .yAxisLabel("Points")
        .dimension(priceDim)
        .group(pointsGroup);
}



function boxplotPointsByTaster(ndx) {
    let tasterDim = ndx.dimension(dc.pluck("taster_name"));

    let pointsGroup = tasterDim.group().reduce(
        function(p, v) {
            points = +v.points;
            if (points != 0 && !isNaN(points)) {
                p.push(points);
            }
            return p;
        },
        function(p, v) {
            points = +v.points;
            if (points != 0 && !isNaN(points)) {
                p.splice(p.indexOf(points), 1);
            }
            return p;
        },
        function() {
            return [];
        }
    );

    let pointsByTasterBoxplot = dc.boxPlot("#points-by-taster-boxplot");
    pointsByTasterBoxplot
        .height(220)
        .width(800)
        .margins({ top: 0, right: 40, bottom: 80, left: 40 })
        .dimension(tasterDim)
        .group(pointsGroup)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .yAxisLabel("Points")
        .transitionDuration(800)
        .y(d3.scale.linear().domain([75, 100]))
        .yAxis().ticks(5);
}


function showSelectMenuYear(ndx) {
    let yearDim = ndx.dimension(dc.pluck('year'));
    let yearGroup = yearDim.group();

    dc.selectMenu('#select-by-year')
        .dimension(yearDim)
        .group(yearGroup);
}

function showSelectMenuVariety(ndx) {
    let varietyDim = ndx.dimension(dc.pluck('variety'));
    let varietyGroup = varietyDim.group();

    dc.selectMenu('#select-by-variety')
        .dimension(varietyDim)
        .group(varietyGroup);
}


function priceAndPointsByCountry(ndx) {
    let countryDim = ndx.dimension(dc.pluck("country"))

    let pointsByCountry = countryDim.group().reduce(
        function(p, v) {
            p.count++;
            p.total += +v.points;
            p.average = p.total / p.count;
            return p;
        },
        function(p, v) {
            p.count--;
            if (p.count == 0) {
                p.total = 0;
                p.average = 0;
            }
            else {
                p.total -= +v.points;

                p.average = p.total / p.count;
            }
            return p;
        },
        function() {
            return { count: 0, total: 0, average: 0 };
        }
    );

    let priceByCountry = countryDim.group().reduce(
        function(p, v) {
            price = +v.price;
            if (price != 0 && !isNaN(price)) {
                p.count++;
                p.total += +v.price;
                p.average = p.total / p.count;
            }
            return p;
        },
        function(p, v) {
            price = +v.price;
            if (price != 0 && !isNaN(price)) {
                p.count--;
                if (p.count == 0) {
                    p.total = 0;
                    p.average = 0;
                }
                else {
                    p.total -= +v.price;

                    p.average = p.total / p.count;
                }
            }
            return p;
        },
        function() {
            return { count: 0, total: 0, average: 0 };
        }
    );



    let priceAndPointsByCountryComposite = dc.compositeChart("#price-and-points-by-country-composite");
    priceAndPointsByCountryComposite
        .width(800)
        .height(200)
        .margins({ top: 0, right: 40, bottom: 60, left: 40 })
        .dimension(countryDim)
        .group(priceByCountry)
        .legend(dc.legend().x(70).y(0).itemHeight(13).gap(5))
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .shareTitle(false)
        .elasticX(true)
        .elasticY(false)
        .y(d3.scale.linear().domain([80, 95]))
        .yAxisLabel("Points")
        .rightYAxisLabel("Price")
        .renderHorizontalGridLines(true)
        .yAxisPadding('0%')
        .compose([
            dc.barChart(priceAndPointsByCountryComposite)
            .valueAccessor(function(p) {
                return p.value.average;
            })
            .colors('#ff6e40')
            .gap(25)
            .centerBar(true)
            .y(d3.scale.linear().domain([80, 95]))
            .group(pointsByCountry, 'points'),
            dc.barChart(priceAndPointsByCountryComposite)
            .valueAccessor(function(p) {
                return p.value.average;
            })
            .colors('#69f0ae')
            .gap(20)
            .centerBar(true)
            .group(priceByCountry, 'price')
            .useRightYAxis(true)
        ])
        .brushOn(false)
    priceAndPointsByCountryComposite
        .renderlet(function(chart) {
            chart.selectAll("g._2").attr("transform", "translate(" + 40 + ", 0)");
            chart.selectAll("g._1").attr("transform", "translate(" + 20 + ", 0)");
            chart.selectAll("g._0").attr("transform", "translate(" + 1 + ", 0)");
        });
}

function winesByCountry(ndx) {
    let countryDim = ndx.dimension(dc.pluck("country"));
    let countByCountry = countryDim.group();

    let winesByCountryPie = dc.pieChart("#wines-by-country-pie");
    winesByCountryPie
        .height(410)
        .radius(205)
        .transitionDuration(800)
        .dimension(countryDim)
        .group(countByCountry)
        .innerRadius(180)
        .legend(dc.legend().legendText(function(d) {return d.name + ": "+ d.data}).x(160).y(38).itemHeight(12).gap(5))
}


