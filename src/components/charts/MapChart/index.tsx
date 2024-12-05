import React, { useMemo, useRef, useEffect, useState } from 'react';
import { Dimension, Measure, DataResponse } from '@embeddable.com/core';
import { scaleLinear } from 'd3-scale';
import { interpolateHcl } from 'd3-interpolate';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

import Container from '../../Container';
import Spinner from '../../Spinner';
import useDarkMode from '../../util/useDarkMode';
import geography from './geography-usa.json';

type Props = {
  title?: string;
  db: DataResponse;
  segments?: Dimension;
  statuses?: Dimension;
  metric?: Measure;
};

const formatter = new Intl.NumberFormat();

// Color configurations
const COLORS = {
  default: '#E5F3FA',
  low: '#9EC6E1',
  high: '#67A2D8',
  hover: '#4D8FBA',
  darkModeDefault: '#374151',
  darkModeHover: '#1F2937',
};
const darkModeBlueScale = ['#13314B', '#1E4E77', '#2A6BA4', '#3988CD'];
const darkModeOutlineColor = '#374151';

// Status-to-color mapping
const statusColors: Record<string, string> = {
  'Label Created': '#6A7280',
  'In Transit': '#3B82F6',
  'Out for Delivery': '#6466F2',
  'Delivered': '#20C55E',
  'Delayed': '#EBB303',
  'Weather Delay': '#F97317',
  'Exception': '#EF4445',
  'Voided': '#EC4899',
};

// State code to FIPS mapping
const stateCodeToNumberMapping: Record<string, string> = {
  AL: '01', AK: '02', AZ: '04', AR: '05', CA: '06', CO: '08', CT: '09', DE: '10', DC: '11',
  FL: '12', GA: '13', HI: '15', ID: '16', IL: '17', IN: '18', IA: '19', KS: '20', KY: '21',
  LA: '22', ME: '23', MD: '24', MA: '25', MI: '26', MN: '27', MS: '28', MO: '29', MT: '30',
  NE: '31', NV: '32', NH: '33', NJ: '34', NM: '35', NY: '36', NC: '37', ND: '38', OH: '39',
  OK: '40', OR: '41', PA: '42', RI: '44', SC: '45', SD: '46', TN: '47', TX: '48', UT: '49',
  VT: '50', VA: '51', WA: '53', WV: '54', WI: '55', WY: '56', PR: '72',
};

const MapChart: React.FC<Props> = (props) => {
  const { title, db } = props;
  const { isDarkMode, containerRef } = useDarkMode();
  const boxRef = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const [data, setData] = useState<Record<string, { total: number; statuses: Record<string, number> }>>({});
  const [maxMetric, setMaxMetric] = useState<number>(0);
  const [totalPackages, setTotalPackages] = useState<number>(0);

  // Aggregates data by state and status
  useEffect(() => {
    const aggregatedData: typeof data = {};
    let maxMetricValue = 0;
    let totalPackagesValue = 0;

    db.data?.forEach((record) => {
      const state = record['status_count_by_state.state'];
      const status = record['status_count_by_state.status'];
      const count = parseInt(record['status_count_by_state.status_count'], 10);

      if (state) {
        if (!aggregatedData[state]) {
          aggregatedData[state] = { total: 0, statuses: {} };
        }
        aggregatedData[state].total += count;
        totalPackagesValue += count;
        maxMetricValue = Math.max(maxMetricValue, aggregatedData[state].total);

        if (status) {
          aggregatedData[state].statuses[status] = (aggregatedData[state].statuses[status] || 0) + count;
        }
      }
    });

    setData(aggregatedData);
    setMaxMetric(maxMetricValue);
    setTotalPackages(totalPackagesValue);
  }, [db.data]);

  // Constructs color scale based on dark mode and metric range
  const colorScale = useMemo(() => {
    return scaleLinear()
      .domain([0, maxMetric])
      .range(isDarkMode ? [darkModeBlueScale[0], darkModeBlueScale[3]] : [COLORS.low, COLORS.high])
      .interpolate(interpolateHcl);
  }, [maxMetric, isDarkMode]);

  // Updates the tooltip position dynamically
  const updateTooltipPosition = (e: React.MouseEvent) => {
    if (boxRef.current && tooltipRef.current) {
      const { left, top } = boxRef.current.getBoundingClientRect();
      tooltipRef.current.style.left = `${e.clientX - left + 15}px`;
      tooltipRef.current.style.top = `${e.clientY - top - 29}px`;
    }
  };

  // Handles state click to navigate to the filtered URL
  const handleStateClick = (stateCode: string) => {
    const dateRange = localStorage.getItem('dateRange');
    const carrier = localStorage.getItem('carrier');
    let url = `/packages?state=${stateCode}`;

    if (dateRange) {
      const { from, to } = JSON.parse(dateRange);
      url += `&from=${from}&to=${to}`;
    }

    if (carrier && carrier !== 'All') {
      url += `&carrier=${encodeURIComponent(carrier)}`;
    }

    window.location.href = url;
  };

  return (
    <div ref={containerRef} className="map-chart-container">
      <Container title={title} results={db} showSpinner={false}>
        <div className="flex justify-center items-start">
          <div className="relative w-full max-w-6xl h-3/4">
            <div ref={boxRef} className="relative w-full h-full" onMouseMove={updateTooltipPosition}>
              <div
                ref={tooltipRef}
                className="absolute flex flex-col text-gray-800 bg-gray-100/90 rounded whitespace-nowrap pointer-events-none shadow-md px-2 py-1 text-sm dark:bg-gray-850 dark:text-gray-200"
              />
              <ComposableMap
                projection="geoAlbersUsa"
                projectionConfig={{ scale: 1000, translate: [800, 450] }}
                style={{ width: '100%', height: 'auto' }}
              >
                <Geographies geography={geography}>
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      const geoId = geo.properties.GEO_ID.split('US')[1];
                      const stateCode = Object.keys(stateCodeToNumberMapping).find(
                        (key) => stateCodeToNumberMapping[key] === geoId
                      );
                      const stateData = data[stateCode] || { total: 0, statuses: {} };
                      const value = stateData.total;

                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          onMouseEnter={() => {
                            tooltipRef.current!.innerHTML = `<strong>${geo.properties.NAME}</strong><br>Total Packages: ${formatter.format(
                              value
                            )}`;
                          }}
                          onMouseLeave={() => {
                            tooltipRef.current!.innerHTML = '';
                          }}
                          onClick={() => handleStateClick(stateCode || '')}
                          style={{
                            default: {
                              fill: value ? colorScale(value) : COLORS.default,
                              stroke: isDarkMode ? darkModeOutlineColor : '#9BA3AF',
                              strokeWidth: 0.5,
                            },
                            hover: {
                              fill: COLORS.hover,
                              stroke: isDarkMode ? darkModeOutlineColor : '#9BA3AF',
                            },
                            pressed: {
                              fill: COLORS.hover,
                              stroke: isDarkMode ? darkModeOutlineColor : '#9BA3AF',
                            },
                          }}
                        />
                      );
                    })
                  }
                </Geographies>
              </ComposableMap>
            </div>
            <Spinner
              show={db.isLoading}
              className="absolute inset-0 m-auto h-25 w-24 text-gray-300 dark:text-gray-600"
            />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default MapChart;
