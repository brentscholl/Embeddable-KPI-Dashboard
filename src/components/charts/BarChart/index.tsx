import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartData,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import { DataResponse, Dimension } from '@embeddable.com/core';
import Container from '../../Container';
import { COLORS, EMB_FONT, LIGHT_FONT, SMALL_FONT_SIZE } from '../../constants';
import formatValue from '../../util/format';
import getBarChartOptions from '../../util/getBarChartOptions';
import useDarkMode from '../../util/useDarkMode';

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

// Set global chart.js defaults
ChartJS.defaults.font.size = parseInt(SMALL_FONT_SIZE);
ChartJS.defaults.color = LIGHT_FONT;
ChartJS.defaults.font.family = EMB_FONT;
ChartJS.defaults.plugins.tooltip.enabled = true;

// Props definition
type Props = {
  results: DataResponse; // Chart data
  title: string; // Chart title
  xAxis: Dimension; // X-axis configuration
  metrics: { name: string; title: string }[]; // Metrics to visualize
};

// KPI Bar Chart Component
const BarChart: React.FC<Props> = ({ results, title, xAxis, metrics }) => {
  const { isDarkMode, containerRef } = useDarkMode();

  return (
    <div
      ref={containerRef}
      className="h-full relative font-embeddable text-sm flex flex-col"
    >
      <Container className="overflow-y-hidden" title={title} results={results}>
        {/* Render bar chart */}
        <Bar
          height="100%"
          options={getBarChartOptions({ results, title, xAxis, metrics, stacked: false })}
          data={generateChartData(results, xAxis, metrics)}
        />
      </Container>
    </div>
  );
};

// Generates the data object for the bar chart
const generateChartData = (
  results: DataResponse,
  xAxis: Dimension,
  metrics: { name: string; title: string }[]
): ChartData<'bar'> => {
  const labels = extractLabels(results, xAxis); // X-axis labels

  // Create datasets for each metric
  return {
    labels,
    datasets: metrics.map((metric, i) => ({
      barPercentage: 0.6,
      barThickness: 'flex',
      maxBarThickness: 15,
      minBarLength: 0,
      borderRadius: 6,
      label: metric.title,
      data: results?.data?.map((d) => parseFloat(d[metric.name])) || [],
      backgroundColor: COLORS[i % COLORS.length],
    })),
  };
};

// Extract unique X-axis labels and truncate them if necessary
const extractLabels = (results: DataResponse, xAxis: Dimension): string[] => {
  return [
    ...new Set(
      results?.data?.map((d) =>
        formatValue(d[xAxis?.name || ''], { truncate: 15, meta: xAxis.meta })
      )
    ),
  ] as string[];
};

export default BarChart;
