queue()
    .defer(d3.csv, "../data/data-winemag-europe.csv")
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

    priceAndPointsByCountry(ndx)

    dc.renderAll();
}


function averageScoreByCountry(ndx) {
    let countryDim = ndx.dimension(dc.pluck("country"));
    let pointsGroup = countryDim.group().reduce(
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
    let averageScoreByCountryBar = dc.barChart("#average-points-by-country")
    averageScoreByCountryBar
        .width(1000)
        .height(300)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .dimension(countryDim)
        .group(pointsGroup)
        .valueAccessor(function(p) {
            return p.value.average;
        })
        .y(d3.scale.linear().domain([80, 95]))
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Points by Country")
        .transitionDuration(800)
        .yAxis().ticks(10);
}

function averagePriceByCountry(ndx) {
    let countryDim = ndx.dimension(dc.pluck("country"));
    let priceGroup = countryDim.group().reduce(
        function(p, v) {
            p.count++;
            p.total += +v.price;
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
                p.total -= +v.price;

                p.average = p.total / p.count;
            }
            return p;
        },
        function() {
            return { count: 0, total: 0, average: 0 };
        }
    );
    let averagePriceByCountryBar = dc.barChart("#average-price-by-country")
    averagePriceByCountryBar
        .width(1000)
        .height(300)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .dimension(countryDim)
        .group(priceGroup)
        .valueAccessor(function(p) {
            return p.value.average;
        })
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Price by Country")
        .transitionDuration(800)
        .elasticY(true)
        .yAxisPadding('10%')
        .yAxis().ticks(5);

}

function averagePointsByTaster(ndx) {
    let tasterDim = ndx.dimension(dc.pluck("taster_name"));
    let pointsGroup = tasterDim.group().reduce(
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
    let averagePointsByTasterBar = dc.barChart("#average-points-by-taster")
    averagePointsByTasterBar
        .width(1000)
        .height(300)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .dimension(tasterDim)
        .group(pointsGroup)
        .valueAccessor(function(p) {
            return p.value.average;
        })
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Points by taster")
        .transitionDuration(800)
        .y(d3.scale.linear().domain([80, 95]))
        .yAxis().ticks(5);
}

function averagePointsByYear(ndx) {
    let yearDim = ndx.dimension(dc.pluck("year"));
    let pointsGroup = yearDim.group().reduce(
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
    let averagePointsByYearBar = dc.barChart("#average-points-by-year")
    averagePointsByYearBar
        .width(1000)
        .height(300)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .dimension(yearDim)
        .group(pointsGroup)
        .valueAccessor(function(p) {
            return p.value.average;
        })
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Points by year")
        .transitionDuration(800)
        .y(d3.scale.linear().domain([80, 100]))
        .yAxis().ticks(5);
}

function averagePriceByYear(ndx) {
    let yearDim = ndx.dimension(dc.pluck("year"));
    let priceGroup = yearDim.group().reduce(
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
    let averagePriceByYearBar = dc.barChart("#average-price-by-year")
    averagePriceByYearBar
        .width(1000)
        .height(300)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .dimension(yearDim)
        .group(priceGroup)
        .valueAccessor(function(p) {
            return p.value.average;
        })
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Price by year")
        .transitionDuration(800)
        .elasticY(true)
        .yAxis().ticks(5);
}

function scatterPriceByPoints(ndx) {
    let priceDim = ndx.dimension(function(d) {
        return [d.price, d.points];
    });
    let pointsGroup = priceDim.group();

    let pointsByPriceScatter = dc.scatterPlot("#points-by-price-scatter");
    pointsByPriceScatter
        .width(1000)
        .height(480)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .x(d3.scale.linear().domain([0, 300]))
        .y(d3.scale.linear().domain([70, 100]))
        .brushOn(false)
        .symbolSize(1)
        .clipPadding(100)
        .xAxisLabel("Price")
        .yAxisLabel("Points")
        .dimension(priceDim)
        .group(pointsGroup);
}


function scatterPointsByLength_description(ndx) {
    let length_descriptionDim = ndx.dimension(function(d) {
        return [d.length_description, d.points];
    });
    let pointsGroup = length_descriptionDim.group();

    let pointsByLength_descriptionScatter = dc.scatterPlot("#points-by-length_description-scatter");
    pointsByLength_descriptionScatter
        .width(1000)
        .height(480)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .x(d3.scale.linear().domain([0, 600]))
        .y(d3.scale.linear().domain([70, 100]))
        .brushOn(false)
        .symbolSize(2)
        .clipPadding(100)
        .xAxisLabel("Points")
        .yAxisLabel("Description length")
        .dimension(length_descriptionDim)
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
        .width(768)
        .height(480)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .dimension(tasterDim)
        .group(pointsGroup)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .transitionDuration(800)
        .y(d3.scale.linear().domain([70, 100]))
        .yAxis().ticks(5);
}


function showSelectMenu(ndx) {
    let countryDim = ndx.dimension(dc.pluck('country'));
    let countryGroup = countryDim.group();

    let selectByCountry = countryDim.group().reduceCount();

    dc.selectMenu('#select-by-country')
        .dimension(countryDim)
        .group(countryGroup);

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
        .height(200)
        .width(960)
        .dimension(countryDim)
        .group(priceByCountry)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .shareTitle(false)
        .elasticX(true)
        .elasticY(true)
        .yAxisLabel("Monthly Index Average")
        .rightYAxisLabel("Monthly Index Move")
        .renderHorizontalGridLines(true)
        .yAxisPadding('10%')
        .compose([
            dc.barChart(priceAndPointsByCountryComposite)
            .valueAccessor(function(p) {
                return p.value.average;
            })
            .colors('green')
            .gap(200)
            .centerBar(true)
            .group(pointsByCountry, 'points')
            .useRightYAxis(true),
            dc.barChart(priceAndPointsByCountryComposite)
            .valueAccessor(function(p) {
                return p.value.average;
            })
            .colors('red')
            .gap(200)
            .centerBar(true)
            .group(priceByCountry, 'price')
        ])
        .brushOn(false)
    priceAndPointsByCountryComposite
        .renderlet(function(chart) {
            chart.selectAll("g._2").attr("transform", "translate(" + 40 + ", 0)");
            chart.selectAll("g._1").attr("transform", "translate(" + 20 + ", 0)");
            chart.selectAll("g._0").attr("transform", "translate(" + 1 + ", 0)");
        });

}
