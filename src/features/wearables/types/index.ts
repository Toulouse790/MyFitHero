// Export des types de la feature wearables

// ========================================
// WEARABLES TYPES
// ========================================

export interface WearableDevice {
  id: string;
  user_id: string;
  device_type: DeviceType;
  brand: WearableBrand;
  model: string;
  device_name?: string;
  serial_number?: string;
  firmware_version?: string;
  battery_level?: number;
  connection_status: ConnectionStatus;
  last_sync: Date;
  connected_at: Date;
  sync_frequency: SyncFrequency;
  enabled_metrics: MetricType[];
  timezone?: string;
}

export interface WearableData {
  id: string;
  device_id: string;
  user_id: string;
  data_type: DataType;
  recorded_at: Date;
  synced_at: Date;
  raw_data: Record<string, any>;
  processed_data: ProcessedData;
  quality_score?: number; // 0-100
  confidence_level?: number; // 0-100
}

export interface HeartRateData {
  timestamp: Date;
  heart_rate: number; // bpm
  heart_rate_zone?: HeartRateZone;
  context?: ActivityContext;
  resting_heart_rate?: number;
  max_heart_rate?: number;
  hrv?: number; // Heart Rate Variability in ms
}

export interface ActivityData {
  id: string;
  device_id: string;
  activity_type: ActivityType;
  start_time: Date;
  end_time: Date;
  duration: number; // seconds
  calories_burned?: number;
  distance?: number; // meters
  steps?: number;
  average_heart_rate?: number;
  max_heart_rate?: number;
  elevation_gain?: number; // meters
  pace?: number; // seconds per km
  speed?: number; // km/h
  gps_data?: GPSPoint[];
  zones_time?: ZoneTime[];
}

export interface SleepData {
  id: string;
  device_id: string;
  sleep_start: Date;
  sleep_end: Date;
  total_sleep_time: number; // minutes
  deep_sleep_time?: number;
  light_sleep_time?: number;
  rem_sleep_time?: number;
  awake_time?: number;
  sleep_efficiency?: number; // percentage
  sleep_score?: number; // 0-100
  restlessness?: number;
  heart_rate_during_sleep?: HeartRateData[];
}

export interface StepsData {
  timestamp: Date;
  steps_count: number;
  calories_burned?: number;
  distance?: number; // meters
  active_minutes?: number;
  floors_climbed?: number;
  hourly_steps?: HourlySteps[];
}

// ========================================
// ENUMS & TYPES
// ========================================

export type DeviceType = 
  | 'fitness_tracker'
  | 'smartwatch'
  | 'heart_rate_monitor'
  | 'smart_scale'
  | 'gps_watch'
  | 'smart_ring'
  | 'chest_strap'
  | 'cycling_computer';

export type WearableBrand = 
  | 'fitbit'
  | 'garmin'
  | 'apple'
  | 'samsung'
  | 'polar'
  | 'suunto'
  | 'amazfit'
  | 'withings'
  | 'oura'
  | 'whoop'
  | 'strava'
  | 'myfitnesspal'
  | 'google_fit'
  | 'health_connect'
  | 'other';

export type ConnectionStatus = 
  | 'connected'
  | 'disconnected'
  | 'syncing'
  | 'error'
  | 'low_battery'
  | 'out_of_range';

export type SyncFrequency = 
  | 'realtime'
  | 'every_15_minutes'
  | 'hourly'
  | 'twice_daily'
  | 'daily'
  | 'manual';

export type MetricType = 
  | 'heart_rate'
  | 'steps'
  | 'sleep'
  | 'activity'
  | 'calories'
  | 'distance'
  | 'floors'
  | 'stress'
  | 'body_battery'
  | 'spo2'
  | 'body_temperature'
  | 'weight'
  | 'body_composition';

export type DataType = 
  | 'heart_rate'
  | 'activity'
  | 'sleep'
  | 'steps'
  | 'weight'
  | 'body_composition'
  | 'stress'
  | 'recovery'
  | 'nutrition'
  | 'hydration';

export type HeartRateZone = 
  | 'resting'
  | 'fat_burn'
  | 'cardio'
  | 'peak'
  | 'maximum';

export type ActivityType = 
  | 'walking'
  | 'running'
  | 'cycling'
  | 'swimming'
  | 'strength_training'
  | 'yoga'
  | 'hiking'
  | 'dancing'
  | 'sports'
  | 'other';

export type ActivityContext = 
  | 'resting'
  | 'active'
  | 'workout'
  | 'recovery'
  | 'stress'
  | 'sleep';

// ========================================
// SUPPORTING INTERFACES
// ========================================

export interface ProcessedData {
  normalized_value?: number;
  percentile?: number;
  trend?: 'increasing' | 'decreasing' | 'stable';
  anomaly_detected?: boolean;
  recommendations?: string[];
}

export interface GPSPoint {
  latitude: number;
  longitude: number;
  altitude?: number;
  timestamp: Date;
  accuracy?: number;
  speed?: number;
}

export interface ZoneTime {
  zone: HeartRateZone;
  time_in_zone: number; // seconds
  percentage: number;
}

export interface HourlySteps {
  hour: number; // 0-23
  steps: number;
  calories?: number;
  active_minutes?: number;
}

export interface DeviceIntegration {
  id: string;
  user_id: string;
  provider: WearableBrand;
  provider_user_id: string;
  access_token: string;
  refresh_token?: string;
  token_expires_at?: Date;
  scopes: string[];
  last_sync: Date;
  sync_enabled: boolean;
  auto_sync: boolean;
  data_retention_days: number;
}

export interface SyncStatus {
  device_id: string;
  last_sync_attempt: Date;
  last_successful_sync: Date;
  sync_status: 'success' | 'error' | 'partial' | 'in_progress';
  error_message?: string;
  records_synced: number;
  records_failed: number;
  next_sync_scheduled?: Date;
}

export interface DataQuality {
  device_id: string;
  data_type: DataType;
  quality_score: number; // 0-100
  completeness: number; // percentage
  accuracy_estimate: number; // percentage
  last_assessed: Date;
  issues_detected: QualityIssue[];
}

export interface QualityIssue {
  type: 'missing_data' | 'outlier' | 'inconsistent' | 'delayed';
  description: string;
  severity: 'low' | 'medium' | 'high';
  detected_at: Date;
}

export interface WearableAnalytics {
  user_id: string;
  device_id: string;
  period_start: Date;
  period_end: Date;
  total_active_days: number;
  average_daily_steps: number;
  average_sleep_duration: number;
  average_heart_rate: number;
  total_calories_burned: number;
  most_active_time: string;
  sleep_consistency_score: number;
  activity_trends: ActivityTrend[];
}

export interface ActivityTrend {
  metric: MetricType;
  trend_direction: 'improving' | 'declining' | 'stable';
  change_percentage: number;
  significance: 'low' | 'medium' | 'high';
}

export interface DeviceRecommendation {
  user_id: string;
  recommended_devices: RecommendedDevice[];
  based_on: string[];
  updated_at: Date;
}

export interface RecommendedDevice {
  brand: WearableBrand;
  model: string;
  device_type: DeviceType;
  match_score: number; // 0-100
  reasons: string[];
  estimated_price: number;
  key_features: string[];
}
