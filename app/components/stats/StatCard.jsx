// components/stats/StatCard.jsx
export default function StatCard({ title, value }) {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="text-sm text-gray-500 dark:text-gray-300">{title}</div>
      <div className="text-2xl font-bold mt-2">{value}</div>
    </div>
  );
}
