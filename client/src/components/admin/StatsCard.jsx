import React, { useState, useEffect } from 'react';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import { useNavigate } from 'react-router-dom';
import {
    Sparklines,
    SparklinesLine,
    SparklinesBars,
    SparklinesSpots,
} from 'react-sparklines';
import {
    FiBox, FiShoppingCart, FiDollarSign, FiUsers,
    FiArrowUp, FiArrowDown, FiPieChart, FiAlertCircle
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

// Custom Pie Chart Component (SVG-based)
const PieChart = ({ data, colors, size = 60 }) => {
    const total = data.reduce((sum, value) => sum + value, 0);
    let startAngle = 0;

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {data.map((value, index) => {
                if (value === 0) return null;
                const angle = (value / total) * 360;
                const endAngle = startAngle + angle;
                const largeArcFlag = angle > 180 ? 1 : 0;

                // Calculate SVG path
                const x1 = size / 2 + Math.cos((Math.PI / 180) * startAngle) * (size / 2);
                const y1 = size / 2 + Math.sin((Math.PI / 180) * startAngle) * (size / 2);
                const x2 = size / 2 + Math.cos((Math.PI / 180) * endAngle) * (size / 2);
                const y2 = size / 2 + Math.sin((Math.PI / 180) * endAngle) * (size / 2);

                const pathData = [
                    `M ${size / 2} ${size / 2}`,
                    `L ${x1} ${y1}`,
                    `A ${size / 2} ${size / 2} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                    'Z'
                ].join(' ');

                startAngle = endAngle;

                return (
                    <path
                        key={index}
                        d={pathData}
                        fill={colors[index % colors.length]}
                        stroke="#fff"
                        strokeWidth="1"
                    />
                );
            })}
        </svg>
    );
};

const StatsCard = ({
    title,
    value,
    icon = 'box',
    trend = null,
    color = 'default',
    loading = false,
    tooltip = null,
    link = null,
    chartData = null,
    chartType = 'line',
    animationDelay = 0,
    liveUpdate = false,
    isError = false,
    errorMessage = 'Data unavailable',
}) => {
    const navigate = useNavigate();
    const [isMounted, setIsMounted] = useState(false);
    const [currentData, setCurrentData] = useState(chartData || []);

    // Simulate live data updates (if enabled)
    useEffect(() => {
        setIsMounted(true);
        if (liveUpdate && chartData && !isError) {
            const interval = setInterval(() => {
                setCurrentData(prev =>
                    prev.map((val, i) =>
                        Math.max(0, val + (Math.random() * 10 - 5))
                    ));
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [liveUpdate, chartData, isError]);

    // Color variants (unchanged)
    const colorVariants = {
        default: 'bg-white border border-gray-200',
        primary: 'bg-blue-50 border border-blue-100',
        success: 'bg-green-50 border border-green-100',
        danger: 'bg-red-50 border border-red-100',
        warning: 'bg-yellow-50 border border-yellow-100',
    };

    // Icon mapping (added error icon)
    const iconComponents = {
        box: <FiBox className="text-2xl" />,
        cart: <FiShoppingCart className="text-2xl" />,
        dollar: <FiDollarSign className="text-2xl" />,
        users: <FiUsers className="text-2xl" />,
        pie: <FiPieChart className="text-2xl" />,
        error: <FiAlertCircle className="text-2xl text-red-400" />,
    };

    // Trend arrow (unchanged)
    const trendArrow = {
        up: <FiArrowUp className="inline" />,
        down: <FiArrowDown className="inline" />,
    };

    const trendColor = {
        up: 'text-green-500',
        down: 'text-red-500',
    };

    // Chart color (unchanged)
    const chartColor = {
        default: '#3b82f6',
        primary: '#3b82f6',
        success: '#10b981',
        danger: '#ef4444',
        warning: '#f59e0b',
    }[color];

    // Pie chart colors (unchanged)
    const pieColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    const handleClick = () => {
        if (link && !isError) navigate(link);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isMounted ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: animationDelay * 0.1 }}
            className={`p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ${colorVariants[color]} ${link && !isError ? 'cursor-pointer hover:bg-opacity-80' : ''}`}
            data-tooltip-id={`tooltip-${title}`}
            data-tooltip-content={isError ? errorMessage : tooltip}
            onClick={handleClick}
        >
            {loading ? (
                <div className="animate-pulse space-y-2">
                    <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                    <div className="h-6 w-3/4 bg-gray-300 rounded"></div>
                </div>
            ) : (
                <>
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">{title}</p>
                            <h3 className={`text-2xl font-bold mt-1 ${isError ? 'text-red-500' : ''}`}>
                                {isError ? 'N/A' : (typeof value === 'number' ? value.toLocaleString() : value)}
                            </h3>
                            {isError && (
                                <p className="text-xs text-red-400 mt-1 flex items-center">
                                    <FiAlertCircle className="mr-1" /> {errorMessage}
                                </p>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            {isError ? iconComponents.error : (typeof icon === 'string' ? iconComponents[icon] : icon)}
                            {!isError && trend && (
                                <span className={`text-sm ${trendColor[trend.direction]}`}>
                                    {trendArrow[trend.direction]} {trend.value}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Dynamic Chart - hidden in error state */}
                    {!isError && currentData && currentData.length > 0 && (
                        <motion.div
                            key={liveUpdate ? currentData.join('-') : 'static'}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="mt-2 h-10 flex items-center justify-center"
                        >
                            {chartType === 'pie' ? (
                                <PieChart
                                    data={currentData}
                                    colors={pieColors}
                                    size={60}
                                />
                            ) : (
                                <Sparklines data={currentData} width={100} height={30} margin={5}>
                                    {chartType === 'bar' ? (
                                        <SparklinesBars style={{ fill: chartColor, fillOpacity: 0.6 }} />
                                    ) : (
                                        <SparklinesLine color={chartColor} style={{ fill: 'none' }} />
                                    )}
                                    <SparklinesSpots size={3} style={{ fill: chartColor }} />
                                </Sparklines>
                            )}
                        </motion.div>
                    )}

                    {tooltip && <Tooltip id={`tooltip-${title}`} place="top" effect="solid" />}
                </>
            )}
        </motion.div>
    );
};

export default StatsCard;