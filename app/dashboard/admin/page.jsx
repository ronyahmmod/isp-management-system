// app/dashboard/admin/page.jsx
import StatCard from "@/app/components/stats/StatCard";

export default async function AdminPage() {
  const stats = {
    users: 54,
    customers: 218,
    pendingBills: 39,
    revenueThisMonth: 184500,
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <StatCard title="Users" value={stats.users} />
        <StatCard title="Customers" value={stats.customers} />
        <StatCard title="Pending Bills" value={stats.pendingBills} />
        <StatCard title="Revenue (BDT)" value={stats.revenueThisMonth} />
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Recent Activity</h2>
          <ul className="text-sm text-gray-600 dark:text-gray-300">
            <li>Payment: customer-23 paid BDT 800</li>
            <li>New user created: billing@isp.local</li>
            <li>Invoice generated for April</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Quick Actions</h2>
          <div className="flex gap-2">
            <a
              href="/dashboard/admin/users"
              className="px-3 py-2 bg-blue-600 text-white rounded"
            >
              Manage Users
            </a>
            <a
              href="/dashboard/admin/customers"
              className="px-3 py-2 bg-green-600 text-white rounded"
            >
              Manage Customers
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
