// This component goes inside your UserDashboard.tsx file or can be moved to a separate file

import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";

interface StatCardProps {
    icon: any;
    title: string;
    value: number | string;
    color?: 'blue' | 'purple' | 'green' | 'yellow' | 'red' | 'indigo';
    trend?: {
      value: number;
      isPositive: boolean;
    };
    isLoading?: boolean;
    className?: string;
    delay?: number;
  }
  
  const StatCard: React.FC<StatCardProps> = ({ 
    icon, 
    title, 
    value, 
    color = 'blue', 
    trend, 
    isLoading = false,
    className = "",
    delay = 0
  }) => {
    const getColorClasses = (color: string) => {
      const colorMap: {[key: string]: {bg: string, bgDark: string, text: string, textDark: string, border: string, gradient: string}} = {
        blue: {
          bg: 'bg-blue-500', 
          bgDark: 'dark:bg-blue-600',
          text: 'text-white',
          textDark: 'dark:text-white',
          border: 'border-blue-200',
          gradient: 'from-blue-50 to-indigo-50'
        },
        purple: {
          bg: 'bg-purple-500',
          bgDark: 'dark:bg-purple-600',
          text: 'text-white',
          textDark: 'dark:text-white',
          border: 'border-purple-200',
          gradient: 'from-purple-50 to-indigo-50'
        },
        green: {
          bg: 'bg-green-500',
          bgDark: 'dark:bg-green-600',
          text: 'text-white',
          textDark: 'dark:text-white',
          border: 'border-green-200',
          gradient: 'from-green-50 to-emerald-50'
        },
        yellow: {
          bg: 'bg-yellow-500',
          bgDark: 'dark:bg-yellow-600',
          text: 'text-white',
          textDark: 'dark:text-white',
          border: 'border-yellow-200',
          gradient: 'from-yellow-50 to-orange-50'
        },
        red: {
          bg: 'bg-red-500',
          bgDark: 'dark:bg-red-600',
          text: 'text-white',
          textDark: 'dark:text-white',
          border: 'border-red-200',
          gradient: 'from-red-50 to-pink-50'
        },
        indigo: {
          bg: 'bg-indigo-500',
          bgDark: 'dark:bg-indigo-600',
          text: 'text-white',
          textDark: 'dark:text-white',
          border: 'border-indigo-200',
          gradient: 'from-indigo-50 to-purple-50'
        }
      };
      
      return colorMap[color] || colorMap.blue;
    };
    
    const colors = getColorClasses(color);
    
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        whileHover={{ y: -2 }}
        className={`relative p-4 bg-gradient-to-br ${colors.gradient} border ${colors.border} rounded-xl group overflow-hidden ${className}`}
      >
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-500/20 to-transparent rounded-bl-xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-3">
            <div className={`p-2 ${colors.bg} ${colors.bgDark} rounded-lg transition-all duration-300 group-hover:scale-110`}>
              <FontAwesomeIcon icon={icon} className={`${colors.text} ${colors.textDark} text-lg`} />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">{title}</h3>
          </div>
          
          {isLoading ? (
            <div className="h-6 w-12 bg-gray-200 dark:bg-gray-700 animate-pulse rounded mt-1"></div>
          ) : (
            <div className="flex items-end">
              <p className="text-2xl font-bold text-blue-600 mb-1">
                {value}
              </p>
              
              {trend && (
                <div className={`ml-2 mb-1 flex items-center text-xs ${trend.isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                  <FontAwesomeIcon 
                    icon={trend.isPositive ? faArrowUp : faArrowDown}
                    className="mr-1"
                  />
                  <span>{Math.abs(trend.value)}%</span>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    );
  };

export default StatCard;