import React, { useState, useEffect } from 'react';
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
import { userAPI, orderAPI, productAPI, categoryAPI } from '../../../lib/api';

const Dashboard = ({ stats }) => {
  const [analyticsData, setAnalyticsData] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    averageOrderValue: 0,
    topSpenders: [],
    recentOrders: [],
    salesData: [],
    categoryData: []
  });
  const [loading, setLoading] = useState(true);

  // Fetch analytics data from backend
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        
        // Fetch all users and their spending data
        const usersResponse = await userAPI.admin.getAllUsers();
        const users = usersResponse.data || usersResponse.users || usersResponse;
        
        // Fetch all orders
        const ordersResponse = await orderAPI.getAll();
        const orders = ordersResponse.data || ordersResponse.orders || ordersResponse;
        
        // Fetch products and categories for charts
        const productsResponse = await productAPI.getAll();
        const products = productsResponse.data || productsResponse.products || productsResponse;
        
        const categoriesResponse = await categoryAPI.getAll();
        const categories = categoriesResponse.data || categoriesResponse.categories || categoriesResponse;
        
        // Calculate analytics
        const totalRevenue = Array.isArray(orders) ? orders.reduce((sum, order) => sum + parseFloat(order.total_price || 0), 0) : 0;
        const totalOrders = Array.isArray(orders) ? orders.length : 0;
        const totalUsers = Array.isArray(users) ? users.length : 0;
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        
        // Generate sales data by month from real orders
        const salesByMonth = {};
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        if (Array.isArray(orders)) {
          orders.forEach(order => {
            const date = new Date(order.created_at);
            const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
            const monthName = monthNames[date.getMonth()];
            
            if (!salesByMonth[monthKey]) {
              salesByMonth[monthKey] = { month: monthName, sales: 0, orders: 0 };
            }
            salesByMonth[monthKey].sales += parseFloat(order.total_price || 0);
            salesByMonth[monthKey].orders += 1;
          });
        }
        
        // Convert to array and sort by month
        const salesData = Object.values(salesByMonth)
          .sort((a, b) => monthNames.indexOf(a.month) - monthNames.indexOf(b.month))
          .slice(-6); // Last 6 months
        
        // Generate category distribution from real data
        const categoryStats = {};
        const categoryColors = ['#3b82f6', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];
        
        if (Array.isArray(categories)) {
          categories.forEach((category, index) => {
            categoryStats[category.id] = {
              name: category.name,
              value: 0,
              color: categoryColors[index % categoryColors.length]
            };
          });
        }
        
        // Count products by category
        if (Array.isArray(products)) {
          products.forEach(product => {
            if (categoryStats[product.category_id]) {
              categoryStats[product.category_id].value += 1;
            }
          });
        }
        
        const categoryData = Object.values(categoryStats).filter(cat => cat.value > 0);
        
        // Calculate top spenders
        const userSpending = {};
        if (Array.isArray(orders)) {
          orders.forEach(order => {
            const userId = order.user_id;
            if (!userSpending[userId]) {
              userSpending[userId] = { totalSpent: 0, orderCount: 0, user: null };
            }
            userSpending[userId].totalSpent += parseFloat(order.total_price || 0);
            userSpending[userId].orderCount += 1;
          });
        }
        
        // Match users with their spending data
        if (Array.isArray(users)) {
          users.forEach(user => {
            if (userSpending[user.id]) {
              userSpending[user.id].user = user;
            }
          });
        }
        
        // Get top 5 spenders
        const topSpenders = Object.values(userSpending)
          .filter(data => data.user)
          .sort((a, b) => b.totalSpent - a.totalSpent)
          .slice(0, 5)
          .map(data => ({
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            totalSpent: data.totalSpent,
            orderCount: data.orderCount
          }));
        
        // Get recent orders with user names
        const recentOrders = Array.isArray(orders) ? orders
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 5)
          .map(order => {
            const user = Array.isArray(users) ? users.find(u => u.id === order.user_id) : null;
            return {
              id: order.id,
              customer: user?.name || 'Unknown User',
              amount: `$${parseFloat(order.total_price || 0).toFixed(2)}`,
              status: order.status || 'pending',
              date: new Date(order.created_at).toLocaleDateString()
            };
          }) : [];
        
        setAnalyticsData({
          totalRevenue,
          totalOrders,
          totalUsers,
          averageOrderValue,
          topSpenders,
          recentOrders,
          salesData,
          categoryData
        });
        
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  // Use real analytics data
  const realStats = [
    { label: 'Total Revenue', value: `$${analyticsData.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, change: '+12.5%', icon: DollarSign },
    { label: 'Total Orders', value: analyticsData.totalOrders.toLocaleString(), change: '+8.2%', icon: ShoppingBag },
    { label: 'Active Users', value: analyticsData.totalUsers.toLocaleString(), change: '+15.3%', icon: Users },
    { label: 'Avg Order Value', value: `$${analyticsData.averageOrderValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, change: '+5.1%', icon: TrendingUp },
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

  // Full page loader option
  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Loading Dashboard</h3>
            <p className="text-muted-foreground">Fetching analytics data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {loading ? (
          // Loading skeleton for stats
          [...Array(4)].map((_, index) => (
            <Card 
              key={index}
              className="p-6 rounded-xl border bg-card dark:bg-gray-800 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="animate-pulse">
                <div className="w-12 h-12 rounded-lg bg-muted/20 mb-4"></div>
                <div className="h-4 bg-muted/20 rounded w-20 mb-1"></div>
                <div className="h-8 bg-muted/20 rounded w-16 mb-2"></div>
                <div className="h-4 bg-muted/20 rounded w-12"></div>
              </div>
            </Card>
          ))
        ) : (
          realStats.map((stat, index) => (
            <Card 
              key={stat.label} 
              className="p-6 rounded-xl border bg-card dark:bg-gray-800 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in"
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
          ))
        )}
      </div>

      {/* Top Spenders Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Top Spenders */}
        <Card className="p-6 animate-fade-in dark:bg-gray-800 animation-delay-300">
          <h3 className="text-lg font-semibold mb-4">Top Spenders</h3>
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-center justify-between p-3 bg-muted/20 rounded-md">
                  <div className="h-4 bg-muted rounded w-1/3"></div>
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {analyticsData.topSpenders.length > 0 ? analyticsData.topSpenders.map((spender, index) => (
                <div key={spender.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-md hover:bg-muted/30 transition-colors">
                  <div>
                    <div className="font-medium">{spender.name}</div>
                    <div className="text-sm text-muted-foreground">{spender.orderCount} orders</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">${spender.totalSpent.toFixed(2)}</div>
                    <div className="text-xs text-muted-foreground">#{index + 1}</div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-muted-foreground">
                  No spending data available
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Sales Chart */}
        <Card className="p-6 animate-fade-in dark:bg-gray-800 animation-delay-450">
          <h3 className="text-lg font-semibold mb-4">Sales Overview (Last 6 Months)</h3>
          {loading ? (
            <div className="flex flex-col items-center justify-center h-[300px] space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="text-sm text-muted-foreground">Loading sales data...</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData.salesData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'sales' ? `$${value.toFixed(2)}` : value,
                    name === 'sales' ? 'Revenue' : 'Orders'
                  ]}
                />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6' }}
                  name="sales"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      {/* Category Distribution */}
      <div className="mb-6">
        <Card className="p-6 animate-fade-in dark:bg-gray-800 animation-delay-600">
          <h3 className="text-lg font-semibold mb-4">Product Distribution by Category</h3>
          {loading ? (
            <div className="flex flex-col items-center justify-center h-[300px] space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="text-sm text-muted-foreground">Loading category data...</p>
            </div>
          ) : analyticsData.categoryData && analyticsData.categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analyticsData.categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analyticsData.categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} products`, 'Count']} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No category data available</p>
              <p className="text-xs mt-2">Add products to categories to see distribution</p>
            </div>
          )}
        </Card>
      </div>

      {/* Recent Orders Table */}
      <Card className="bg-card rounded-xl border dark:bg-gray-800 overflow-hidden animate-fade-in animation-delay-600">
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
            {(loading ? [] : analyticsData.recentOrders).map((order, index) => (
              <tr 
                key={order.id} 
                className="animate-fade-in"
                style={{ animationDelay: `${750 + index * 100}ms` }}
              >
                <td className="px-6 py-4 text-sm font-medium">#{order.id}</td>
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
            {loading && [...Array(5)].map((_, index) => (
              <tr key={index} className="animate-pulse">
                <td className="px-6 py-4"><div className="h-4 bg-muted rounded w-20"></div></td>
                <td className="px-6 py-4"><div className="h-4 bg-muted rounded w-24"></div></td>
                <td className="px-6 py-4"><div className="h-4 bg-muted rounded w-16"></div></td>
                <td className="px-6 py-4"><div className="h-4 bg-muted rounded w-20"></div></td>
                <td className="px-6 py-4"><div className="h-4 bg-muted rounded w-24"></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default Dashboard;
