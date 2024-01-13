import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

const PredictionChart = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      // Extract all unique dates from both datasets
      const allDates = Array.from(new Set(data.flatMap(prediction => prediction.date)));

      // Create a map to store prediction values for each date
      const predictionMap = new Map();
      data.forEach(prediction => {
        predictionMap.set(prediction.date, prediction.prediction);
      });

      // Create an array of prediction values, aligning with allDates
      const allPredictions = allDates.map(date => predictionMap.get(date) || null);

      const ctx = chartRef.current.getContext('2d');
      const chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: allDates,
          datasets: [
            {
              label: 'Predictions',
              data: allPredictions,
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
