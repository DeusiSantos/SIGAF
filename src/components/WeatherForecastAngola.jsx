import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Eye, Droplets, Wind, Thermometer, Gauge, MapPin, Calendar, Clock, TrendingUp, BarChart3 } from 'lucide-react';
import CustomInput from './CustomInput'; // Assuming you have a CustomInput component for select inputs
const WeatherForecastAngola = () => {
  const [selectedProvince, setSelectedProvince] = useState('Luanda');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [comparativeData, setComparativeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Lista das 21 províncias de Angola (atualizada para 2025)
  const provinces = [
    { value: 'luanda', label: 'Luanda' },
    { value: 'benguela', label: 'Benguela' },
    { value: 'huila', label: 'Huíla' },
    { value: 'bie', label: 'Bié' },
    { value: 'malanje', label: 'Malanje' },
    { value: 'huambo', label: 'Huambo' },
    { value: 'cabinda', label: 'Cabinda' },
    { value: 'zaire', label: 'Zaire' },
    { value: 'uige', label: 'Uíge' },
    { value: 'cunene', label: 'Cunene' },
    { value: 'namibe', label: 'Namibe' },
    { value: 'lunda_norte', label: 'Lunda Norte' },
    { value: 'lunda_sul', label: 'Lunda Sul' },
    { value: 'moxico', label: 'Moxico' },
    { value: 'quando_cubango', label: 'Quando Cubango' },
    { value: 'bengo', label: 'Bengo' },
    { value: 'cuanza_norte', label: 'Cuanza Norte' },
    { value: 'cuanza_sul', label: 'Cuanza Sul' }
  ];

  const mainCities = ['Luanda', 'Benguela', 'Huambo', 'Lubango'];

  const API_KEY = 'e96a3d66c911424a87f91916252007';

  // Simulating axios
  const axios = {
    get: async (url) => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return { data };
    }
  };

  // Generate mock hourly data for the last 24 hours
  const generateHourlyData = (currentTemp, currentHumidity) => {
    const hours = [];
    const now = new Date();

    for (let i = 23; i >= 0; i--) {
      const time = new Date(now - i * 60 * 60 * 1000);
      const tempVariation = (Math.random() - 0.5) * 6; // ±3°C variation
      const humidityVariation = (Math.random() - 0.5) * 20; // ±10% variation

      hours.push({
        time: time.getHours(),
        temperature: Math.max(15, Math.min(45, currentTemp + tempVariation)),
        humidity: Math.max(20, Math.min(100, currentHumidity + humidityVariation))
      });
    }
    return hours;
  };

  const fetchWeatherData = async (province) => {
    if (!province) return;

    setLoading(true);
    setError('');

    try {
      const location = `${province}, Angola`;

      // Fetch current weather
      const currentUrl = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(location)}&aqi=yes&lang=pt`;
      const currentResponse = await axios.get(currentUrl);
      setWeatherData(currentResponse.data);

      // Fetch 7-day forecast
      const forecastUrl = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(location)}&days=7&aqi=no&alerts=no&lang=pt`;
      const forecastResponse = await axios.get(forecastUrl);
      setForecastData(forecastResponse.data);

      // Fetch comparative data for main cities
      const comparativePromises = mainCities.map(async (city) => {
        try {
          const cityUrl = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(city + ', Angola')}&aqi=no&lang=pt`;
          const cityResponse = await axios.get(cityUrl);
          return {
            name: city,
            temp: cityResponse.data.current.temp_c,
            condition: cityResponse.data.current.condition.text,
            humidity: cityResponse.data.current.humidity
          };
        } catch (error) {
          console.error(`Error fetching data for ${city}:`, error);
          return {
            name: city,
            temp: null,
            condition: 'N/A',
            humidity: null
          };
          
        }
      });

      const comparativeResults = await Promise.all(comparativePromises);
      setComparativeData(comparativeResults);

    } catch (err) {
      setError('Erro ao carregar dados meteorológicos. Tente novamente.');
      console.error('Weather API error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load Luanda weather on component mount
  useEffect(() => {
    fetchWeatherData('Luanda');
  }, []);

  const handleProvinceChange = (value) => {
    setSelectedProvince(value);
    fetchWeatherData(value);
  };

  const getWeatherIcon = (condition, size = "w-16 h-16") => {
    const conditionLower = condition?.toLowerCase() || '';
    if (conditionLower.includes('sun') || conditionLower.includes('clear') || conditionLower.includes('sol')) {
      return <Sun className={`${size} text-amber-500`} />;
    } else if (conditionLower.includes('rain') || conditionLower.includes('chuva') || conditionLower.includes('shower')) {
      return <CloudRain className={`${size} text-blue-500`} />;
    } else {
      return <Cloud className={`${size} text-gray-500`} />;
    }
  };

  const getSmallWeatherIcon = (condition) => {
    return getWeatherIcon(condition, "w-6 h-6");
  };

  const formatDate = () => {
    return new Date().toLocaleDateString('pt-AO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = () => {
    return new Date().toLocaleTimeString('pt-AO', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDayName = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-AO', { weekday: 'short' });
  };

  const hourlyData = weatherData ? generateHourlyData(weatherData.current.temp_c, weatherData.current.humidity) : [];

  return (
    <div className="min-h-screen  bg-blue-50 rounded-md py-8 px-4">
      <div className="w-full mx-auto">
        {/* Header */}
        <div className="text-center mb-11">
          <h1 className="text-5xl font-semibold text-gray-800 mb-2">
            Previsão do Tempo
          </h1>
          <p className="text-gray-600 mt-4 text-lg font-light">
            Condições meteorológicas actualizadas em tempo real
          </p>

          <div className='mt-6 flex justify-center items-center'>
            <span className='w-20 h-1 flex rounded bg-gradient-to-r from-blue-600 to-blue-400'></span>
          </div>
        </div>



        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-600 mt-6 text-lg font-light">Carregando dados meteorológicos...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 rounded-2xl p-6 mb-8">
            <p className="text-red-700 text-center text-lg font-medium">{error}</p>
          </div>
        )}

        {/* Main Content - Weather Data Display */}
        {weatherData && !loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left Column - Main Weather Info */}
            <div className="lg:col-span-2 space-y-8">
              {/* Main Weather Card */}
              <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
                <div className="flex flex-col lg:flex-row items-center justify-between mb-8">
                  <div className="text-center lg:text-left mb-6 lg:mb-0">
                    {/* Province Selector */}
                    <div className=' items-center justify-center w-full'>
                      <div className="  rounded-3xl flex  mb-8  ">
                        <div className="relative w-full max-w-md mx-auto">
                          <MapPin className="w-7 h-7 text-blue-700 absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                          <CustomInput
                            type="select"
                            value={selectedProvince}
                            onChange={handleProvinceChange}
                            options={provinces}
                            iconStart={<MapPin className=" text-blue-500" size={18}  />}
                            placeholder={selectedProvince}
                          />
                        </div>

                      </div>
                    </div>
                    <p className="text-xl text-gray-600 mb-4">
                      {weatherData.location.region}, Angola
                    </p>

                    <div className="flex items-center justify-center lg:justify-start text-gray-500 mb-2">
                      <Calendar className="w-5 h-5 mr-3" />
                      <span className="font-medium">{formatDate()}</span>
                    </div>
                    <div className="flex items-center justify-center lg:justify-start text-gray-500">
                      <Clock className="w-5 h-5 mr-3" />
                      <span className="font-medium">Actualizado às {formatTime()}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    {getWeatherIcon(weatherData.current.condition.text)}
                    <p className="text-xl text-gray-600 mt-4 capitalize text-center">
                      {weatherData.current.condition.text}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="text-center lg:text-left">
                    <div className="text-8xl font-extralight text-gray-800 mb-4">
                      {Math.round(weatherData.current.temp_c)}<span className="text-4xl text-gray-500">°C</span>
                    </div>
                    <p className="text-2xl text-gray-600 font-light">
                      Sensação térmica {Math.round(weatherData.current.feelslike_c)}°C
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 text-center">
                      <Thermometer className="w-8 h-8 text-red-500 mx-auto mb-3" />
                      <div className="text-2xl font-semibold text-gray-800">
                        {Math.round(weatherData.current.temp_c)}°C
                      </div>
                      <p className="text-gray-600 font-medium">Temperatura</p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 text-center">
                      <Droplets className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                      <div className="text-2xl font-semibold text-gray-800">
                        {weatherData.current.humidity}%
                      </div>
                      <p className="text-gray-600 font-medium">Humidade</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Weather Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Wind */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <Wind className="w-8 h-8 text-emerald-500" />
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-800">
                        {Math.round(weatherData.current.wind_kph)}
                      </div>
                      <p className="text-gray-500 text-sm font-medium">km/h</p>
                    </div>
                  </div>
                  <h3 className="text-gray-700 font-semibold mb-1">Vento</h3>
                  <p className="text-gray-500 text-sm">
                    Direção: {weatherData.current.wind_dir}
                  </p>
                </div>

                {/* Pressure */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <Gauge className="w-8 h-8 text-purple-500" />
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-800">
                        {Math.round(weatherData.current.pressure_mb)}
                      </div>
                      <p className="text-gray-500 text-sm font-medium">mb</p>
                    </div>
                  </div>
                  <h3 className="text-gray-700 font-semibold mb-1">Pressão</h3>
                  <p className="text-gray-500 text-sm">Atmosférica</p>
                </div>

                {/* Visibility */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <Eye className="w-8 h-8 text-yellow-500" />
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-800">
                        {weatherData.current.vis_km}
                      </div>
                      <p className="text-gray-500 text-sm font-medium">km</p>
                    </div>
                  </div>
                  <h3 className="text-gray-700 font-semibold mb-1">Visibilidade</h3>
                  <p className="text-gray-500 text-sm">Alcance visual</p>
                </div>

                {/* UV Index */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <Sun className="w-8 h-8 text-orange-500" />
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-800">
                        {weatherData.current.uv}
                      </div>
                      <p className="text-gray-500 text-sm font-medium">
                        {weatherData.current.uv <= 2 ? 'Baixo' :
                          weatherData.current.uv <= 5 ? 'Moderado' :
                            weatherData.current.uv <= 7 ? 'Alto' :
                              weatherData.current.uv <= 10 ? 'Muito Alto' : 'Extremo'}
                      </p>
                    </div>
                  </div>
                  <h3 className="text-gray-700 font-semibold mb-1">Índice UV</h3>
                  <p className="text-gray-500 text-sm">Radiação solar</p>
                </div>
              </div>

              {/* Air Quality */}
              {weatherData.current.air_quality && (
                <div className="bg-white rounded-3xl h-[470px] shadow-xl p-8 border border-gray-100">
                  <h3 className="text-2xl font-light text-gray-800 mb-8 text-center">
                    Qualidade do Ar
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center p-6 bg-gray-50 rounded-2xl">
                      <p className="text-gray-500 text-sm font-medium mb-2">Monóxido de Carbono</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {Math.round(weatherData.current.air_quality.co)}
                      </p>
                      <p className="text-gray-500 text-xs">μg/m³</p>
                    </div>
                    <div className="text-center p-6 bg-gray-50 rounded-2xl">
                      <p className="text-gray-500 text-sm font-medium mb-2">Dióxido de Nitrogénio</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {Math.round(weatherData.current.air_quality.no2)}
                      </p>
                      <p className="text-gray-500 text-xs">μg/m³</p>
                    </div>
                    <div className="text-center p-6 bg-gray-50 rounded-2xl">
                      <p className="text-gray-500 text-sm font-medium mb-2">Ozónio</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {Math.round(weatherData.current.air_quality.o3)}
                      </p>
                      <p className="text-gray-500 text-xs">μg/m³</p>
                    </div>
                    <div className="text-center p-6 bg-gray-50 rounded-2xl">
                      <p className="text-gray-500 text-sm font-medium mb-2">Partículas Finas</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {Math.round(weatherData.current.air_quality.pm2_5)}
                      </p>
                      <p className="text-gray-500 text-xs">μg/m³</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">

              {/* 7-Day Forecast */}
              {forecastData && (
                <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                    Previsão 7 Dias
                  </h3>
                  <div className="space-y-4">
                    {forecastData.forecast.forecastday.map((day, index) => (
                      <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                        <div className="flex items-center space-x-3">
                          {getSmallWeatherIcon(day.day.condition.text)}
                          <div>
                            <p className="font-medium text-gray-800">
                              {index === 0 ? 'Hoje' : getDayName(day.date)}
                            </p>
                            <p className="text-sm text-gray-500 capitalize">
                              {day.day.condition.text}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-800">
                            {Math.round(day.day.maxtemp_c)}°
                          </p>
                          <p className="text-sm text-gray-500">
                            {Math.round(day.day.mintemp_c)}°
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Comparative Panel */}
              <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-green-500" />
                  Outras Cidades
                </h3>
                <div className="space-y-4">
                  {comparativeData.map((city, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center space-x-3">
                        {city.temp !== null ? getSmallWeatherIcon(city.condition) : <div className="w-6 h-6 bg-gray-300 rounded-full"></div>}
                        <div>
                          <p className="font-medium text-gray-800">{city.name}</p>
                          <p className="text-sm text-gray-500">{city.humidity !== null ? `${city.humidity}% humidade` : 'N/A'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-800">
                          {city.temp !== null ? `${Math.round(city.temp)}°C` : 'N/A'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>



            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherForecastAngola;