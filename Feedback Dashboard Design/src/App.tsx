import { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { DashboardPage } from './components/DashboardPage';
import { PlatformPage } from './components/PlatformPage';
import { SummaryPage } from './components/SummaryPage';
import { AnalyticsPage } from './components/AnalyticsPage';

type PageView = 'login' | 'dashboard' | 'platform' | 'summary' | 'analytics';

interface FeedbackRow {
  id: string;
  reviewScore: number;
  networkType: string;
  ratingsCount: number;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageView>('login');
  const [summaryData, setSummaryData] = useState<FeedbackRow[]>([]);

  const handleLogin = () => {
    setCurrentPage('dashboard');
  };

  const handleNavigateToDashboard = () => {
    setCurrentPage('dashboard');
  };

  const handleNavigateToPlatform = () => {
    setCurrentPage('platform');
  };

  const handleNavigateToSummary = (filteredData?: FeedbackRow[]) => {
    if (filteredData) {
      setSummaryData(filteredData);
    }
    setCurrentPage('summary');
  };

  const handleNavigateToAnalytics = () => {
    setCurrentPage('analytics');
  };

  return (
    <>
      {currentPage === 'login' && <LoginPage onLogin={handleLogin} />}
      {currentPage === 'dashboard' && (
        <DashboardPage
          onNavigateToPlatform={handleNavigateToPlatform}
          onNavigateToSummary={handleNavigateToSummary}
          onNavigateToAnalytics={handleNavigateToAnalytics}
        />
      )}
      {currentPage === 'platform' && (
        <PlatformPage
          onNavigateToDashboard={handleNavigateToDashboard}
          onNavigateToSummary={handleNavigateToSummary}
        />
      )}
      {currentPage === 'summary' && (
        <SummaryPage
          onNavigateToDashboard={handleNavigateToDashboard}
          onNavigateToPlatform={handleNavigateToPlatform}
          filteredData={summaryData}
        />
      )}
      {currentPage === 'analytics' && (
        <AnalyticsPage
          onNavigateToDashboard={handleNavigateToDashboard}
        />
      )}
    </>
  );
}