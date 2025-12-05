import React, { useEffect, useRef } from "react";
import Web3 from "web3";
import { useData } from "../../contexts/DataContext";

interface Props {
  questionId: string;
}

interface ChartData {
  time: Date[];
  amount: number[];
}

const ChartContainer: React.FC<Props> = ({ questionId }) => {
  const { polymarket } = useData();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const fetchGraphData = async () => {
    if (!polymarket || !containerRef.current) return;
    if (typeof window === "undefined") return;

    // Load Plotly only on the client to avoid SSR issues with `self`
    const Plotly = require("plotly.js-dist-min");

    var data = await polymarket.methods.getGraphData(questionId).call();
    var yesData: ChartData = {
      time: [],
      amount: [],
    };
    var noData: ChartData = {
      time: [],
      amount: [],
    };
    data["0"].forEach((item: any) => {
      var sum = yesData.amount.reduce((a, b) => a + b, 0);
      yesData.amount.push(
        sum + parseFloat(Web3.utils.fromWei(item[1], "ether"))
      );
      yesData.time.push(new Date(parseInt(item[2] + "000")));
    });
    data["1"].forEach((item: any) => {
      var sum = noData.amount.reduce((a, b) => a + b, 0);
      noData.amount.push(
        sum + parseFloat(Web3.utils.fromWei(item[1], "ether"))
      );
      noData.time.push(new Date(parseInt(item[2] + "000")));
    });

    var yes = {
      x: [...yesData.time],
      y: [...yesData.amount],
      mode: "lines+markers",
      name: "Yes",
    };

    var no = {
      x: [...noData.time],
      y: [...noData.amount],
      mode: "lines+markers",
      name: "No",
    };
    var chartData = [yes, no];

    var layout = {
      margin: { t: 20, r: 10, b: 30, l: 30 },
      legend: { orientation: "h", y: -0.2 },
    };

    await Plotly.newPlot(containerRef.current, chartData, layout, {
      displayModeBar: false,
      responsive: true,
    });
  };

  useEffect(() => {
    fetchGraphData();
  }, [questionId, polymarket]);

  return (
    <>
      <div ref={containerRef} className="w-full h-full" />
    </>
  );
};

export default ChartContainer;
