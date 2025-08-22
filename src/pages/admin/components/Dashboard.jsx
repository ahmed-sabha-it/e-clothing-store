import React from 'react';
import { Card } from '@/components/ui/card';
import {
  BarChart3,
  TrendingUp,
  Users,
  Package,
  DollarSign,
  ShoppingBag,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const Dashboard = ({ stats }) => {
  // Sample data for charts
  const salesData = [
    { month: 'Jan', sales: 4000 },
    { month: 'Feb', sales: 3000 },
    { month: 'Mar', sales: 5000 },
    { month: 'Apr', sales: 4500 },
    { month: 'May', sales: 6000 },
    { month: 'Jun', sales: 5500 },
  ];

  const categoryData = [
    { name: 'Men', value: 400, color: '#3b82f6' },
    { name: 'Women', value: 300, color: '#ec4899' },
    { name: 'Accessories', value: 200, color: '#10b981' },
    { name: 'Shoes', value: 100, color: '#f59e0b' },
  ];

  const recentOrders = [
    { id: '#ORD001', customer: 'John Doe', amount: '$125.00', status: 'completed', date: '2024-01-15' },
    { id: '#ORD002', customer: 'Jane Smith', amount: '$89.99', status: 'processing', date: '2024-01-15' },
    { id: '#ORD003', customer: 'Bob Johnson', amount: '$256.50', status: 'pending', date: '2024-01-14' },
    { id: '#ORD004', customer: 'Alice Brown', amount: '$67.00', status: 'completed', date: '2024-01-14' },
    { id: '#ORD005', customer: 'Charlie Wilson', amount: '$189.99', status: 'shipped', date: '2024-01-13' },
  ];

  const getStatusBadge = (status) => {
    const statusStyles = {
      completed: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      processing: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      pending: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      shipped: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      cancelled: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    };
    return statusStyles[status] || 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
  };

  const getChangeIcon = (change) => {
    const isPositive = change.startsWith('+');
    return isPositive ? (
      <ArrowUp className="h-4 w-4" />
    ) : (
      <ArrowDown className="h-4 w-4" />
    );
  };

  return (
    <div className="dashboard-container">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <Card 
            key={stat.label} 
            className="p-6 rounded-xl border bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <stat.icon className="h-6 w-6 text-primary" />
            </div>
            <div className="text-sm text-muted-foreground mb-1">{stat.label}</div>
            <div className="text-2xl font-bold mb-2">{stat.value}</div>
            <div className={`text-sm font-medium flex items-center gap-1 ${
              stat.change.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {getChangeIcon(stat.change)}
              {stat.change}
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Sales Chart */}
        <Card className="p-6 animate-fade-in animation-delay-300">
          <h3 className="text-lg font-semibold mb-4">Sales Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="sales" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Category Distribution */}
        <Card className="p-6 animate-fade-in animation-delay-450">
          <h3 className="text-lg font-semibold mb-4">Sales by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Orders Table */}
      <Card className="bg-card rounded-xl border overflow-hidden animate-fade-in animation-delay-600">
        <div className="p-6 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold">Recent Orders</h3>
          <button className="text-primary hover:underline text-sm">View All</button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50">
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Order ID</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Customer</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Amount</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Status</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Date</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order, index) => (
              <tr 
                key={order.id} 
                className="animate-fade-in"
                style={{ animationDelay: `${750 + index * 100}ms` }}
              >
                <td className="px-6 py-4 text-sm font-medium">{order.id}</td>
                <td className="px-6 py-4 text-sm">{order.customer}</td>
                <td className="px-6 py-4 text-sm font-semibold">{order.amount}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={getStatusBadge(order.status)}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{order.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default Dashboard;
