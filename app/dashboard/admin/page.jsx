"use client";
import { useEffect, useState } from "react";
import {
  Users,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  PersonStanding,
} from "lucide-react";
import TableSkeleton from "@/app/components/TableSkeleton";

export default function DashboardOverview() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) return <TableSkeleton />;

  const cards = [
    {
      title: "Total Users",
      value: data.users.total,
      sub: `${data.users.active} Active`,
      icon: Users,
      color: "blue",
    },
    {
      title: "Total Customers",
      value: data.customers?.total,
      sub: `${data.customers?.active} Active`,
      icon: PersonStanding,
      color: "blue",
    },
    {
      title: "Total Collection",
      value: `৳${data.finance.totalCollected}`,
      sub: "Cash Received",
      icon: TrendingUp,
      color: "green",
    },
    {
      title: "Outstanding Due",
      value: `৳${data.finance.totalDue}`,
      sub: "Pending Payments",
      icon: AlertCircle,
      color: "red",
    },
    {
      title: "Net Worth (Fund)",
      value: `৳${data.finance.netWorth}`,
      sub: "After Expenses",
      icon: Wallet,
      color: "indigo",
    },
  ];

  return (
    <div className="p-6 space-y-8 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">
            Dashboard Overview
          </h1>
          <p className="text-gray-500">
            System performance and financial health for 2025
          </p>
        </div>
        <div className="text-sm font-medium px-3 py-1 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-200 dark:border-gray-700">
          Last Updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* PRO METRIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div
                className={`p-3 rounded-xl bg-${card.color}-50 dark:bg-${card.color}-900/20 text-${card.color}-600`}
              >
                <card.icon size={24} />
              </div>
              <span className="flex items-center text-xs font-bold text-green-500 bg-green-50 px-2 py-0.5 rounded">
                <ArrowUpRight size={12} className="mr-1" /> +12%
              </span>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">{card.title}</h3>
            <p className="text-2xl font-black mt-1 text-gray-900 dark:text-white">
              {card.value}
            </p>
            <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* SECONDARY ANALYTICS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Distribution */}
        <div className="lg:col-span-1 bg-white dark:bg-gray-900 p-6 rounded-2xl border dark:border-gray-800">
          <h3 className="font-bold mb-6">User Health</h3>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Active Subscribers</span>
              <span className="font-bold text-green-600">
                {data.users.active}
              </span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-green-500 h-full"
                style={{
                  width: `${(data.users.active / data.users.total) * 100}%`,
                }}
              ></div>
            </div>
            <div className="flex justify-between text-sm">
              <span>Inactive / Canceled</span>
              <span className="font-bold text-red-600">
                {data.users.inactive}
              </span>
            </div>
          </div>
        </div>

        {/* Expense vs Income Mini-Chart Placeholder */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-6 rounded-2xl border dark:border-gray-800 flex items-center justify-center border-dashed">
          <div className="text-center">
            <TrendingUp size={48} className="mx-auto text-gray-200 mb-2" />
            <p className="text-gray-400 text-sm italic">
              Financial Charting (Income vs Expense) renders here.
            </p>
            <p className="text-xs text-gray-300">
              Integrate Recharts or Chart.js for pro visualization.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
