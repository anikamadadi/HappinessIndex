import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AnalyticsPageProps {
  onNavigateToDashboard: () => void;
}

export function AnalyticsPage({ onNavigateToDashboard }: AnalyticsPageProps) {
  // Average Rating Trend Data (Jan-Aug)
  const avgRatingTrendData = [
    { month: 'Jan', avgRating: 1.5 },
    { month: 'Feb', avgRating: 1.4 },
    { month: 'Mar', avgRating: 1.3 },
    { month: 'Apr', avgRating: 1.4 },
    { month: 'May', avgRating: 1.2 },
    { month: 'Jun', avgRating: 1.3 },
    { month: 'Jul', avgRating: 1.3 },
    { month: 'Aug', avgRating: 1.4 },
  ];

  // Rating Distribution Data
  const ratingDistributionData = [
    { name: '1 Star', value: 68, label: '1 Star: 68%' },
    { name: '2 Star', value: 12, label: '2 Star: 12%' },
    { name: '3 Star', value: 8, label: '3 Star: 8%' },
    { name: '5 Star', value: 6, label: '5 Star: 6%' },
  ];

  // T-Mobile magenta color scheme
  const COLORS = ['#E20074', '#FF6B9D', '#FFB3D9', '#D3D3D3'];

  // Top Issue Categories Data
  const topIssueCategoriesData = [
    { category: 'Customer Service', count: 7500 },
    { category: 'Network Quality', count: 6200 },
    { category: 'Billing Issues', count: 4800 },
    { category: 'Contract Problems', count: 3500 },
    { category: 'Device Issues', count: 2800 },
    { category: 'Account Management', count: 2200 },
  ];

  // Sentiment Trends Data
  const sentimentTrendsData = [
    { month: 'Jan', negative: 7200, positive: 800 },
    { month: 'Feb', negative: 7500, positive: 900 },
    { month: 'Mar', negative: 7800, positive: 750 },
    { month: 'Apr', negative: 7400, positive: 850 },
    { month: 'May', negative: 8000, positive: 700 },
    { month: 'Jun', negative: 7800, positive: 900 },
    { month: 'Jul', negative: 7600, positive: 950 },
    { month: 'Aug', negative: 7500, positive: 850 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#E20074] rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">T</span>
            </div>
            <div>
              <div className="font-semibold">T-Mobile</div>
              <div className="text-sm text-gray-500">Employee Portal</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onNavigateToDashboard}>
              Dashboard
            </Button>
            <Button className="bg-[#E20074] hover:bg-[#C00062]">
              Analytics
            </Button>
            <Button variant="outline">
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-8 space-y-6">
        <div>
          <h1 className="text-3xl mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Detailed customer feedback analysis and trends</p>
        </div>

        {/* Top Row - Average Rating Trend & Rating Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Average Rating Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Average Rating Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={avgRatingTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="avgRating" 
                    stroke="#E20074" 
                    strokeWidth={2}
                    name="Avg Rating"
                    dot={{ fill: '#E20074', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Rating Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Rating Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={ratingDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={(entry) => entry.label}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {ratingDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row - Top Issue Categories & Sentiment Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Issue Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Top Issue Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart 
                  data={topIssueCategoriesData} 
                  layout="vertical"
                  margin={{ left: 100 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis type="number" domain={[0, 8000]} />
                  <YAxis dataKey="category" type="category" width={120} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#E20074" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Sentiment Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Sentiment Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={sentimentTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 10000]} />
                  <Tooltip />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="negative" 
                    stackId="1"
                    stroke="#E20074" 
                    fill="#FF6B9D" 
                    name="Negative"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="positive" 
                    stackId="1"
                    stroke="#00D084" 
                    fill="#7FE8BB" 
                    name="Positive"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
