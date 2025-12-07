import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-moment";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Filler,
} from "chart.js";
import Web3 from "web3";
import { useData } from "../contexts/DataContext";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Filler
);

interface Props {
  questionId: string;
}

const HeroChart: React.FC<Props> = ({ questionId }) => {
  const { polymarket } = useData();
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    // Function to generate realistic looking mock data (Kalshi style)
    const generateMockData = () => {
      const now = Date.now();
      const day = 24 * 60 * 60 * 1000;
      
      // Hardcoded beautiful trend for MVP
      // 30 days of data
      const points = [
        20, 21, 20, 22, 21, 23, 22, // Week 1: Low/Stable
        25, 35, 42, 45, 44, 46, 45, // Week 2: Jump up
        45, 46, 45, 47, 55, 62, 65, // Week 3: Another rise
        64, 66, 68, 70, 72, 71, 73, 75 // Week 4: Strong finish
      ];

      const dataPointsYes = points.map((val, i) => ({
        x: now - (29 - i) * day,
        y: val
      }));

      const dataPointsNo = points.map((val, i) => ({
        x: now - (29 - i) * day,
        y: 100 - val
      }));
      
      return {
        datasets: [
          {
            label: "Yes",
            data: dataPointsYes,
            borderColor: "#16a34a", // Tailwind Green 600
            backgroundColor: (context: any) => {
              const ctx = context.chart.ctx;
              const gradient = ctx.createLinearGradient(0, 0, 0, 300);
              gradient.addColorStop(0, "rgba(22, 163, 74, 0.15)");
              gradient.addColorStop(1, "rgba(22, 163, 74, 0)");
              return gradient;
            },
            borderWidth: 3,
            pointRadius: 0,
            pointHoverRadius: 6,
            pointBackgroundColor: "#16a34a",
            fill: true,
            tension: 0.3,
          },
          {
            label: "No",
            data: dataPointsNo,
            borderColor: "#2563eb", // Tailwind Blue 600
            backgroundColor: "transparent",
            borderWidth: 3,
            pointRadius: 0,
            pointHoverRadius: 6,
            pointBackgroundColor: "#2563eb",
            fill: false,
            tension: 0.3,
            borderDash: [5, 5], // Dashed line for No to distinguish
          },
        ],
      };
    };

    setChartData(generateMockData());

  }, [questionId]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true, // Show legend now
        position: "top" as const,
        align: "end" as const,
        labels: {
          boxWidth: 10,
          usePointStyle: true,
          pointStyle: "circle",
          font: {
            size: 11,
            weight: "bold",
          },
        },
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
        backgroundColor: "white",
        titleColor: "#111827",
        bodyColor: "#111827",
        borderColor: "#E5E7EB",
        borderWidth: 1,
        padding: 10,
        displayColors: true,
        callbacks: {
          label: function (context: any) {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(0)}%`;
          },
        },
      },
    },
    scales: {
      x: {
        type: "time" as const,
        time: {
          unit: "month" as const,
          displayFormats: {
            month: "MMM",
          },
        },
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: "#9CA3AF",
          font: {
            size: 11,
          },
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 4,
        },
        border: {
          display: false,
        },
      },
      y: {
        min: 0,
        max: 100,
        grid: {
          color: "#F3F4F6",
          borderDash: [4, 4],
          drawBorder: false,
        },
        ticks: {
          stepSize: 25,
          color: "#9CA3AF",
          font: {
            size: 11,
          },
          callback: function (value: any) {
            return value + "%";
          },
          padding: 10,
        },
        position: "right" as const,
        border: {
          display: false,
        },
      },
    },
    interaction: {
      mode: "nearest" as const,
      axis: "x" as const,
      intersect: false,
    },
    elements: {
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
      },
    },
  };

  if (!chartData) return <div className="w-full h-full animate-pulse bg-gray-50 rounded-xl" />;

  return <Line options={options} data={chartData} />;
};

export default HeroChart;
