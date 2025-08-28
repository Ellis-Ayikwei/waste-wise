import React from 'react';

interface ProgressStepsProps {
    activeStep: number;
}

const ProgressSteps: React.FC<ProgressStepsProps> = ({ activeStep }) => {
    return (
        <div className="mb-6">
            <div className="flex items-center justify-between">
                {[1, 2, 3, 4].map((step) => (
                    <div key={step} className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                            activeStep >= step 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-200 text-gray-600'
                        }`}>
                            {step}
                        </div>
                        {step < 4 && (
                            <div className={`w-16 h-1 mx-2 ${
                                activeStep > step ? 'bg-blue-600' : 'bg-gray-200'
                            }`} />
                        )}
                    </div>
                ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>Basic Info</span>
                <span>Service Details</span>
                <span>Location & Schedule</span>
                <span>Review & Submit</span>
            </div>
        </div>
    );
};

export default ProgressSteps;
