// components/admin/BookingChart.tsx
"use client";

import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function BookingChart() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  
  useEffect(() => {
    if (!chartRef.current) return;
    
    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;
    
    // ทำลาย chart เดิมถ้ามี
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    // ข้อมูลสำหรับแสดง (ตัวอย่าง)
    const data = {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [
        {
          label: "Bookings",
          data: [65, 95, 60, 85, 55, 60, 80, 40, 60, 90, 70, 40],
          backgroundColor: "rgba(79, 70, 229, 0.8)",
          borderColor: "rgba(79, 70, 229, 1)",
          borderWidth: 1,
          borderRadius: 5,
        }
      ]
    };
    
    // สร้าง chart ใหม่
    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              display: true,
            },
            ticks: {
              maxTicksLimit: 5,
            }
          },
          x: {
            grid: {
              display: false,
            }
          }
        },
      }
    });
    
    // Cleanup เมื่อ component unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);
  
  return (
    <div className="w-full h-64">
      <canvas ref={chartRef}></canvas>
    </div>
  );
}