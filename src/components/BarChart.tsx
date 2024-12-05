// @ts-ignore
import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Bar } from 'react-chartjs-2';
import { Dimension, Measure, Dataset } from "@embeddable.com/core";
import { DataResponse } from "@embeddable.com/react";
import { COLORS, EMB_FONT, SMALL_FONT_SIZE, LIGHT_FONT } from './constants';
import { truncateString } from './util/utilFunctions.js';
import useDarkMode from './util/useDarkMode.js';


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ChartDataLabels
);

//global chart settings
ChartJS.defaults.font.size = parseInt(SMALL_FONT_SIZE);
ChartJS.defaults.color = LIGHT_FONT;
ChartJS.defaults.font.family = EMB_FONT;
ChartJS.defaults.plugins.tooltip.enabled = true;

// Define Tailwind grey colors
const LIGHT_GREY = '#D1D5DB'; // Tailwind text-gray-300 for dark mode text
const DARK_GREY = '#4B5563'; // Tailwind gray-600 for dark mode lines

const chartOptions = (showLegend, showLabels, yAxisMin, displayHorizontally, isBasicStackedComponent, stackMetrics, displayAsPercentage, isDarkMode) => ({
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: displayHorizontally ? 'y' : 'x', //set to 'y' to make a horizontal barchart
    layout: {
        padding: {
            left: 0,
            right: 0,
            top: showLabels ? 20 : 0, //Added so the highest data labels fits
            bottom: 0
        }
    },
    scale: {
        ticks: {
            precision: 0, //rounding for y-axis values
        },
    },
    scales: {
        y: {
            stacked: isBasicStackedComponent || stackMetrics,
            min: yAxisMin,
            grace: '0%',
            grid: {
                display: true,
                color: function(context) {
                    if (context.tick.value === 0) {
                        return isDarkMode ? DARK_GREY : 'rgba(0, 0, 0, 0.1)'; // This is the axis line color
                    } else {
                        return isDarkMode ? DARK_GREY : 'rgba(0, 0, 0, 0.1)'; // This is the color for other gridlines
                    }
                }
            },
            ticks: { //https://www.chartjs.org/docs/latest/axes/labelling.html
                color: isDarkMode ? LIGHT_GREY : '#6A7280',

                callback: function(value, index, ticks) {
                    if(displayAsPercentage && !displayHorizontally) {
                        return `${value}%`;
                    } else if (displayHorizontally) {
                        return this.getLabelForValue(value);
                    } else {
                        return value;
                    }
                },
            }
        },
        x: {
            stacked: isBasicStackedComponent || stackMetrics,
            grid: {
                display: false, // display grid lines
            },
            ticks: { //https://www.chartjs.org/docs/latest/axes/labelling.html
                color: isDarkMode ? LIGHT_GREY : '#6A7280',

                callback: function(value, index, ticks) {
                    if(displayAsPercentage && displayHorizontally) {
                        return `${value}%`;
                    } else if (!displayHorizontally) {
                        return this.getLabelForValue(value);
                    } else {
                        return value;
                    }
                },
            },
        }
    },
    animation: {
        duration: 400,
        easing: 'linear',
    },
    plugins: {
        legend: {
            display: true,
            position: 'bottom',
            labels: {
                usePointStyle: true,
                boxHeight: 8,
                color: isDarkMode ? LIGHT_GREY : '#6A7280'
            }
        },
        tooltip: {//https://www.chartjs.org/docs/latest/configuration/tooltip.html
            callbacks: {
                label: function(context) {
                    let label = context.dataset.label || '';
                    if (context.parsed.y !== null) {
                        label += `: ${context.parsed[displayHorizontally ? 'x' : 'y']}`;
                        if (displayAsPercentage) {
                            label += "%";
                        }
                    }
                    return label;
                },
            },
        },
        datalabels: { //https://chartjs-plugin-datalabels.netlify.app/guide/
            anchor: isBasicStackedComponent || stackMetrics ? 'center' : 'end',
            align: isBasicStackedComponent || stackMetrics ?'center' : 'end',
            display: showLabels ? 'auto' : false,
            color: isDarkMode ? LIGHT_GREY : '#6A7280',
            font: {
                size: 12,
                weight: '500'
            },
            textStrokeColor: isDarkMode ? 'rgba(31,41,55, 0.7)' : 'rgba(255, 255, 255, 0.7)',
            textStrokeWidth: 3,
            formatter: function(value, context) {
                return value;
            }
        }
    },
});

const chartStyle = (isStacked) => {
    return {
        barPercentage: 0.6,
        barThickness: 'flex',
        maxBarThickness: 15,
        minBarLength: 0,
        borderRadius: isStacked ? 3 : 6
    }
}

