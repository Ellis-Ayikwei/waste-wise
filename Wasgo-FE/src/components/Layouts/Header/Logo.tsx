import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, IRootState } from '../../../store';
import { toggleSidebar } from '../../../store/themeConfigSlice';
import IconMenu from '../../Icon/IconMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRecycle } from '@fortawesome/free-solid-svg-icons';

const Logo: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);

    return (
        <div className="horizontal-logo flex lg:hidden justify-between items-center ltr:mr-2 rtl:ml-2">
            <Link to="/" className="main-logo lg:flex items-center shrink-0 hidden">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                        <FontAwesomeIcon icon={faRecycle} className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">wasgo</h1>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Smart Waste Management</p>
                    </div>
                </div>
            </Link>
            <button
                type="button"
                className="collapse-icon flex-none dark:text-[#d0d2d6] hover:text-green-500 dark:hover:text-green-400 flex lg:hidden ltr:ml-2 rtl:mr-2 p-2 rounded-xl bg-white/60 backdrop-blur-sm dark:bg-gray-800/60 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-300"
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