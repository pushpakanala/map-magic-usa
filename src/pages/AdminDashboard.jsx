
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { METRICS_LOGGING } from '../constants';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { logPageView, startTimeTracking, endTimeTracking } from '@/utils/logger';

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Check if user is admin
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'admin';

  useEffect(() => {
    logPageView('admin');
    startTimeTracking('admin');
    return () => {
      endTimeTracking('admin');
    };
  }, []);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const response = await axios.get(`${METRICS_LOGGING}/reports`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setMetrics(response.data);
      } catch (error) {
        // Handle error silently
      } finally {
        setIsLoading(false);
      }
    };

    if (isAdmin) {
      fetchMetrics();
    }
  }, [isAdmin]);

  // Redirect non-admin users
  if (!isAdmin) {
    return <Navigate to="/explore" replace />;
  }

  // Create demo data if no metrics are available yet
  const demoData = {
    events: {
      login: 45,
      logout: 32,
      signup: 18,
      page_visit: 320,
      university_search: 156,
      time_spent: 85,
      api_request: 210
    },
    userActivity: [
      { date: '2023-10-01', visits: 15 },
      { date: '2023-10-02', visits: 20 },
      { date: '2023-10-03', visits: 25 },
      { date: '2023-10-04', visits: 18 },
      { date: '2023-10-05', visits: 22 },
      { date: '2023-10-06', visits: 30 },
      { date: '2023-10-07', visits: 28 }
    ],
    popularPages: [
      { name: 'explore', views: 142 },
      { name: 'login', views: 89 },
      { name: 'signup', views: 53 },
      { name: 'state/California', views: 48 },
      { name: 'compare', views: 36 }
    ]
  };
  
  const data = metrics || demoData;
  
  // Transform events data for charts
  const eventTypesData = Object.entries(data.events).map(([name, value]) => ({
    name: name.replace('_', ' ').toUpperCase(),
    value
  }));
  
  // Colors for pie chart
  const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c', '#d0ed57', '#ffc658'];

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <Tabs defaultValue="overview" onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="pages">Page Views</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Total Events</CardTitle>
                <CardDescription>All tracked events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {Object.values(data.events).reduce((acc, curr) => acc + curr, 0)}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Sign Ups</CardTitle>
                <CardDescription>New account creations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {data.events.signup || 0}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">University Searches</CardTitle>
                <CardDescription>Search operations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {data.events.university_search || 0}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Event Distribution</CardTitle>
              <CardDescription>Breakdown of all tracked events</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={eventTypesData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {eventTypesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [value, name]} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="events" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Event Types Breakdown</CardTitle>
              <CardDescription>Distribution of different event types</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={eventTypesData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pages" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Most Viewed Pages</CardTitle>
              <CardDescription>Pages with highest visit counts</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.popularPages}
                  layout="vertical"
                  margin={{
                    top: 20,
                    right: 30,
                    left: 40,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" />
                  <Tooltip />
                  <Bar dataKey="views" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
