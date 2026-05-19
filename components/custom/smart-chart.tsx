'use client';

import { useCallback, useMemo, useState } from 'react';
import { useTheme } from 'next-themes';
import {
  ChartMode,
  ChartTitle,
  DrawTools,
  Share,
  setSmartChartsPublicPath,
  SmartChart,
  StudyLegend,
  ToolbarWidget,
  Views,
} from '@deriv-com/smartcharts-champion';
import type { UseSmartChartsApiReturn } from '@/hooks/use-smartcharts-api';
import type { SmartChartChartData } from '@/hooks/use-smartchart-chart-data';
import { SMART_CHART_DRAWING_TOOL_POSITION } from '@/lib/smartchart-constants';

// In preview deployments the app is served under a basePath, so
// SmartCharts must load its lazy assets from that same prefix.
const smartChartsPublicPath =
  process.env.NEXT_PUBLIC_BASE_PATH ? `${process.env.NEXT_PUBLIC_BASE_PATH}/` : '/';
setSmartChartsPublicPath(smartChartsPublicPath);

export interface SmartChartWrapperProps {
  /** Unique chart instance id (e.g. `"rise-fall-chart"`, `"accumulator-chart"`). */
  chartId: string;
  /** Stable key when the underlying symbol changes. */
  symbolKey: string;
  symbol: string | undefined;
  isConnectionOpened: boolean;
  isMobile: boolean;
  chartData: SmartChartChartData | undefined;
  getQuotes: UseSmartChartsApiReturn['getQuotes'];
  subscribeQuotes: UseSmartChartsApiReturn['subscribeQuotes'];
  unsubscribeQuotes: UseSmartChartsApiReturn['unsubscribeQuotes'];
  /** Called when the user selects a symbol from the built-in ChartTitle market browser. */
  onSymbolChange?: (symbol: string) => void;
  /** Whether SmartCharts should expect a live subscription feed. Defaults to true. */
  isLive?: boolean;
  /** Unix epoch (seconds) to freeze the chart at for preview mode. */
  endEpoch?: number;
  /** Default granularity (0 = ticks, 60 = 1m candles, etc.). Defaults to 0. */
  defaultGranularity?: number;
}

export function SmartChartWrapper({
  chartId,
  symbolKey,
  symbol,
  isConnectionOpened,
  isMobile,
  chartData,
  getQuotes,
  subscribeQuotes,
  unsubscribeQuotes,
  onSymbolChange,
  isLive = true,
  endEpoch,
  defaultGranularity = 0,
}: SmartChartWrapperProps) {
  const [chartType, setChartType] = useState<string | undefined>('line');
  const [granularity, setGranularity] = useState(defaultGranularity);

  const { resolvedTheme } = useTheme();
  const chartTheme =
    (resolvedTheme ?? (document.documentElement.classList.contains('dark') ? 'dark' : 'light')) === 'dark'
      ? 'dark'
      : 'light';

  const chartSettings = useMemo(
    () => ({
      language: 'en' as const,
      isHighestLowestMarkerEnabled: false,
      theme: chartTheme,
    }),
    [chartTheme]
  );

  const toolbarWidget = useCallback(
    () => (
      <ToolbarWidget>
        <ChartMode onChartType={setChartType} onGranularity={setGranularity} />
        {!isMobile && <StudyLegend />}
        {!isMobile && <Views onChartType={setChartType} onGranularity={setGranularity} />}
        <DrawTools />
        {!isMobile && <Share />}
      </ToolbarWidget>
    ),
    [isMobile]
  );

  const topWidgets = useCallback(
    () => <ChartTitle onChange={onSymbolChange} />,
    [onSymbolChange]
  );

  return (
    <div className="relative h-full min-h-0 w-full overflow-clip rounded-md border border-border/50 bg-muted/30">
      <SmartChart
        key={symbolKey}
        chartControlsWidgets={null}
        chartData={chartData}
        chartStatusListener={() => {}}
        chartType={chartType}
        clearChart={false}
        drawingToolFloatingMenuPosition={
          isMobile ? SMART_CHART_DRAWING_TOOL_POSITION.mobile : SMART_CHART_DRAWING_TOOL_POSITION.desktop
        }
        enabledChartFooter={false}
        enabledNavigationWidget={!isMobile}
        getQuotes={getQuotes}
        granularity={granularity}
        id={chartId}
        isConnectionOpened={isConnectionOpened}
        isLive={isLive}
        isMobile={isMobile}
        isVerticalScrollEnabled={false}
        {...(endEpoch !== undefined && { endEpoch })}
        maxTick={isMobile ? (granularity === 0 ? 8 : 24) : undefined}
        onSettingsChange={() => {}}
        settings={chartSettings}
        stateChangeListener={() => {}}
        subscribeQuotes={subscribeQuotes}
        symbol={symbol}
        toolbarWidget={toolbarWidget}
        topWidgets={topWidgets}
        unsubscribeQuotes={unsubscribeQuotes}
      />
    </div>
  );
}
