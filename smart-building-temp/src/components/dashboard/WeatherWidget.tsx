'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { apiClient } from '@/lib/api';
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  Snowflake, 
  Wind,
  Droplets,
  Eye,
  RefreshCw 
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export function WeatherWidget() {
  const { t } = useLanguage();

  const { data: weatherData, isLoading, refetch } = useQuery({
    queryKey: ['weather'],
    queryFn: () => apiClient.getWeatherInfo(),
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
  });

  const weather = weatherData?.data;

  const getWeatherIcon = (condition: string) => {
    const normalizedCondition = condition.toLowerCase();
    
    if (normalizedCondition.includes('sun') || normalizedCondition.includes('clear')) {
      return Sun;
    } else if (normalizedCondition.includes('rain') || normalizedCondition.includes('shower')) {
      return CloudRain;
    } else if (normalizedCondition.includes('snow')) {
      return Snowflake;
    } else if (normalizedCondition.includes('cloud')) {
      return Cloud;
    }
    
    return Sun; // Default
  };

  const getGradientClass = (condition: string) => {
    const normalizedCondition = condition.toLowerCase();
    
    if (normalizedCondition.includes('sun') || normalizedCondition.includes('clear')) {
      return 'from-yellow-400 to-orange-500';
    } else if (normalizedCondition.includes('rain')) {
      return 'from-gray-400 to-blue-500';
    } else if (normalizedCondition.includes('snow')) {
      return 'from-gray-200 to-blue-300';
    } else if (normalizedCondition.includes('cloud')) {
      return 'from-gray-300 to-gray-500';
    }
    
    return 'from-blue-400 to-blue-600'; // Default
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-2/3 mb-4"></div>
            <div className="h-16 bg-gray-200 rounded-full w-16 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!weather) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t('dashboard.current_weather')}
            </h3>
            <p className="text-gray-500">Weather data unavailable</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const WeatherIcon = getWeatherIcon(weather.condition);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="overflow-hidden">
        {/* Header */}
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              {t('dashboard.current_weather')}
            </CardTitle>
            <button
              onClick={() => refetch()}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </CardHeader>

        {/* Weather Display */}
        <div className={`p-6 bg-gradient-to-br ${getGradientClass(weather.condition)} text-white`}>
        <div className="text-center">
          {/* Weather Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex justify-center mb-4"
          >
            <div className="w-16 h-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center backdrop-blur-sm">
              <WeatherIcon className="h-8 w-8" />
            </div>
          </motion.div>

          {/* Temperature */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-2"
          >
            <span className="text-3xl font-bold">
              {weather.temperature}°C
            </span>
          </motion.div>

          {/* Condition */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-white text-opacity-90 font-medium capitalize"
          >
            {weather.condition}
          </motion.p>
        </div>
      </div>

      {/* Weather Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="p-4 bg-gray-50"
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center">
            <Droplets className="h-4 w-4 text-blue-500 mr-2" />
            <div>
              <p className="text-xs text-gray-500">Humidity</p>
              <p className="font-semibold text-gray-900">{weather.humidity}%</p>
            </div>
          </div>

          <div className="flex items-center">
            <Wind className="h-4 w-4 text-gray-500 mr-2" />
            <div>
              <p className="text-xs text-gray-500">Wind Speed</p>
              <p className="font-semibold text-gray-900">{weather.windSpeed} km/h</p>
            </div>
          </div>
        </div>

          {/* Weather-based recommendations */}
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              {weather.temperature > 25 ? (
                "Perfect weather for the pool!"
              ) : weather.temperature < 15 ? (
                "Cozy weather - enjoy our indoor amenities!"
              ) : (
                "Great weather for exploring the city!"
              )}
            </p>
          </div>
        </motion.div>
      </Card>
    </motion.div>
  );
}