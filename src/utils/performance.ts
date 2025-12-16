// Web Vitals monitoring and reporting
import { onCLS, onFCP, onFID, onINP, onLCP, onTTFB, Metric } from 'web-vitals'

type AnalyticsCallback = (metric: Metric) => void

// Send performance metrics to analytics
function sendToAnalytics(metric: Metric) {
  const body = JSON.stringify(metric)
  const url = '/api/analytics'

  // Use `navigator.sendBeacon()` if available, falling back to `fetch()`
  if (navigator.sendBeacon) {
    navigator.sendBeacon(url, body)
  } else {
    fetch(url, {
      body,
      method: 'POST',
      keepalive: true,
      headers: {
        'Content-Type': 'application/json',
      },
    }).catch(console.error)
  }
}

// Report all Web Vitals
export function reportWebVitals(onPerfEntry?: AnalyticsCallback) {
  const callback = onPerfEntry || sendToAnalytics

  onCLS(callback)  // Cumulative Layout Shift
  onFCP(callback)  // First Contentful Paint
  onFID(callback)  // First Input Delay (deprecated, but still measured)
  onINP(callback)  // Interaction to Next Paint
  onLCP(callback)  // Largest Contentful Paint
  onTTFB(callback) // Time to First Byte
}

// Performance thresholds (in milliseconds)
export const PERFORMANCE_THRESHOLDS = {
  LCP: { good: 2500, needsImprovement: 4000 },
  FID: { good: 100, needsImprovement: 300 },
  CLS: { good: 0.1, needsImprovement: 0.25 },
  FCP: { good: 1800, needsImprovement: 3000 },
  TTFB: { good: 800, needsImprovement: 1800 },
  INP: { good: 200, needsImprovement: 500 },
}

// Get performance rating
export function getPerformanceRating(metric: Metric): 'good' | 'needs-improvement' | 'poor' {
  const threshold = PERFORMANCE_THRESHOLDS[metric.name as keyof typeof PERFORMANCE_THRESHOLDS]

  if (!threshold) return 'good'

  if (metric.value <= threshold.good) return 'good'
  if (metric.value <= threshold.needsImprovement) return 'needs-improvement'
  return 'poor'
}
