import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Moon, CloudMoon, CloudSun, ChevronDown } from 'lucide-react';

interface WeatherData {
    temp: number;
    condition: 'Sunny' | 'Cloudy' | 'Rainy' | 'Partly Cloudy';
    location: string;
    isNight: boolean;
}

const WeatherWidget: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [location, setLocation] = useState('Panjim');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const locations = [
        'Panjim', 'Margao', 'Mapusa', 'Calangute',
        'Canacona', 'Ponda', 'Valpoi', 'Bicholim'
    ];

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const API_KEY = 'fe0e635e9c0eb54af58e1d54e5c10e93';

                // Map display names to API names where they differ
                const apiLocationMap: Record<string, string> = {
                    'Margao': 'Madgaon',
                    // Add others if needed effectively
                };

                const queryCity = apiLocationMap[location] || location;
                const query = `${queryCity},Goa,IN`;

                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=metric&appid=${API_KEY}`
                );

                if (response.ok) {
                    const data = await response.json();

                    const main = data.weather[0]?.main;
                    const iconCode = data.weather[0]?.icon || '';
                    const isNight = iconCode.endsWith('n');

                    let condition: WeatherData['condition'] = 'Sunny';

                    if (main === 'Clear') condition = 'Sunny';
                    else if (main === 'Clouds') {
                        if (data.weather[0]?.id === 801 || data.weather[0]?.id === 802) {
                            condition = 'Partly Cloudy';
                        } else {
                            condition = 'Cloudy';
                        }
                    }
                    else if (['Rain', 'Drizzle', 'Thunderstorm'].includes(main)) condition = 'Rainy';
                    else condition = 'Cloudy';

                    setWeather({
                        temp: Math.round(data.main.temp),
                        condition,
                        location: location, // Use selected location name
                        isNight
                    });
                } else {
                    throw new Error('API Error');
                }
            } catch (error) {
                console.error('Error fetching weather:', error);
                setWeather({
                    temp: 28,
                    condition: 'Sunny',
                    location: location,
                    isNight: false
                });
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, [location]); // Re-fetch when location changes

    if (loading && !weather) return null;
    if (!weather) return null;

    const getIcon = () => {
        const iconClass = `${compact ? 'h-5 w-5' : 'h-8 w-8'}`;

        if (weather.isNight) {
            switch (weather.condition) {
                case 'Sunny': return <Moon className={`${iconClass} text-blue-300`} />;
                case 'Partly Cloudy': return <CloudMoon className={`${iconClass} text-blue-400`} />;
                case 'Cloudy': return <Cloud className={`${iconClass} text-gray-400`} />;
                case 'Rainy': return <CloudRain className={`${iconClass} text-blue-500`} />;
                default: return <Moon className={`${iconClass} text-blue-300`} />;
            }
        }

        switch (weather.condition) {
            case 'Sunny': return <Sun className={`${iconClass} text-yellow-500`} />;
            case 'Partly Cloudy': return <CloudSun className={`${iconClass} text-yellow-400`} />;
            case 'Cloudy': return <Cloud className={`${iconClass} text-gray-400`} />;
            case 'Rainy': return <CloudRain className={`${iconClass} text-blue-500`} />;
            default: return <Sun className={`${iconClass} text-yellow-500`} />;
        }
    };

    if (compact) {
        return (
            <div className="relative z-50">
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 bg-blue-50 dark:bg-gray-800 px-3 py-1.5 rounded-full border border-blue-100 dark:border-gray-700 hover:bg-blue-100 dark:hover:bg-gray-700 transition-colors"
                >
                    {getIcon()}
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{weather.temp}°C</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 hidden xl:flex items-center">
                        {weather.location}
                        <ChevronDown className="h-3 w-3 ml-1" />
                    </span>
                </button>

                {isDropdownOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsDropdownOpen(false)}
                        />
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 py-1 z-50">
                            {locations.map((loc) => (
                                <button
                                    key={loc}
                                    onClick={() => {
                                        setLocation(loc);
                                        setIsDropdownOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-2 text-sm ${location === loc
                                        ? 'bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-300'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    {loc}
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>
        );
    }

    return (
        <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-white/20 w-64">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    {getIcon()}
                    <span className="font-bold text-2xl">{weather.temp}°C</span>
                </div>
                <div className="text-right">
                    <p className="font-semibold text-gray-800">{weather.condition}</p>
                    <p className="text-sm text-gray-500">{weather.location}</p>
                </div>
            </div>
        </div>
    );
};

export default WeatherWidget;
