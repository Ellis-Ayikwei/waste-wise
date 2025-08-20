import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { IRootState } from '../../../store';
import Dropdown from '../../Dropdown';
import IconMailDot from '../../Icon/IconMailDot';
import IconInfoCircle from '../../Icon/IconInfoCircle';
import IconArrowLeft from '../../Icon/IconArrowLeft';
import IconXCircle from '../../Icon/IconXCircle';

interface Message {
    id: number;
    image: string;
    title: string;
    message: string;
    time: string;
}

const MessagesDropdown: React.FC = () => {
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';
    
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            image: '<span className="grid place-content-center w-9 h-9 rounded-full bg-green-500 text-white"><svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3h18v18H3z"></path><path d="M9 9h6v6H9z"></path></svg></span>',
            title: 'Collection Scheduled',
            message: 'Waste collection scheduled for tomorrow at 9 AM.',
            time: '5min',
        },
        {
            id: 2,
            image: '<span className="grid place-content-center w-9 h-9 rounded-full bg-emerald-500 text-white"><svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4"></path><circle cx="12" cy="12" r="10"></circle></svg></span>',
            title: 'Collection Completed',
            message: 'Your waste has been collected and recycled successfully.',
            time: '15min',
        },
        {
            id: 3,
            image: '<span className="grid place-content-center w-9 h-9 rounded-full bg-orange-500 text-white"><svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg></span>',
            title: 'Route Update',
            message: 'Collection route updated due to road maintenance.',
            time: '1hr',
        },
        {
            id: 4,
            image: '<span className="grid place-content-center w-9 h-9 rounded-full bg-purple-500 text-white"><svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg></span>',
            title: 'Recycling Reward',
            message: 'You earned 50 points for recycling this week!',
            time: '2hr',
        },
    ]);

    const removeMessage = (value: number) => {
        setMessages(messages.filter((msg) => msg.id !== value));
    };

    const createMarkup = (htmlString: string) => {
        return { __html: htmlString };
    };

    return (
        <div className="dropdown shrink-0">
            <Dropdown
                offset={[0, 8]}
                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                btnClassName="relative block p-2 rounded-xl bg-white/60 backdrop-blur-sm dark:bg-gray-800/60 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-300 touch-manipulation"
                closeOnOutsideClick={true}
                closeOnScroll={true}
                closeOnTouch={true}
                button={
                    <div className="relative">
                        <IconMailDot className="w-5 h-5" />
                        {messages.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">{messages.length}</span>
                        )}
                    </div>
                }
            >
                <ul className="!py-0 text-dark dark:text-white-dark w-[280px] sm:w-[350px] md:w-[400px] max-w-[calc(100vw-2rem)] text-xs bg-white/90 backdrop-blur-md border border-white/20 dark:bg-gray-800/90">
                    <li className="mb-5" onClick={(e) => e.stopPropagation()}>
                        <div className="hover:!bg-transparent overflow-hidden relative rounded-t-md p-4 sm:p-5 text-white w-full !h-[60px] sm:!h-[68px]">
                            <div className="absolute h-full w-full bg-gradient-to-r from-green-500 to-emerald-600 inset-0"></div>
                            <h4 className="font-semibold relative z-10 text-base sm:text-lg">Waste Management Updates</h4>
                        </div>
                    </li>
                    {messages.length > 0 ? (
                        <>
                            <li onClick={(e) => e.stopPropagation()}>
                                {messages.map((message) => {
                                    return (
                                        <div key={message.id} className="flex items-start gap-2 sm:gap-3 py-3 px-3 sm:px-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors touch-manipulation min-h-[64px]">
                                            <div className="flex-shrink-0 mt-1" dangerouslySetInnerHTML={createMarkup(message.image)}></div>
                                            <div className="flex-1 min-w-0 px-1 sm:px-3 dark:text-gray-300">
                                                <div className="font-semibold text-sm dark:text-white/90 truncate">{message.title}</div>
                                                <div className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm leading-tight mt-0.5">{message.message}</div>
                                            </div>
                                            <div className="flex-shrink-0 flex items-center gap-1 sm:gap-2">
                                                <span className="font-semibold bg-green-100 text-green-600 rounded-full text-xs px-2 py-1 whitespace-nowrap dark:bg-green-900/30 dark:text-green-400">
                                                    {message.time}
                                                </span>
                                                <button 
                                                    type="button" 
                                                    className="text-gray-300 hover:text-red-500 transition-colors touch-manipulation p-1 sm:p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 min-h-[36px] min-w-[36px] sm:min-h-[44px] sm:min-w-[44px] flex items-center justify-center" 
                                                    onClick={() => removeMessage(message.id)}
                                                >
                                                    <IconXCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </li>
                            <li className="border-t border-gray-200 dark:border-gray-600 text-center mt-5">
                                <button type="button" className="text-green-500 font-semibold group hover:text-green-600 justify-center !py-3 sm:!py-4 !h-[48px] sm:!h-[56px] transition-colors w-full touch-manipulation flex items-center text-xs sm:text-sm">
                                    <span className="group-hover:underline ltr:mr-1 rtl:ml-1">VIEW ALL UPDATES</span>
                                    <IconArrowLeft className="group-hover:translate-x-1 transition duration-300 ltr:ml-1 rtl:mr-1 w-3 h-3 sm:w-4 sm:h-4" />
                                </button>
                            </li>
                        </>
                    ) : (
                        <li className="mb-5" onClick={(e) => e.stopPropagation()}>
                            <button type="button" className="!grid place-content-center hover:!bg-transparent text-lg min-h-[200px]">
                                <div className="mx-auto ring-4 ring-green-500/30 rounded-full mb-4 text-green-500">
                                    <IconInfoCircle fill={true} className="w-10 h-10" />
                                </div>
                                No waste management updates available.
                            </button>
                        </li>
                    )}
                </ul>
            </Dropdown>
        </div>
    );
};

export default MessagesDropdown; 