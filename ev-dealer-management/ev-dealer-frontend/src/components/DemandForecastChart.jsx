import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
} from "recharts";
import { reportService } from "../services/reportService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const DemandForecastChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchForecastData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Lấy đồng thời dữ liệu lịch sử và dữ liệu dự báo
        const [historicalData, forecastResult] = await Promise.all([
          reportService.getSalesSummary(), // Lấy doanh số thực tế
          reportService.getDemandForecast(), // Lấy dự báo
        ]);

        // 2. Hợp nhất dữ liệu
        const combinedData = new Map();

        // Xử lý dữ liệu lịch sử
        if (historicalData && Array.isArray(historicalData.salesData)) {
          historicalData.salesData.forEach((item) => {
            const period = new Date(item.period).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            });
            if (!combinedData.has(period)) {
              combinedData.set(period, { period, actualSales: 0 });
            }
            combinedData.get(period).actualSales += item.totalSales;
          });
        }

        // Xử lý dữ liệu dự báo
        if (forecastResult && Array.isArray(forecastResult.forecastData)) {
          forecastResult.forecastData.forEach((item) => {
            const period = new Date(item.period).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            });
            if (!combinedData.has(period)) {
              combinedData.set(period, { period });
            }
            combinedData.get(period).forecast = item.forecastedValue;
            combinedData.get(period).confidenceRange = [
              item.confidenceLowerBound,
              item.confidenceUpperBound,
            ];
          });
        }

        // Chuyển Map thành mảng và sắp xếp theo ngày
        const sortedData = Array.from(combinedData.values()).sort(
          (a, b) => new Date(a.period) - new Date(b.period)
        );

        setChartData(sortedData);
      } catch (err) {
        setError(err.message || "Failed to fetch forecast data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchForecastData();
  }, []);

  if (loading) {
    return <div>Loading forecast...</div>; // Sẽ thay thế bằng Skeleton Loader
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Demand Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI-Powered Demand Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="actualSales"
              stroke="#8884d8" // Màu tím cho đường thực tế
              name="Doanh số thực tế"
            />
            <Line
              type="monotone"
              dataKey="forecast"
              stroke="#82ca9d" // Màu xanh cho đường dự báo
              strokeDasharray="5 5"
              name="Forecast"
            />
            <Area
              type="monotone"
              dataKey="confidenceRange"
              stroke="none"
              fill="#82ca9d"
              fillOpacity={0.2} // Vùng màu xanh mờ cho khoảng tin cậy
              name="Confidence"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default DemandForecastChart;
