import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Sparkles, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface FeedbackRow {
  id: string;
  reviewScore: number;
  networkType: string;
  ratingsCount: number;
}

interface SummaryPageProps {
  onNavigateToDashboard: () => void;
  onNavigateToPlatform: () => void;
  filteredData: FeedbackRow[];
}

export function SummaryPage({ onNavigateToDashboard, onNavigateToPlatform, filteredData }: SummaryPageProps) {
  const [summaryTopic, setSummaryTopic] = useState('');
  const [generatedSummary, setGeneratedSummary] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Calculate metrics from filtered data
  const totalEntries = filteredData.length;
  const avgScore = totalEntries > 0 
    ? (filteredData.reduce((sum, row) => sum + row.reviewScore, 0) / totalEntries).toFixed(2)
    : '0.00';
  
  const positiveCount = filteredData.filter(row => row.reviewScore >= 4 && row.reviewScore <= 5).length;
  const neutralCount = filteredData.filter(row => row.reviewScore === 3).length;
  const negativeCount = filteredData.filter(row => row.reviewScore >= 1 && row.reviewScore <= 2).length;

  // Network breakdown
  const networkBreakdown = filteredData.reduce((acc, row) => {
    acc[row.networkType] = (acc[row.networkType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const networkScores = filteredData.reduce((acc, row) => {
    if (!acc[row.networkType]) {
      acc[row.networkType] = { total: 0, count: 0 };
    }
    acc[row.networkType].total += row.reviewScore;
    acc[row.networkType].count += 1;
    return acc;
  }, {} as Record<string, { total: number; count: number }>);

  // Generate trend data for line chart
  const trendData = [
    { day: 'Day 1', score: 3.2 },
    { day: 'Day 2', score: 3.5 },
    { day: 'Day 3', score: parseFloat(avgScore) * 0.95 },
    { day: 'Day 4', score: parseFloat(avgScore) * 0.98 },
    { day: 'Day 5', score: parseFloat(avgScore) },
  ];

  const handleGenerateSummary = () => {
    setIsGenerating(true);
    
    // Simulate AI processing
    setTimeout(() => {
      let summary = '';
      
      if (totalEntries === 0) {
        summary = 'No data available to generate summary. Please adjust your filters to include more feedback entries.';
      } else {
        // Generate AI-like summary based on the data
        const topicText = summaryTopic || 'Network Feedback';
        const satisfactionRate = ((positiveCount / totalEntries) * 100).toFixed(1);
        const dominantNetwork = Object.entries(networkBreakdown).sort((a, b) => b[1] - a[1])[0];
        const bestNetwork = Object.entries(networkScores)
          .map(([network, data]) => ({ network, avg: data.total / data.count }))
          .sort((a, b) => b.avg - a.avg)[0];
        
        summary = `## ${topicText}\n\n`;
        summary += `**Analysis of ${totalEntries} feedback entries**\n\n`;
        summary += `### Overall Performance\n`;
        summary += `The filtered dataset shows an average rating of ${avgScore} out of 5.0, with a satisfaction rate of ${satisfactionRate}%. `;
        
        if (parseFloat(avgScore) >= 4.0) {
          summary += `This indicates strong customer satisfaction across the analyzed feedback.\n\n`;
        } else if (parseFloat(avgScore) >= 3.0) {
          summary += `This suggests moderate satisfaction with room for improvement.\n\n`;
        } else {
          summary += `This indicates significant concerns that require immediate attention.\n\n`;
        }
        
        summary += `### Key Findings\n\n`;
        summary += `**Sentiment Breakdown:**\n`;
        summary += `• Positive ratings (4-5 stars): ${positiveCount} entries (${((positiveCount/totalEntries)*100).toFixed(1)}%)\n`;
        summary += `• Neutral ratings (3 stars): ${neutralCount} entries (${((neutralCount/totalEntries)*100).toFixed(1)}%)\n`;
        summary += `• Negative ratings (1-2 stars): ${negativeCount} entries (${((negativeCount/totalEntries)*100).toFixed(1)}%)\n\n`;
        
        if (dominantNetwork) {
          summary += `**Network Analysis:**\n`;
          summary += `• Most feedback received from ${dominantNetwork[0]} network (${dominantNetwork[1]} entries)\n`;
          if (bestNetwork) {
            const bestAvg = (networkScores[bestNetwork.network].total / networkScores[bestNetwork.network].count).toFixed(2);
            summary += `• Highest performing network: ${bestNetwork.network} with average rating of ${bestAvg}\n\n`;
          }
        }
        
        summary += `### Main Issues Identified\n`;
        if (negativeCount > totalEntries * 0.3) {
          summary += `• High volume of negative feedback (${negativeCount} entries) indicates systemic issues requiring immediate investigation\n`;
        }
        if (negativeCount > 0) {
          summary += `• ${negativeCount} users reported low satisfaction levels (1-2 stars)\n`;
        }
        
        const lowRatedNetworks = Object.entries(networkScores)
          .filter(([_, data]) => (data.total / data.count) < 3.0);
        if (lowRatedNetworks.length > 0) {
          summary += `• Networks requiring attention: ${lowRatedNetworks.map(([net]) => net).join(', ')}\n`;
        }
        
        summary += `\n### Recommendations\n`;
        if (parseFloat(avgScore) < 3.5) {
          summary += `• Priority: Address root causes of low ratings through detailed user research\n`;
          summary += `• Implement immediate quality improvements for underperforming networks\n`;
        }
        summary += `• Continue monitoring feedback trends to identify emerging patterns\n`;
        summary += `• Focus on converting neutral ratings to positive through targeted improvements\n`;
        
        if (positiveCount > totalEntries * 0.5) {
          summary += `• Leverage positive feedback to identify and replicate best practices\n`;
        }
      }
      
      setGeneratedSummary(summary);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl">AI Summary Generator</h1>
          <div className="space-x-4">
            <Button variant="outline" onClick={onNavigateToPlatform}>
              Platform
            </Button>
            <Button className="bg-fuchsia-600 hover:bg-fuchsia-700" onClick={onNavigateToDashboard}>
              Dashboard
            </Button>
          </div>
        </div>

        {/* Summary Input Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-fuchsia-600" />
              Generate AI Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl">{totalEntries}</div>
                <p className="text-sm text-muted-foreground">Total Entries</p>
                <p className="text-xs text-muted-foreground mt-1">Contains the number of entries in filtered dataset</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl">{positiveCount}/{totalEntries}</div>
                <p className="text-sm text-muted-foreground">Positive Ratings</p>
                <p className="text-xs text-muted-foreground mt-1">High satisfaction (4-5 stars)</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="text-2xl">{negativeCount}/{totalEntries}</div>
                <p className="text-sm text-muted-foreground">Negative Ratings</p>
                <p className="text-xs text-muted-foreground mt-1">Low satisfaction (1-2 stars)</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="topic">Summary Topic (Optional)</Label>
              <Input
                id="topic"
                placeholder="e.g., Network Performance Analysis"
                value={summaryTopic}
                onChange={(e) => setSummaryTopic(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Leave blank to use default topic. Click here to view full transcript classification and edit responses.
              </p>
            </div>

            <Button 
              onClick={handleGenerateSummary} 
              disabled={isGenerating}
              className="bg-fuchsia-600 hover:bg-fuchsia-700"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                  Generating Summary...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate AI Summary
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground">
              Press "Generate AI Summary" button - creates a poll summary based on analysis of filtered data
            </p>
          </CardContent>
        </Card>

        {/* Trend Chart */}
        {totalEntries > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Rating Trend Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#d946ef" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Generated Summary */}
        {generatedSummary && (
          <Card className="border-fuchsia-200 border-2">
            <CardHeader className="bg-fuchsia-50">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-fuchsia-600" />
                AI-Generated Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="prose max-w-none whitespace-pre-wrap">
                {generatedSummary.split('\n').map((line, index) => {
                  if (line.startsWith('##')) {
                    return <h2 key={index} className="text-2xl mt-4 mb-2">{line.replace('## ', '')}</h2>;
                  } else if (line.startsWith('###')) {
                    return <h3 key={index} className="text-xl mt-3 mb-2">{line.replace('### ', '')}</h3>;
                  } else if (line.startsWith('**') && line.endsWith('**')) {
                    return <p key={index} className="font-semibold mt-2">{line.replace(/\*\*/g, '')}</p>;
                  } else if (line.startsWith('•')) {
                    return <li key={index} className="ml-4 mb-1">{line.replace('• ', '')}</li>;
                  } else if (line.trim()) {
                    return <p key={index} className="mb-2">{line}</p>;
                  }
                  return <br key={index} />;
                })}
              </div>

              <div className="mt-6 flex items-start gap-3 p-4 bg-yellow-50 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-1 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-semibold mb-1">Main issues are generated based on analysis</p>
                  <p className="text-muted-foreground">
                    This AI-generated summary analyzes {totalEntries} filtered entries. The insights are based on rating distributions, network performance patterns, and sentiment analysis.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {!generatedSummary && (
          <Card className="border-dashed border-2">
            <CardContent className="py-12 text-center text-muted-foreground">
              <Sparkles className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>Click "Generate AI Summary" to create an intelligent analysis of your filtered feedback data</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}