const stackedChartData = (data, xAxis, metrics, segment, maxSegments, displayAsPercentage) => {
    // Ensure data is an array
    if (!Array.isArray(data)) {
        console.error('Data is not an array:', data);
        return { labels: [], datasets: [] };
    }

    const segmentsToInclude = () => {

        const uniqueSegments = [...new Set(data?.map(d => d[segment.name]))];
        if ((uniqueSegments.length <= maxSegments) || !maxSegments || maxSegments < 1) {
            return uniqueSegments;
        } else {
            //reduce to maxSegments, comprising the segments with the highest total and an 'Other' segment merging the longtail segments.
            const segmentTotals = {};
            data?.forEach(d => segmentTotals[d[segment.name]] = ((segmentTotals[d[segment.name]] || 0) + parseInt(d[metrics.name])));
            const summedSegments = Object.keys(segmentTotals).map(item => {
                return {
                    name: item,
                    value: segmentTotals[item]
                }
            }).sort((a, b) => b.value - a.value);
            const segmentsToInclude = summedSegments.slice(0, maxSegments).map(s => s.name);
            segmentsToInclude.push('Other');
            return segmentsToInclude;
        }
    }


    // Format the date labels
    const dateFormatter = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' });
    const labelFormatMap = {};
    data.forEach(d => {
        const originalLabel = d[xAxis.name];
        const formattedLabel = dateFormatter.format(new Date(originalLabel));
        labelFormatMap[originalLabel] = formattedLabel;
    });

    const uniqueFormattedLabels = new Set(Object.values(labelFormatMap));
    const labels = Array.from(uniqueFormattedLabels);

    // Ensure segments is properly initialized
    const segments = segmentsToInclude() || [];


    // Function to build the resultMap
    const buildResultMap = () => {
        const resultMap = {};
        labels.forEach(label => {
            const labelRef = {};
            segments.forEach(s => labelRef[s] = null); // null by default
            resultMap[label] = labelRef;
        });

        data.forEach(d => {
            const originalLabel = d[xAxis.name];
            const formattedLabel = labelFormatMap[originalLabel];
            const segmentName = segments.includes(d[segment.name]) ? d[segment.name] : 'Other';

            if (!resultMap[formattedLabel]) {
                resultMap[formattedLabel] = {};
            }

            resultMap[formattedLabel][segmentName] = (resultMap[formattedLabel][segmentName] || 0) + parseInt(d[metrics.name]);
        });

        // console.log('resultMap', resultMap);
        return resultMap;
    };

    const resultMap = buildResultMap();

    const carrierColors = {
        'UPS': '#FFC405',    // UPS Yellow
        'FedEx': '#4E148C',  // FedEx Purple
        'USPS': '#1F75B8',   // USPS Blue
        'DHL': '#D81836',    // DHL Red
        'OnTrac': '#002863', // OnTrac Blue
        'Other': 'grey'      // Default color for 'Other' segment
    };

    return {
        labels: labels.map(l => truncateString(l)),
        datasets: segments.map((s, i) =>
            ({
                ...chartStyle(true),
                label: s,
                data: labels.map(label => {
                    const segmentValue = resultMap[label][s];
                    return displayAsPercentage && segmentValue !== null //skip null values
                        ? Math.round(((segmentValue * 100) / segments.reduce((accumulator, segment) => resultMap[label][segment] + accumulator,0)))
                        : segmentValue
                }),
                backgroundColor: carrierColors[s] || COLORS[i % COLORS.length], // Use specific color or fallback to default
            })
        ),
    };
}

const chartData = (data, xAxis, metrics) => {
    const labels = data?.map(d => truncateString(d[xAxis.name]));
    return {
        labels,
        datasets: metrics.map((metric, i) =>
            ({
                ...chartStyle(false),
                label: metric.title,
                data: data?.map(d => parseInt(d[metric.name])),
                backgroundColor: COLORS[i % COLORS.length],
            })
        ),
    };
}

type Props = {
    title?: string;
    showLegend?: boolean;
    ds?: Dataset;
    xAxis?: Dimension; // { name, title }
    metrics?: Measure; // [{ name, title }]
    results?: DataResponse; // { isLoading, error, data: [{ <name>: <value>, ... }] }
    showLabels?: boolean;
    yAxisMin?:number;
    isBasicStackedComponent?: boolean;
    segment?: Dimension;
    stackMetrics?: boolean;
    displayAsPercentage?: boolean;
};

export default (props: Props) => {

    const { results, xAxis, metrics, showLegend, showLabels, yAxisMin, displayHorizontally, isBasicStackedComponent, segment, maxSegments, stackMetrics, displayAsPercentage } = props;
    const { data } = results;
    const { isDarkMode, containerRef } = useDarkMode();

    return (
        <Bar
            options={chartOptions(showLegend || false, showLabels || false, yAxisMin, displayHorizontally || false, isBasicStackedComponent || false, stackMetrics, displayAsPercentage, isDarkMode)}
            data={isBasicStackedComponent && segment
                ? stackedChartData(data, xAxis, metrics, segment, maxSegments, displayAsPercentage)
                : chartData(data, xAxis, metrics)}
        />
    );
};