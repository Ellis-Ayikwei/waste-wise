import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, IRootState } from '../../../store';
import { toggleTheme } from '../../../store/themeConfigSlice';
import IconSun from '../../Icon/IconSun';
import IconMoon from '../../Icon/IconMoon';
import IconLaptop from '../../Icon/IconLaptop';

const ThemeToggle: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);

    return (
        <div className="flex items-center">
            {themeConfig.theme === 'light' ? (
                <button
                    className="flex items-center p-2 rounded-xl bg-white/60 backdrop-blur-sm dark:bg-gray-800/60 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-300"
                    onClick={() => {
                        dispatch(toggleTheme('dark'));
                    }}
                >
                    <IconSun className="w-5 h-5" />
                </button>
            ) : (
                ''
            )}
            {themeConfig.theme === 'dark' && (
                <button
                    className="flex items-center p-2 rounded-xl bg-white/60 backdrop-blur-sm dark:bg-gray-800/60 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-300"
                    onClick={() => {
                        dispatch(toggleTheme('system'));
                    }}
                >
                    <IconMoon className="w-5 h-5" />
                </button>
            )}
            {themeConfig.theme === 'system' && (
                <button
                    className="flex items-center p-2 rounded-xl bg-white/60 backdrop-blur-sm dark:bg-gray-800/60 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-300"
                    onClick={() => {
                        dispatch(toggleTheme('light'));
                    }}
                >
                    <IconLaptop className="w-5 h-5" />
                </button>
            )}
        </div>
    );
};

export default ThemeToggle; 