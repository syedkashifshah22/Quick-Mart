export default function HeroAdmin() {
  const stats = [
    { title: "Total Users", value: "1,245", icon: "👤", change: "+12%" },
    { title: "Total Products", value: "560", icon: "📦", change: "+5%" },
    { title: "Total Orders", value: "3,450", icon: "📄", change: "+23%" },
    { title: "Revenue", value: "$12,580", icon: "💰", change: "+18%" },
    { title: "Pending Orders", value: "23", icon: "⏳", change: "-3%" },
    { title: "Conversion Rate", value: "4.5%", icon: "📈", change: "+1.2%" },
  ];

  const recentOrders = [
    { id: "#ORD-7892", customer: "Ali Khan", date: "2024-03-10", amount: "$250", status: "Delivered" },
    { id: "#ORD-7891", customer: "Sara Ahmed", date: "2024-03-09", amount: "$150", status: "Pending" },
    { id: "#ORD-7890", customer: "Usman Raza", date: "2024-03-09", amount: "$420", status: "Processing" },
    { id: "#ORD-7889", customer: "Fatima Noor", date: "2024-03-08", amount: "$89", status: "Delivered" },
    { id: "#ORD-7888", customer: "Zain Malik", date: "2024-03-08", amount: "$320", status: "Cancelled" },
  ];

  const activities = [
    { user: "Admin", action: "added new product", time: "2 min ago" },
    { user: "Ali Khan", action: "placed order #ORD-7892", time: "10 min ago" },
    { user: "System", action: "weekly backup completed", time: "1 hour ago" },
    { user: "Sara", action: "updated profile", time: "2 hours ago" },
  ];

  return (
    <div className="md:p-6 ">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-8 space-y-4 md:space-y-0">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
        <div className="flex items-center">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer">
            Generate Report
          </button>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-xl shadow-sm border hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
                <p className={`text-xs mt-1 ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change} from last month
                </p>
              </div>
              <div className="text-2xl">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Revenue Trend (Last 6 Months)</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <p className="text-gray-500">Chart.js / ApexCharts integration here</p>
              <p className="text-sm text-gray-400">Monthly data visualization</p>
            </div>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Orders by Category</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-4xl mb-2">🥧</div>
              <p className="text-gray-500">Pie/Bar chart here</p>
              <p className="text-sm text-gray-400">Product category distribution</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Recent Orders</h3>
            <a href="/admin/orders" className="text-blue-600 text-sm hover:underline">
              View all →
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 text-sm font-medium text-gray-500">Order ID</th>
                  <th className="text-left py-3 text-sm font-medium text-gray-500">Customer</th>
                  <th className="text-left py-3 text-sm font-medium text-gray-500">Date</th>
                  <th className="text-left py-3 text-sm font-medium text-gray-500">Amount</th>
                  <th className="text-left py-3 text-sm font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 font-medium">{order.id}</td>
                    <td className="py-3">{order.customer}</td>
                    <td className="py-3 text-gray-500">{order.date}</td>
                    <td className="py-3 font-medium">{order.amount}</td>
                    <td className="py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === "Delivered"
                            ? "bg-green-100 text-green-800"
                            : order.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.status === "Processing"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={index} className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <span className="text-blue-600">📝</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium">
                    <span className="text-gray-800">{activity.user}</span>{" "}
                    <span className="text-gray-600">{activity.action}</span>
                  </p>
                  <p className="text-sm text-gray-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">System Status</p>
                <p className="text-sm text-gray-500">All systems operational</p>
              </div>
              <span className="h-3 w-3 bg-green-500 rounded-full"></span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Info */}
      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>Dashboard last updated: Today, 10:30 AM • Data refreshes every 30 minutes</p>
      </div>
    </div>
  );
}