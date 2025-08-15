import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, IRootState } from '../../../store';
import { toggleSidebar } from '../../../store/themeConfigSlice';
import IconMenu from '../../Icon/IconMenu';

const Logo: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);

    return (
        <div className="horizontal-logo flex lg:hidden justify-between items-center ltr:mr-2 rtl:ml-2">
            <Link to="/" className="main-logo lg:flex items-center shrink-0 hidden">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"></path>
                            <path d="M15 18H9"></path>
                            <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"></path>
                            <circle cx="17" cy="18" r="2"></circle>
                            <circle cx="7" cy="18" r="2"></circle>
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">MoreVans</h1>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Logistics Platform</p>
                    </div>
                </div>
            </Link>
            <button
                type="button"
                className="collapse-icon flex-none dark:text-[#d0d2d6] hover:text-orange-500 dark:hover:text-orange-400 flex lg:hidden ltr:ml-2 rtl:mr-2 p-2 rounded-xl bg-white/60 backdrop-blur-sm dark:bg-gray-800/60 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-300"
                onClick={() => {
                    dispatch(toggleSidebar());
                }}
            >
                <IconMenu className="w-5 h-5" />
            </button>
        </div>
    );
};

export default Logo; 