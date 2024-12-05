import React, { useEffect } from 'react';
import ChartContainer from '../../ChartContainer';
import BarChart from '../../BarChart';
import { Dimension, Measure, DataResponse } from '@embeddable.com/core';

// Define component props
type Props = {
  title?: string;
  xAxisGranularity?: string;
  showLegend?: boolean;
  ds?: Dataset;
  xAxis?: Dimension; // X-axis details (e.g., name, title)
  metrics?: Measure; // Metrics for the bar chart
  results?: DataResponse; // Data response containing loading state, errors, and data
  showLabels?: boolean;
  yAxisMin?: number;
  maxSegments?: number;
  displayHorizontally?: boolean;
};

const StackedBarChart: React.FC<Props> = (props) => {
  const { results, title, displayHorizontally } = props;

  useEffect(() => {
    // For debugging
    console.log('StackedBarChart Props:', props);
  }, [props]);

  return (
    <ChartContainer title={title} results={results}>
      <BarChart
        {...props}
        isBasicStackedComponent
        displayHorizontally={displayHorizontally}
      />
    </ChartContainer>
  );
};

export default StackedBarChart;
