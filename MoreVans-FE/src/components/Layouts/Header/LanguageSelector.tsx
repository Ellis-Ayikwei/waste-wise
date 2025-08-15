import React, { useState } from 'react';
import i18next from 'i18next';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, IRootState } from '../../../store';
import { toggleRTL } from '../../../store/themeConfigSlice';
import Dropdown from '../../Dropdown';

const LanguageSelector: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';
    const [flag, setFlag] = useState(themeConfig.locale);

    const setLocale = (flagCode: string) => {
        setFlag(flagCode);
        if (flagCode.toLowerCase() === 'ae') {
            dispatch(toggleRTL('rtl'));
        } else {
            dispatch(toggleRTL('ltr'));
        }
    };

    return (
        <div className="dropdown shrink-0">
            <Dropdown
                offset={[0, 8]}
                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                btnClassName="block p-2 rounded-xl bg-white/60 backdrop-blur-sm dark:bg-gray-800/60 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-300 touch-manipulation"
                closeOnOutsideClick={true}
                closeOnScroll={true}
                closeOnTouch={true}
                button={<img className="w-5 h-5 object-cover rounded-full" src={`/assets/images/flags/${flag.toUpperCase()}.svg`} alt="flag" />}
            >
                <ul className="!px-2 text-dark dark:text-white-dark grid grid-cols-1 sm:grid-cols-2 gap-2 font-semibold dark:text-white-light/90 w-[240px] sm:w-[280px] max-w-[calc(100vw-2rem)] bg-white/80 backdrop-blur-sm border border-white/20 dark:bg-gray-800/80">
                    {themeConfig.languageList.map((item: any) => {
                        return (
                            <li key={item.code}>
                                <button
                                    type="button"
                                    className={`flex w-full hover:text-orange-500 hover:bg-orange-50 rounded-lg p-3 transition-all duration-300 touch-manipulation min-h-[48px] ${
                                        i18next.language === item.code ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30' : ''
                                    }`}
                                    onClick={() => {
                                        i18next.changeLanguage(item.code);
                                        setLocale(item.code);
                                    }}
                                >
                                    <img src={`/assets/images/flags/${item.code.toUpperCase()}.svg`} alt="flag" className="w-5 h-5 object-cover rounded-full" />
                                    <span className="ltr:ml-3 rtl:mr-3 truncate">{item.name}</span>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </Dropdown>
        </div>
    );
};

export default LanguageSelector; 