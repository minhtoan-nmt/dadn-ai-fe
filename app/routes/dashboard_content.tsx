// app/components/home_components/Content.tsx
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Content({ className = "" }) {
  const chartContainerStyle =
    "bg-white rounded-2xl shadow p-6 flex flex-col gap-4";

  // === Sample Data ===
  const studyData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Study Duration (hours)",
        data: [2, 3, 1, 3, 3, 3, 4],
        backgroundColor: "#007bff",
        borderRadius: 5,
      },
    ],
  };

  const tempData = {
    labels: ["13:00", "13:01", "13:02", "13:03", "13:04", "13:05"],
    datasets: [
      {
        label: "Temperature (°C)",
        data: [40, 35, 30, 35, 40, 33],
        borderColor: "green",
        backgroundColor: "rgba(0,255,0,0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const humidityData = {
    labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"],
    datasets: [
      {
        label: "Humidity (%)",
        data: [85, 70, 80, 90, 75, 65],
        borderColor: "purple",
        backgroundColor: "rgba(128,0,128,0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const lightData = {
    labels: ["8:00", "8:05", "8:10", "8:15", "8:20", "8:25", "8:30"],
    datasets: [
      {
        label: "Light Level (lux)",
        data: [100, 80, 90, 120, 100, 90, 70],
        borderColor: "red",
        backgroundColor: "rgba(255,0,0,0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const commonOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: "#eee" } },
    },
  };

  return (
    <div className={`flex flex-col flex-6 p-10 bg-gray-100 gap-8 ${className}`}>
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>

      <div className="grid grid-cols-2 gap-8">
        {/* Study Duration */}
        <div className={chartContainerStyle}>
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-lg text-blue-900">Study Duration</h2>
            <p className="text-sm text-gray-500">This Week ▼</p>
          </div>
          <Bar data={studyData} options={commonOptions} />
          <div className="text-sm text-gray-600 mt-2">
            <p>Highest Study Duration Date: <b>Sunday</b></p>
            <p>Shortest Study Duration Date: <b>Wednesday</b></p>
            <p>Average Study Duration: <b>3 hours</b></p>
          </div>
        </div>

        {/* Temperature */}
        <div className={chartContainerStyle}>
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-lg text-green-900">Temperature</h2>
            <p className="text-sm text-gray-500">5 minutes ▼</p>
          </div>
          <Line data={tempData} options={commonOptions} />
          <div className="text-sm text-gray-600 mt-2">
            <p>Highest Temperature: <b>45°C</b></p>
            <p>Average Temperature: <b>35°C</b></p>
            <p>Lowest Temperature: <b>15°C</b></p>
          </div>
        </div>

        {/* Humidity */}
        <div className={chartContainerStyle}>
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-lg text-purple-900">Humidity</h2>
            <p className="text-sm text-gray-500">Today ▼</p>
          </div>
          <Line data={humidityData} options={commonOptions} />
          <div className="text-sm text-gray-600 mt-2">
            <p>Highest Humidity: <b>82%</b></p>
            <p>Lowest Humidity: <b>25%</b></p>
            <p>Average Humidity: <b>63%</b></p>
          </div>
        </div>

        {/* Light Level */}
        <div className={chartContainerStyle}>
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-lg text-red-900">Light Level</h2>
            <p className="text-sm text-gray-500">30 minutes ▼</p>
          </div>
          <Line data={lightData} options={commonOptions} />
          <div className="text-sm text-gray-600 mt-2">
            <p>Highest Light Level: <b>125 lux</b></p>
            <p>Average Light Level: <b>83 lux</b></p>
            <p>Lowest Light Level: <b>50 lux</b></p>
          </div>
        </div>
      </div>
    </div>
  );
}
