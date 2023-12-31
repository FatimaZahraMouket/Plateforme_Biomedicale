import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

const PredictionChart = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      const chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: data.map(prediction => prediction.date),
          datasets: [
            {
              label: 'Predictions',
              data: data.map(prediction => prediction.prediction),
              backgroundColor: 'rgba(75,192,192,0.4)',
              borderColor: 'rgba(75,192,192,1)',
              borderWidth: 1,
              pointRadius: 3,
              pointHoverRadius: 5,
            },
          ],
        },
        options: {
          scales: {
            x: {
              type: 'time',
              time: {
                unit: 'day',
              },
            },
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }
  }, [data]);

  return <canvas ref={chartRef} />;
};

export default PredictionChart;
