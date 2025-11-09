import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Wifi, Radio, Signal, Network } from 'lucide-react';

interface PlatformPageProps {
  onNavigateToDashboard: () => void;
  onNavigateToSummary: () => void;
}

export function PlatformPage({ onNavigateToDashboard, onNavigateToSummary }: PlatformPageProps) {
  const platformStats = [
    {
      title: 'WiFi Network',
      icon: <Wifi className="h-8 w-8 text-fuchsia-600" />,
      count: 145,
      avgRating: 4.2,
      color: 'bg-purple-50',
    },
    {
      title: '5G Network',
      icon: <Signal className="h-8 w-8 text-fuchsia-600" />,
      count: 123,
      avgRating: 3.8,
      color: 'bg-pink-50',
    },
    {
      title: 'LTE Network',
      icon: <Radio className="h-8 w-8 text-fuchsia-600" />,
      count: 98,
      avgRating: 3.5,
      color: 'bg-fuchsia-50',
    },
    {
      title: 'Network Issues',
      icon: <Network className="h-8 w-8 text-fuchsia-600" />,
      count: 35,
      avgRating: 2.1,
      color: 'bg-red-50',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl">Platform Overview</h1>
          <div className="space-x-4">
            <Button variant="outline" onClick={onNavigateToDashboard}>
              Dashboard
            </Button>
            <Button className="bg-fuchsia-600 hover:bg-fuchsia-700" onClick={onNavigateToSummary}>
              View Summary
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {platformStats.map((stat, index) => (
            <Card key={index} className={stat.color}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{stat.title}</CardTitle>
                  {stat.icon}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-4xl">{stat.count}</div>
                  <p className="text-muted-foreground">Total Feedback</p>
                </div>
                <div>
                  <div className="text-2xl">{stat.avgRating} / 5.0</div>
                  <p className="text-muted-foreground">Average Rating</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
