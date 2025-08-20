import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle, Info, X } from "lucide-react"
import { XCircle } from "lucide-react"
import { CheckCircle2 } from "lucide-react";
import { useEffect } from "react";
import { useState } from "react";
import { createRoot } from 'react-dom/client';

interface NotificationProps {
    message: string;
    type: 'success' | 'error' | 'warning' | 'loading' | 'info';
    showHide: boolean;
    onClose: () => void;
}

const ShowNotificationComponent: React.FC<NotificationProps> = ({message, type, showHide=true, onClose}) => {
    const readingTime = Math.max(message.length * 100, 3000);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, readingTime);
        return () => clearTimeout(timer);
    }, [readingTime]);

    const hideNotification = () => {
        setIsVisible(false);
    }

    return (
        isVisible &&
        <AnimatePresence>
            <motion.div 
                className={`fixed bottom-5 right-5 p-4 rounded-lg shadow-lg flex items-center z-[999] ${
                    type === 'success' ? 'bg-green-50 border border-green-200' : 
                    type === 'error' ? 'bg-red-50 border border-red-200' : 
                    type === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
                    type === 'info' ? 'bg-blue-50 border border-blue-200' :
                    'bg-green-50 border border-green-200'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
            >
                {type === 'loading' && (
                    <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin mr-3"></div>
                )}
                {type === 'success' && (
                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-3" />
                )}
                {type === 'error' && (
                    <XCircle className="w-5 h-5 text-red-500 mr-3" />
                )}
                {type === 'warning' && (
                    <AlertCircle className="w-5 h-5 text-yellow-500 mr-3" />
                )}
                {type === 'info' && (
                    <Info className="w-5 h-5 text-blue-500 mr-3" />
                )}
                <span className={`font-medium ${
                    type === 'success' ? 'text-green-700' : 
                    type === 'error' ? 'text-red-700' : 
                    type === 'warning' ? 'text-yellow-700' :
                    'text-green-700'
                }`}>
                    {message}
                </span>
                {showHide && <button onClick={onClose} className="ml-auto">
                    <X className="w-5 h-5 text-gray-500" />
                </button>}
            </motion.div>
        </AnimatePresence>
    );
};

// Function to show notification
const showNotification = (props: Omit<NotificationProps, 'onClose'>) => {
    // Create a div element for the notification
    const notificationDiv = document.createElement('div');
    notificationDiv.id = 'notification-container';
    document.body.appendChild(notificationDiv);

    // Create root and render notification
    const root = createRoot(notificationDiv);
    
    const handleClose = () => {
        root.unmount();
        document.body.removeChild(notificationDiv);
    };

    root.render(
        <ShowNotificationComponent
            {...props}
            onClose={handleClose}
        />
    );

    // Auto remove after reading time
    const readingTime = Math.max(props.message.length * 100, 3000);
    setTimeout(handleClose, readingTime);
};

export { ShowNotificationComponent as ShowNotification, showNotification };
export default showNotification;