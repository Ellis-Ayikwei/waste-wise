import React from 'react';
import IconLoader from './IconLoader';

const IconLoaderExample: React.FC = () => {
    return (
        <div className="p-6 space-y-8">
            <h2 className="text-2xl font-bold mb-4">Icon Loader Examples</h2>
            
            {/* Size Examples */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Sizes</h3>
                <div className="flex items-center space-x-6">
                    <div className="flex flex-col items-center space-y-2">
                        <IconLoader size="sm" />
                        <span className="text-xs text-gray-600">Small</span>
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                        <IconLoader size="md" />
                        <span className="text-xs text-gray-600">Medium</span>
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                        <IconLoader size="lg" />
                        <span className="text-xs text-gray-600">Large</span>
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                        <IconLoader size="xl" />
                        <span className="text-xs text-gray-600">Extra Large</span>
                    </div>
                </div>
            </div>

            {/* Variant Examples */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Variants</h3>
                <div className="flex items-center space-x-6">
                    <div className="flex flex-col items-center space-y-2">
                        <IconLoader size="md" variant="default" />
                        <span className="text-xs text-gray-600">Default</span>
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                        <IconLoader size="md" variant="primary" />
                        <span className="text-xs text-gray-600">Primary</span>
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                        <IconLoader size="md" variant="success" />
                        <span className="text-xs text-gray-600">Success</span>
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                        <IconLoader size="md" variant="warning" />
                        <span className="text-xs text-gray-600">Warning</span>
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                        <IconLoader size="md" variant="error" />
                        <span className="text-xs text-gray-600">Error</span>
                    </div>
                </div>
            </div>

            {/* With Text Examples */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">With Text</h3>
                <div className="flex items-center space-x-6">
                    <IconLoader size="md" text="Loading..." />
                    <IconLoader size="lg" variant="primary" text="Processing..." />
                    <IconLoader size="xl" variant="success" text="Saving..." />
                </div>
            </div>

            {/* Without Image Examples */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Without Image</h3>
                <div className="flex items-center space-x-6">
                    <IconLoader size="md" showImage={false} />
                    <IconLoader size="lg" variant="primary" showImage={false} text="Loading..." />
                </div>
            </div>

            {/* Full Screen Example */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Full Screen (Click to see)</h3>
                <button 
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => {
                        // This would typically be used in a modal or overlay
                        console.log('Full screen loader would show here');
                    }}
                >
                    Show Full Screen Loader
                </button>
            </div>
        </div>
    );
};

export default IconLoaderExample;
