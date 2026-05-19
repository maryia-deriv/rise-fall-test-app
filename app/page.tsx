'use client';

import { useSmartChartsApi } from '@/hooks/use-smartcharts-api';
import { useSmartChartChartData } from '@/hooks/use-smartchart-chart-data';
import { useRiseFallTrading } from '../hooks/use-rise-fall-trading';
import { useAuth } from '@/hooks/use-auth';
import { RiseFallView } from '../components/rise-fall-view';

export default function RiseFallPage() {
  const { authState, accounts, activeAccount, wsUrl, login, signUp, logout, switchAccount } = useAuth();

  const trading = useRiseFallTrading(wsUrl, logout);

  const { chartData } = useSmartChartChartData(trading.ws, trading.isConnected, trading.symbols);
  const { getQuotes, subscribeQuotes, unsubscribeQuotes } = useSmartChartsApi(trading.ws);

  return (
    <RiseFallView
      authState={authState}
      accounts={accounts}
      activeAccount={activeAccount}
      onLogin={login}
      onSignUp={signUp}
      onLogout={logout}
      onSwitchAccount={switchAccount}
      logoSrc="/logo.png"
      ws={trading.ws}
      isConnected={trading.isConnected}
      isLoading={trading.isLoading}
      error={trading.error}
      symbols={trading.symbols}
      activeSymbol={trading.activeSymbol}
      selectSymbol={trading.selectSymbol}
      currentTick={trading.currentTick}
      direction={trading.direction}
      setDirection={trading.setDirection}
      allowEquals={trading.allowEquals}
      setAllowEquals={trading.setAllowEquals}
      stake={trading.stake}
      setStake={trading.setStake}
      duration={trading.duration}
      setDuration={trading.setDuration}
      durationOptions={trading.durationOptions}
      durationUnit={trading.durationUnit}
      setDurationUnit={trading.setDurationUnit}
      endDate={trading.endDate}
      setEndDate={trading.setEndDate}
      endTime={trading.endTime}
      setEndTime={trading.setEndTime}
      proposal={trading.proposal}
      buyContract={trading.buyContract}
      isBuying={trading.isBuying}
      buyResult={trading.buyResult}
      buyError={trading.buyError}
      clearBuyResult={trading.clearBuyResult}
      openPositions={trading.openPositions}
      closedPositions={trading.closedPositions}
      sellContract={trading.sellContract}
      sellingId={trading.sellingId}
      sellError={trading.sellError}
      clearSellError={trading.clearSellError}
      chartData={chartData}
      getQuotes={getQuotes}
      subscribeQuotes={subscribeQuotes}
      unsubscribeQuotes={unsubscribeQuotes}
    />
  );
}
