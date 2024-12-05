import { EmbeddedComponentMeta, Inputs, defineComponent } from '@embeddable.com/react';
import { Dataset, Dimension, Measure, loadData } from '@embeddable.com/core';

import Component from './index';

export const meta: EmbeddedComponentMeta = {
    name: 'BasicStackedBarComponent',
    label: 'Stacked Bar',
    inputs: [
        {
            name: 'title',
            type: 'string',
            label: 'Title',
            description: 'The title for the chart'
        },
        {
            name: 'ds',
            type: 'dataset',
            label: 'Dataset',
            description: 'Dataset'
        },
        {
            name: 'xAxis',
            type: 'dimension',
            label: 'X-Axis',
            config: {
                dataset: 'ds',
                supportedTypes: ['time']
            }
        },
        {
            name: 'xAxisGranularity',
            type: 'granularity',
            label: 'Granularity',
        },
        {
            name: 'segment',
            type: 'dimension',
            label: 'Segment',
            config: {
                dataset: 'ds'
            }
        },
        {
            name: "metrics",
            type: "measure",
            label: "Metrics",
            config: {
                dataset: "ds",
            },
        },
        {
            name: 'showLegend',
            type: 'boolean',
            label: 'Show legend',
            defaultValue: true,
        },
        {
            name: 'maxSegments',
            type: 'number',
            label: 'Max Legend Items',
            defaultValue: 8,
        },
        {
            name: 'showLabels',
            type: 'boolean',
            label: 'Show Labels'
        },
        {
            name: 'yAxisMin',
            type: 'number',
            label: 'Y-Axis minimum value',
            defaultValue: 0,
        },
        {
            name: 'displayHorizontally',
            type: 'boolean',
            label: 'Display Horizontally',
        },
        {
            name: 'displayAsPercentage',
            type: 'boolean',
            label: 'Display as Percentages',
        },
    ],
    events: [
        {
            name: 'onChange',
            label: 'Change',
            properties: [
                {
                    name: 'value',
                    type: 'string'
                }
            ]
        }
    ]
} as const satisfies EmbeddedComponentMeta;

export default defineComponent(Component, meta, {
    props: (inputs: Inputs<typeof meta>) => {
        return {
            ...inputs,
            results: loadData({
                from: inputs.ds,
                timeDimensions: [
                    {
                        dimension: inputs.xAxis?.name,
                        granularity: inputs.xAxisGranularity
                    }
                ],
                dimensions: [inputs.segment],
                measures: [inputs.metrics],
                limit: 10000
            })
        };
    },
    events: {
        onChange: (value) => ({value: value || Value.noFilter()})
    }
});