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
    const fetchGraphData = async () => {
      if (!polymarket) return;

      try {
        const data = await polymarket.methods.getGraphData(questionId).call();
        
        // Process data to calculate probability over time
        // We need to merge yes and no bets by timestamp to calculate the ratio at each point
        // For simplicity in this MVP, we'll iterate through YES bets and find the cumulative totals
        
        const yesBets = data["0"].map((item: any) => ({
          amount: parseFloat(Web3.utils.fromWei(item[1], "ether")),
          time: parseInt(item[2]) * 1000,
        }));
        
        const noBets = data["1"].map((item: any) => ({
          amount: parseFloat(Web3.utils.fromWei(item[1], "ether")),
          time: parseInt(item[2]) * 1000,
        }));

        // Combine all timestamps and sort
        const allTimestamps = Array.from(
          new Set([...yesBets.map((b: any) => b.time), ...noBets.map((b: any) => b.time)])
        ).sort((a: any, b: any) => a - b);

        let cumYes = 0;
        let cumNo = 0;
        const probabilityData: { x: number; y: number }[] = [];

        allTimestamps.forEach((ts) => {
          // Add bets that happened at or before this timestamp (actually, just at this timestamp since we iterate all)
          // Optimization: This is O(N*M), could be O(N) with pointers, but N is small for MVP
          const yesAtTime = yesBets.filter((b: any) => b.time === ts).reduce((a: any, b: any) => a + b.amount, 0);
          const noAtTime = noBets.filter((b: any) => b.time === ts).reduce((a: any, b: any) => a + b.amount, 0);
          
          cumYes += yesAtTime;
          cumNo += noAtTime;

          if (cumYes + cumNo > 0) {
            const prob = (cumYes / (cumYes + cumNo)) * 100;
            probabilityData.push({ x: ts as number, y: prob });
          }
        });

        // If no data, add a dummy point
        if (probabilityData.length === 0) {
            probabilityData.push({ x: Date.now(), y: 50 });
        }

        setChartData({
          datasets: [
            {
              label: "Yes Probability",
              data: probabilityData,
              borderColor: "#00C08B", // Kalshi Green-ish
              backgroundColor: (context: any) => {
                const ctx = context.chart.ctx;
                const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                gradient.addColorStop(0, "rgba(0, 192, 139, 0.2)");
                gradient.addColorStop(1, "rgba(0, 192, 139, 0)");
                return gradient;
              },
              borderWidth: 2,
              pointRadius: 0,
              pointHoverRadius: 4,
              fill: true,
              tension: 0.1, // Slight curve
            },
          ],
        });

      } catch (error) {
        console.error("Error fetching graph data:", error);
      }
    };

    fetchGraphData();
  }, [questionId, polymarket]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        titleColor: "#1F2937",
        bodyColor: "#1F2937",
        borderColor: "#E5E7EB",
        borderWidth: 1,
        callbacks: {
          label: function (context: any) {
            return `Yes: ${context.parsed.y.toFixed(1)}%`;
          },
        },
      },
    },
    scales: {
      x: {
        type: "time" as const,
        time: {
          unit: "day" as const,
          displayFormats: {
            day: "MMM D",
          },
        },
        grid: {
          display: false,
        },
        ticks: {
          color: "#9CA3AF",
          font: {
            size: 10,
          },
        },
      },
      y: {
        min: 0,
        max: 100,
        grid: {
          color: "#F3F4F6",
          borderDash: [5, 5],
        },
        ticks: {
          stepSize: 25,
          color: "#9CA3AF",
          font: {
            size: 10,
          },
          callback: function (value: any) {
            return value + "%";
          },
        },
        position: "right" as const,
      },
    },
    interaction: {
      mode: "nearest" as const,
      axis: "x" as const,
      intersect: false,
    },
  };

  if (!chartData) return <div className="w-full h-full animate-pulse bg-gray-100 rounded-xl" />;

  return <Line options={options} data={chartData} />;
};

export default HeroChart;
