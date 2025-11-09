import { useState } from 'react';
import { Search, MessageCircle, Send, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data
const dailyFeedData = [
  { day: 'Mon', count: 45 },
  { day: 'Tue', count: 52 },
  { day: 'Wed', count: 48 },
  { day: 'Thu', count: 61 },
  { day: 'Fri', count: 55 },
  { day: 'Sat', count: 38 },
  { day: 'Sun', count: 42 },
];

const barGraphData = [
  { name: 'Positive', value: 245 },
  { name: 'Neutral', value: 89 },
  { name: 'Negative', value: 67 },
];

interface FeedbackRow {
  id: string;
  reviewScore: number;
  networkType: string;
  ratingsCount: number;
}

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const feedbackData: FeedbackRow[] = [
  { id: '1', reviewScore: 5, networkType: 'WiFi', ratingsCount: 24 },
  { id: '2', reviewScore: 2, networkType: '5G', ratingsCount: 8 },
  { id: '3', reviewScore: 4, networkType: 'LTE', ratingsCount: 15 },
  { id: '4', reviewScore: 3, networkType: 'WiFi', ratingsCount: 12 },
  { id: '5', reviewScore: 1, networkType: '5G', ratingsCount: 6 },
  { id: '6', reviewScore: 5, networkType: 'LTE', ratingsCount: 31 },
  { id: '7', reviewScore: 4, networkType: 'WiFi', ratingsCount: 19 },
  { id: '8', reviewScore: 2, networkType: 'LTE', ratingsCount: 7 },
  { id: '9', reviewScore: 5, networkType: '5G', ratingsCount: 28 },
  { id: '10', reviewScore: 3, networkType: 'WiFi', ratingsCount: 11 },
];

function getRatingColor(score: number): string {
  if (score >= 1 && score <= 2) return 'bg-red-500';
  if (score === 3) return 'bg-yellow-500';
  if (score >= 4 && score <= 5) return 'bg-green-500';
  return 'bg-gray-500';
}

interface DashboardPageProps {
  onNavigateToPlatform: () => void;
  onNavigateToSummary: (filteredData: FeedbackRow[]) => void;
  onNavigateToAnalytics: () => void;
}

export function DashboardPage({ onNavigateToPlatform, onNavigateToSummary, onNavigateToAnalytics }: DashboardPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [scoreFilter, setScoreFilter] = useState('all');
  const [networkFilter, setNetworkFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Hi! I can help you analyze the feedback data. Try asking me about ratings, network types, or trends!',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [chatInput, setChatInput] = useState('');

  const filteredData = feedbackData.filter((row) => {
    const matchesSearch = 
      row.networkType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.reviewScore.toString().includes(searchQuery);
    
    const matchesScore = scoreFilter === 'all' || row.reviewScore.toString() === scoreFilter;
    const matchesNetwork = networkFilter === 'all' || row.networkType === networkFilter;
    
    let matchesRating = true;
    if (ratingFilter === 'red') matchesRating = row.reviewScore >= 1 && row.reviewScore <= 2;
    else if (ratingFilter === 'yellow') matchesRating = row.reviewScore === 3;
    else if (ratingFilter === 'green') matchesRating = row.reviewScore >= 4 && row.reviewScore <= 5;
    
    return matchesSearch && matchesScore && matchesNetwork && matchesRating;
  });

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: chatInput,
      sender: 'user',
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMessage]);

    // Simple bot responses based on the data
    setTimeout(() => {
      let botResponse = '';
      const lowerInput = chatInput.toLowerCase();

      if (lowerInput.includes('average') || lowerInput.includes('avg')) {
        const avg = (feedbackData.reduce((sum, row) => sum + row.reviewScore, 0) / feedbackData.length).toFixed(2);
        botResponse = `The average review score is ${avg} out of 5.`;
      } else if (lowerInput.includes('total') || lowerInput.includes('how many')) {
        botResponse = `There are ${feedbackData.length} total feedback entries in the system.`;
      } else if (lowerInput.includes('wifi')) {
        const wifiCount = feedbackData.filter(row => row.networkType === 'WiFi').length;
        const wifiAvg = (feedbackData.filter(row => row.networkType === 'WiFi').reduce((sum, row) => sum + row.reviewScore, 0) / wifiCount).toFixed(2);
        botResponse = `There are ${wifiCount} WiFi feedback entries with an average score of ${wifiAvg}.`;
      } else if (lowerInput.includes('5g')) {
        const fiveGCount = feedbackData.filter(row => row.networkType === '5G').length;
        const fiveGAvg = (feedbackData.filter(row => row.networkType === '5G').reduce((sum, row) => sum + row.reviewScore, 0) / fiveGCount).toFixed(2);
        botResponse = `There are ${fiveGCount} 5G feedback entries with an average score of ${fiveGAvg}.`;
      } else if (lowerInput.includes('lte')) {
        const lteCount = feedbackData.filter(row => row.networkType === 'LTE').length;
        const lteAvg = (feedbackData.filter(row => row.networkType === 'LTE').reduce((sum, row) => sum + row.reviewScore, 0) / lteCount).toFixed(2);
        botResponse = `There are ${lteCount} LTE feedback entries with an average score of ${lteAvg}.`;
      } else if (lowerInput.includes('low') || lowerInput.includes('red') || lowerInput.includes('negative')) {
        const lowCount = feedbackData.filter(row => row.reviewScore >= 1 && row.reviewScore <= 2).length;
        botResponse = `There are ${lowCount} negative ratings (1-2 stars) marked in red.`;
      } else if (lowerInput.includes('high') || lowerInput.includes('green') || lowerInput.includes('positive')) {
        const highCount = feedbackData.filter(row => row.reviewScore >= 4 && row.reviewScore <= 5).length;
        botResponse = `There are ${highCount} positive ratings (4-5 stars) marked in green.`;
      } else if (lowerInput.includes('yellow') || lowerInput.includes('neutral')) {
        const neutralCount = feedbackData.filter(row => row.reviewScore === 3).length;
        botResponse = `There are ${neutralCount} neutral ratings (3 stars) marked in yellow.`;
      } else if (lowerInput.includes('best') || lowerInput.includes('highest')) {
        const best = feedbackData.filter(row => row.reviewScore === 5);
        botResponse = `There are ${best.length} entries with the highest rating of 5 stars.`;
      } else {
        botResponse = "I can help you with questions about average scores, network types (WiFi, 5G, LTE), rating distributions, and more. What would you like to know?";
      }

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };

      setChatMessages((prev) => [...prev, botMessage]);
    }, 500);

    setChatInput('');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with Navigation */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl">Feedback Dashboard</h1>
          <div className="space-x-4">
            <Button variant="outline" onClick={onNavigateToPlatform}>
              Platform
            </Button>
            <Button className="bg-fuchsia-600 hover:bg-fuchsia-700" onClick={() => onNavigateToSummary(filteredData)}>
              Summary
            </Button>
            <Button className="bg-fuchsia-600 hover:bg-fuchsia-700" onClick={onNavigateToAnalytics}>
              Analytics
            </Button>
          </div>
        </div>

        {/* Top Stats and Graphs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Total Feedback Card */}
          <Card>
            <CardHeader>
              <CardTitle>Total Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl">401</div>
              <p className="text-muted-foreground mt-2">All time responses</p>
            </CardContent>
          </Card>

          {/* Daily Feed Card with Line Graph */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Feed</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={120}>
                <LineChart data={dailyFeedData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#d946ef" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Bar Graph Card */}
          <Card>
            <CardHeader>
              <CardTitle>Sentiment Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={barGraphData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#d946ef" />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 text-right">
                <button onClick={onNavigateToAnalytics} className="text-fuchsia-600 hover:underline">
                  View graphs
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search feedback..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select value={scoreFilter} onValueChange={setScoreFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Review Score" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Scores</SelectItem>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="4">4</SelectItem>
              <SelectItem value="5">5</SelectItem>
            </SelectContent>
          </Select>

          <Select value={networkFilter} onValueChange={setNetworkFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Network Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Networks</SelectItem>
              <SelectItem value="WiFi">WiFi</SelectItem>
              <SelectItem value="5G">5G</SelectItem>
              <SelectItem value="LTE">LTE</SelectItem>
            </SelectContent>
          </Select>

          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Rating Color" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="red">Red (1-2)</SelectItem>
              <SelectItem value="yellow">Yellow (3)</SelectItem>
              <SelectItem value="green">Green (4-5)</SelectItem>
            </SelectContent>
          </Select>

          <div className="text-muted-foreground flex items-center">
            Showing {filteredData.length} of {feedbackData.length} results
          </div>
        </div>

        {/* Feedback Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Review Score</TableHead>
                  <TableHead>Network Type</TableHead>
                  <TableHead>Number of Ratings</TableHead>
                  <TableHead>Rating Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.reviewScore}</TableCell>
                    <TableCell>{row.networkType}</TableCell>
                    <TableCell>{row.ratingsCount}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getRatingColor(row.reviewScore)}`} />
                        <span className="text-muted-foreground">
                          {row.reviewScore >= 1 && row.reviewScore <= 2 && 'Low'}
                          {row.reviewScore === 3 && 'Medium'}
                          {row.reviewScore >= 4 && row.reviewScore <= 5 && 'High'}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Generate Summary Button */}
        <div>
          <Button className="bg-fuchsia-600 hover:bg-fuchsia-700" onClick={() => onNavigateToSummary(filteredData)}>
            Generate Summary
          </Button>
        </div>
      </div>

      {/* Chatbot Button */}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        className="fixed bottom-6 right-6 bg-fuchsia-600 text-white rounded-full p-4 shadow-lg hover:bg-fuchsia-700 transition-colors z-50"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Chatbot Window */}
      {chatOpen && (
        <div className="fixed bottom-24 right-6 w-96 bg-white rounded-lg shadow-2xl border z-50 flex flex-col" style={{ height: '500px' }}>
          {/* Chat Header */}
          <div className="bg-fuchsia-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <span>Feedback Assistant</span>
            </div>
            <button onClick={() => setChatOpen(false)} className="hover:bg-fuchsia-700 rounded p-1">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-fuchsia-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                placeholder="Ask about the feedback data..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button onClick={handleSendMessage} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}