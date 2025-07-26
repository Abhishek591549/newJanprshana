import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto"; // ✅ Automatically registers all chart types

export default function CardBarChart() {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    // Clean up previous chart instance if it exists
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [
          {
            label: new Date().getFullYear().toString(),
            data: [30, 78, 56, 34, 100, 45, 13],
            backgroundColor: "#ed64a6",
            barThickness: 20,
          },
          {
            label: (new Date().getFullYear() - 1).toString(),
            data: [27, 68, 86, 74, 10, 4, 87],
            backgroundColor: "#4c51bf",
            barThickness: 20,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: "#666",
            },
          },
          title: {
            display: false,
            text: "Orders Chart",
          },
        },
        scales: {
          x: {
            grid: {
              color: "rgba(33, 37, 41, 0.1)",
            },
          },
          y: {
            beginAtZero: true,
            grid: {
              color: "rgba(33, 37, 41, 0.1)",
            },
          },
        },
      },
    });

    chartInstanceRef.current = chart;

    // Cleanup on unmount
    return () => {
      chart.destroy();
    };
  }, []);

  return (
    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
      <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
        <div className="flex flex-wrap items-center">
          <div className="relative w-full max-w-full flex-grow flex-1">
            <h6 className="uppercase text-blueGray-400 mb-1 text-xs font-semibold">
              Performance
            </h6>
            <h2 className="text-blueGray-700 text-xl font-semibold">
              Total Orders
            </h2>
          </div>
        </div>
      </div>
      <div className="p-4 flex-auto">
        <div className="relative h-96">
          <canvas ref={chartRef}></canvas>
        </div>
      </div>
    </div>
  );
}
