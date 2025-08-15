import React from 'react';

const ProviderRating: React.FC = () => {
    return (
        <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/60 backdrop-blur-sm border border-white/30 rounded-xl dark:bg-gray-800/60 dark:border-gray-600">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                </div>
                <div>
                    <div className="flex items-center gap-1">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">4.8</span>
                        <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <svg
                                    key={star}
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`w-3 h-3 ${star <= 4 ? 'text-orange-500' : 'text-gray-300'}`}
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                            ))}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-3 h-3 text-orange-500"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                style={{ clipPath: 'inset(0 20% 0 0)' }}
                            >
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                        </div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">1,247 deliveries</div>
                </div>
            </div>
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
            <div className="text-center">
                <div className="text-xs font-medium text-green-600 dark:text-green-400">98.5%</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">On-time</div>
            </div>
        </div>
    );
};

export default ProviderRating; 