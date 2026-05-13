import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { createChart, CrosshairMode } from 'lightweight-charts';

const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;
const DEFAULT_COMPANY = { label: 'Reliance Industries', symbol: 'RELIANCE.BSE' };
const RANGE_OPTIONS = ['1M', '3M', '6M', '1Y', 'All'];
const VIEW_OPTIONS = [
  { value: 'intraday', label: '60 Min' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];
const CHART_TYPES = [
  { value: 'candlestick', label: 'Candles' },
  { value: 'line', label: 'Line' },
  { value: 'area', label: 'Area' },
  { value: 'bar', label: 'Bars' },
];
const TOGGLE_OPTIONS = [
  { value: 'show', label: 'Show' },
  { value: 'hide', label: 'Hide' },
];

const generateMockData = (points = 120) => {
  const candles = [];
  let currentPrice = 100;

  for (let index = 0; index < points; index += 1) {
    const time = new Date(2025, 0, index + 1).getTime() / 1000;
    const open = currentPrice;
    const close = open + (Math.random() - 0.47) * 4.8;
    const high = Math.max(open, close) + Math.random() * 2.5;
    const low = Math.min(open, close) - Math.random() * 2.5;
    const volume = Math.floor(Math.random() * 800000) + 100000;

    candles.push({
      time,
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume,
    });

    currentPrice = close;
  }

  return candles;
};

const normaliseSeries = (entries, accessor) =>
  entries
    .map(([stamp, values]) => accessor(stamp, values))
    .filter(Boolean)
    .sort((a, b) => a.time - b.time);

const parseTimeToUnix = (stamp) => {
  if (stamp.includes(' ')) {
    return Math.floor(new Date(`${stamp.replace(' ', 'T')}Z`).getTime() / 1000);
  }

  return Math.floor(new Date(`${stamp}T00:00:00Z`).getTime() / 1000);
};

const fetchConfigForView = (view) => {
  if (view === 'intraday') {
    return {
      params: {
        function: 'TIME_SERIES_INTRADAY',
        interval: '60min',
        outputsize: 'compact',
      },
      key: 'Time Series (60min)',
      normalizer: (series) =>
        normaliseSeries(Object.entries(series || {}), (stamp, values) => ({
          time: parseTimeToUnix(stamp),
          open: Number(values['1. open']),
          high: Number(values['2. high']),
          low: Number(values['3. low']),
          close: Number(values['4. close']),
          volume: Number(values['5. volume'] || 0),
        })),
    };
  }

  if (view === 'weekly') {
    return {
      params: { function: 'TIME_SERIES_WEEKLY_ADJUSTED' },
      key: 'Weekly Adjusted Time Series',
      normalizer: (series) =>
        normaliseSeries(Object.entries(series || {}), (stamp, values) => ({
          time: parseTimeToUnix(stamp),
          open: Number(values['1. open']),
          high: Number(values['2. high']),
          low: Number(values['3. low']),
          close: Number(values['4. close']),
          volume: Number(values['6. volume'] || 0),
        })),
    };
  }

  if (view === 'monthly') {
    return {
      params: { function: 'TIME_SERIES_MONTHLY_ADJUSTED' },
      key: 'Monthly Adjusted Time Series',
      normalizer: (series) =>
        normaliseSeries(Object.entries(series || {}), (stamp, values) => ({
          time: parseTimeToUnix(stamp),
          open: Number(values['1. open']),
          high: Number(values['2. high']),
          low: Number(values['3. low']),
          close: Number(values['4. close']),
          volume: Number(values['6. volume'] || 0),
        })),
    };
  }

  return {
    params: {
      function: 'TIME_SERIES_DAILY_ADJUSTED',
      outputsize: 'full',
    },
    key: 'Time Series (Daily)',
    normalizer: (series) =>
      normaliseSeries(Object.entries(series || {}), (stamp, values) => ({
        time: parseTimeToUnix(stamp),
        open: Number(values['1. open']),
        high: Number(values['2. high']),
        low: Number(values['3. low']),
        close: Number(values['4. close']),
        volume: Number(values['6. volume'] || values['5. volume'] || 0),
      })),
  };
};

const applyRange = (sourceData, range) => {
  const total = sourceData.length;
  if (!total || range === 'All') {
    return sourceData;
  }

  const lengths = {
    '1M': 22,
    '3M': 66,
    '6M': 132,
    '1Y': 264,
  };

  return sourceData.slice(-Math.min(lengths[range] || total, total));
};

const movingAverage = (sourceData, period, mode = 'sma') =>
  sourceData
    .map((point, index) => {
      if (index + 1 < period) {
        return null;
      }

      if (mode === 'ema') {
        const multiplier = 2 / (period + 1);
        const closes = sourceData.slice(0, index + 1).map((item) => item.close);
        let ema = closes.slice(0, period).reduce((sum, value) => sum + value, 0) / period;

        for (let cursor = period; cursor < closes.length; cursor += 1) {
          ema = (closes[cursor] - ema) * multiplier + ema;
        }

        return { time: point.time, value: Number(ema.toFixed(2)) };
      }

      const window = sourceData.slice(index + 1 - period, index + 1);
      const average = window.reduce((sum, value) => sum + value.close, 0) / period;
      return { time: point.time, value: Number(average.toFixed(2)) };
    })
    .filter(Boolean);

const volumeBars = (sourceData) =>
  sourceData.map((point) => ({
    time: point.time,
    value: point.volume,
    color: point.close >= point.open ? 'rgba(20, 184, 166, 0.46)' : 'rgba(249, 115, 22, 0.46)',
  }));

const percentChange = (current, previous) => {
  if (!previous) {
    return 0;
  }

  return ((current - previous) / previous) * 100;
};

const formatVolume = (value) => {
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(2)}B`;
  }
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(2)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return `${value}`;
};

const formatDateLabel = (time) =>
  new Date(time * 1000).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

const baseSeriesPoint = (chartType, point) => {
  if (chartType === 'line' || chartType === 'area') {
    return { time: point.time, value: point.close };
  }

  return point;
};

const normaliseSearchResults = (matches = []) =>
  matches
    .filter((item) => item['4. region'] === 'India')
    .filter((item) => item['1. symbol']?.endsWith('.BSE') || item['1. symbol']?.endsWith('.NSE'))
    .map((item) => ({
      label: item['2. name'],
      symbol: item['1. symbol'],
    }));

export default function TradingChart() {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const resizeObserverRef = useRef(null);

  const [symbol, setSymbol] = useState(DEFAULT_COMPANY.symbol);
  const [companyName, setCompanyName] = useState(DEFAULT_COMPANY.label);
  const [companySearch, setCompanySearch] = useState(DEFAULT_COMPANY.label);
  const [companyResults, setCompanyResults] = useState([DEFAULT_COMPANY]);
  const [searchStatus, setSearchStatus] = useState('Search Indian companies and choose a result.');
  const [view, setView] = useState('daily');
  const [chartType, setChartType] = useState('candlestick');
  const [range, setRange] = useState('6M');
  const [showVolume, setShowVolume] = useState(true);
  const [showSma20, setShowSma20] = useState(true);
  const [showSma50, setShowSma50] = useState(false);
  const [showEma20, setShowEma20] = useState(false);
  const [rawData, setRawData] = useState([]);
  const [status, setStatus] = useState('Loading market data...');
  const [sourceLabel, setSourceLabel] = useState('Live');

  const visibleData = applyRange(rawData, range);
  const lastPoint = visibleData[visibleData.length - 1] || null;
  const previousPoint = visibleData[visibleData.length - 2] || null;
  const changeValue = lastPoint && previousPoint ? lastPoint.close - previousPoint.close : 0;
  const changePct = lastPoint && previousPoint ? percentChange(lastPoint.close, previousPoint.close) : 0;

  useEffect(() => {
    let ignore = false;

    if (!API_KEY) {
      setCompanyResults([DEFAULT_COMPANY]);
      setSearchStatus('API key missing, search is unavailable.');
      return () => {
        ignore = true;
      };
    }

    const trimmed = companySearch.trim();
    if (trimmed.length < 2) {
      setCompanyResults([{ label: companyName, symbol }]);
      setSearchStatus('Type at least 2 characters to search Indian companies.');
      return () => {
        ignore = true;
      };
    }

    const timer = setTimeout(async () => {
      try {
        setSearchStatus(`Searching for "${trimmed}"...`);
        const response = await axios.get('https://www.alphavantage.co/query', {
          params: {
            function: 'SYMBOL_SEARCH',
            keywords: trimmed,
            apikey: API_KEY,
          },
        });

        const results = normaliseSearchResults(response.data.bestMatches);

        if (!ignore) {
          if (results.length) {
            setCompanyResults(results);
            setSearchStatus(`${results.length} Indian matches found.`);
          } else {
            setCompanyResults([{ label: companyName, symbol }]);
            setSearchStatus(`No Indian company matches for "${trimmed}".`);
          }
        }
      } catch {
        if (!ignore) {
          setCompanyResults([{ label: companyName, symbol }]);
          setSearchStatus('Search is temporarily unavailable.');
        }
      }
    }, 450);

    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [companyName, companySearch, symbol]);

  useEffect(() => {
    let ignore = false;

    const fetchSeries = async () => {
      if (!API_KEY) {
        const fallback = generateMockData();
        if (!ignore) {
          setRawData(fallback);
          setStatus('Alpha Vantage API key missing, showing demo market data.');
          setSourceLabel('Demo');
        }
        return;
      }

      try {
        setStatus(`Loading ${symbol} ${view} data...`);
        const config = fetchConfigForView(view);
        const response = await axios.get('https://www.alphavantage.co/query', {
          params: {
            symbol,
            apikey: API_KEY,
            ...config.params,
          },
        });

        const payload = response.data;
        const note = payload.Note || payload.Information || payload['Error Message'];
        const normalized = config.normalizer(payload[config.key]);

        if (note || normalized.length === 0) {
          throw new Error(note || 'No market data returned for this symbol.');
        }

        if (!ignore) {
          setRawData(normalized);
          setStatus(`Showing ${view} data for ${companyName} (${symbol}).`);
          setSourceLabel('Live');
        }
      } catch (error) {
        const fallback = generateMockData();
        if (!ignore) {
          setRawData(fallback);
          setStatus(`Using demo market data for ${companyName}. ${error.message}`);
          setSourceLabel('Demo');
        }
      }
    };

    fetchSeries();

    return () => {
      ignore = true;
    };
  }, [companyName, symbol, view]);

  useEffect(() => {
    if (!chartContainerRef.current || visibleData.length === 0) {
      return undefined;
    }

    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: window.innerWidth < 768 ? 340 : 500,
      layout: {
        background: { color: '#ffffff' },
        textColor: '#5b6b83',
      },
      grid: {
        vertLines: { color: 'rgba(12, 25, 46, 0.05)' },
        horzLines: { color: 'rgba(12, 25, 46, 0.05)' },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          visible: false,
          labelVisible: false,
        },
        horzLine: {
          visible: false,
          labelVisible: false,
        },
      },
      rightPriceScale: {
        borderColor: 'rgba(12, 25, 46, 0.08)',
      },
      timeScale: {
        borderColor: 'rgba(12, 25, 46, 0.08)',
        timeVisible: view === 'intraday',
      },
    });

    chartRef.current = chart;

    let primarySeries;
    if (chartType === 'candlestick') {
      primarySeries = chart.addCandlestickSeries({
        upColor: '#169976',
        downColor: '#f26a3d',
        borderVisible: false,
        wickUpColor: '#169976',
        wickDownColor: '#f26a3d',
      });
    } else if (chartType === 'bar') {
      primarySeries = chart.addBarSeries({
        upColor: '#169976',
        downColor: '#f26a3d',
      });
    } else if (chartType === 'area') {
      primarySeries = chart.addAreaSeries({
        lineColor: '#19376d',
        topColor: 'rgba(25, 55, 109, 0.26)',
        bottomColor: 'rgba(25, 55, 109, 0.02)',
        lineWidth: 2,
      });
    } else {
      primarySeries = chart.addLineSeries({
        color: '#19376d',
        lineWidth: 2,
      });
    }

    primarySeries.setData(visibleData.map((point) => baseSeriesPoint(chartType, point)));

    if (showVolume) {
      const volumeSeries = chart.addHistogramSeries({
        priceFormat: { type: 'volume' },
        priceScaleId: '',
        scaleMargins: {
          top: 0.8,
          bottom: 0,
        },
      });
      volumeSeries.setData(volumeBars(visibleData));
    }

    if (showSma20) {
      const sma20Series = chart.addLineSeries({ color: '#f0a500', lineWidth: 2 });
      sma20Series.setData(movingAverage(visibleData, 20, 'sma'));
    }

    if (showSma50) {
      const sma50Series = chart.addLineSeries({ color: '#6c63ff', lineWidth: 2 });
      sma50Series.setData(movingAverage(visibleData, 50, 'sma'));
    }

    if (showEma20) {
      const ema20Series = chart.addLineSeries({ color: '#e63946', lineWidth: 2 });
      ema20Series.setData(movingAverage(visibleData, 20, 'ema'));
    }

    chart.timeScale().fitContent();

    resizeObserverRef.current = new ResizeObserver((entries) => {
      const nextWidth = entries[0]?.contentRect?.width;
      if (nextWidth) {
        chart.applyOptions({ width: nextWidth });
      }
    });
    resizeObserverRef.current.observe(chartContainerRef.current);

    return () => {
      resizeObserverRef.current?.disconnect();
      resizeObserverRef.current = null;
      chart.remove();
      chartRef.current = null;
    };
  }, [chartType, showEma20, showSma20, showSma50, showVolume, view, visibleData]);

  const compactMetrics = lastPoint
    ? [
        { label: 'Last', value: lastPoint.close.toFixed(2) },
        { label: 'Move', value: `${changeValue >= 0 ? '+' : ''}${changeValue.toFixed(2)}` },
        { label: 'Move %', value: `${changePct >= 0 ? '+' : ''}${changePct.toFixed(2)}%` },
        { label: 'Volume', value: formatVolume(lastPoint.volume ?? 0) },
      ]
    : [];

  return (
    <section className="market-stage market-stage-light">
      <div className="market-compact-shell">
        <div className="market-compact-head">
          <div>
            <span className="market-compact-eyebrow">Inspired by Ardra Tech Solutions</span>
            <h2>Compact Market Panel</h2>
          </div>
          <div className="market-compact-identity">
            <strong>{companyName}</strong>
            <span>{symbol}</span>
          </div>
        </div>

        <div className="market-toolbar">
          <div className="market-toolbar-item market-toolbar-search">
            <label htmlFor="companySearch">Search</label>
            <input
              id="companySearch"
              value={companySearch}
              onChange={(event) => setCompanySearch(event.target.value)}
              placeholder="Search company"
            />
          </div>

          <div className="market-toolbar-item">
            <label htmlFor="companyResults">Company</label>
            <select
              id="companyResults"
              value={symbol}
              onChange={(event) => {
                const next = companyResults.find((item) => item.symbol === event.target.value);
                if (next) {
                  setSymbol(next.symbol);
                  setCompanyName(next.label);
                  setCompanySearch(next.label);
                }
              }}
            >
              {companyResults.map((company) => (
                <option key={company.symbol} value={company.symbol}>
                  {company.label}
                </option>
              ))}
            </select>
          </div>

          <div className="market-toolbar-item">
            <label htmlFor="marketView">View</label>
            <select id="marketView" value={view} onChange={(event) => setView(event.target.value)}>
              {VIEW_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div className="market-toolbar-item">
            <label htmlFor="chartType">Chart</label>
            <select id="chartType" value={chartType} onChange={(event) => setChartType(event.target.value)}>
              {CHART_TYPES.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div className="market-toolbar-item">
            <label htmlFor="rangeType">Range</label>
            <select id="rangeType" value={range} onChange={(event) => setRange(event.target.value)}>
              {RANGE_OPTIONS.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="market-toolbar-item">
            <label htmlFor="volumeToggle">Volume</label>
            <select id="volumeToggle" value={showVolume ? 'show' : 'hide'} onChange={(event) => setShowVolume(event.target.value === 'show')}>
              {TOGGLE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div className="market-toolbar-item">
            <label htmlFor="sma20Toggle">SMA 20</label>
            <select id="sma20Toggle" value={showSma20 ? 'show' : 'hide'} onChange={(event) => setShowSma20(event.target.value === 'show')}>
              {TOGGLE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div className="market-toolbar-item">
            <label htmlFor="sma50Toggle">SMA 50</label>
            <select id="sma50Toggle" value={showSma50 ? 'show' : 'hide'} onChange={(event) => setShowSma50(event.target.value === 'show')}>
              {TOGGLE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div className="market-toolbar-item">
            <label htmlFor="ema20Toggle">EMA 20</label>
            <select id="ema20Toggle" value={showEma20 ? 'show' : 'hide'} onChange={(event) => setShowEma20(event.target.value === 'show')}>
              {TOGGLE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="market-toolbar-note">{searchStatus}</div>

        <div className="market-compact-main">
          <div className="market-compact-chart-card">
            <div className="market-compact-chart-head">
              <div>
                <span className="market-compact-chip">Latest Bar</span>
                <h3>{lastPoint ? formatDateLabel(lastPoint.time) : 'No data loaded'}</h3>
              </div>
              <div className={`market-compact-status market-compact-status-${sourceLabel.toLowerCase()}`}>
                {sourceLabel}
              </div>
              <div className="market-compact-metrics">
                {compactMetrics.map((item) => (
                  <div key={item.label} className="market-compact-metric">
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
            </div>
            <div className="market-compact-substatus">{status}</div>
            <div ref={chartContainerRef} className="market-compact-chart-canvas" />
          </div>
        </div>
      </div>
    </section>
  );
}
