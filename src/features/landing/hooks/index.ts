// Main modular hooks
export { useLandingContent, type LandingContent, type FeatureHighlight, type Testimonial, type UseLandingContentReturn } from './useLandingContent';
export { useLandingAnalytics, type LandingMetrics, type CTAStats, type UseLandingAnalyticsReturn } from './useLandingAnalytics';
export { useLandingABTest, type ABTestResult, type UseLandingABTestReturn } from './useLandingABTest';
export { useLandingPerformance, type UseLandingPerformanceReturn } from './useLandingPerformance';

// Legacy hook for backward compatibility
export { useLanding, type UseLandingReturn } from './useLanding';
