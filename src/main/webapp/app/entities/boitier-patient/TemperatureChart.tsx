import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

interface TemperatureEntry {
  date: string;
  temperature: number;
  color?: string; // Optional color property
}

interface TemperatureChartProps {
  data: TemperatureEntry[];
}

const TemperatureChart: React.FC<TemperatureChartProps> = ({ data }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart<'line'> | null>(null);

  useEffect(() => {
    if (chartRef.current && data) {
      const ctx = chartRef.current.getContext('2d');
      if (!ctx) return;

      if (!chartInstance.current) {
        // If no chart instance exists, create a new one
        chartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: data.flatMap(entry => entry.date),
            datasets: [
              {
                label: 'Actual temperatures',
                data: data.flatMap(entry => entry.temperature),
                borderColor: 'blue',
                borderWidth: 2,
                fill: false,
              },
            ],
          },
          options: {
            scales: {
              x: {
                type: 'category',
                labels: data.map(entry => entry.date),
              },
              y: {
                beginAtZero: true,
                max: 50,
              },
            },
          },
        });
      } else {
        // Update the labels with the existing dates and the last three new dates
        const existingDates = chartInstance.current.data.labels;
        const newDates = data.map(entry => entry.date).slice(-3);
        //const a=[...existingDates, ...newDates];
        const newData = [
          ...existingDates,
          ...newDates
        ];
        (chartInstance.current.options.scales.x as any).labels = [...existingDates, ...newDates];
        console.log(data.map(entry => entry.temperature));

        // Update the chart
        chartInstance.current.data.datasets.push({
          label: `Predicted temperature`,
          data: data.map(entry => entry.temperature),
          borderColor: 'orange', // Change color as needed
          borderWidth: 2,
          fill: false,
        });

        // Highlight the last three dates in red
        const b=data.map(entry => entry.temperature);
        const datasetIndex = chartInstance.current.data.datasets.length - 1; // Index of the last dataset
        console.log(newData.slice(-3))
        chartInstance.current.data.datasets[datasetIndex].pointBackgroundColor = newData.map(date => {
          console.log(date)
          return newData.slice(-3).includes(date) ? 'red' : 'transparent';
        });

        // Update the chart
        chartInstance.current.update();
      }

    }
  }, [data]);

  return <canvas ref={chartRef} />;
};

export default TemperatureChart;
