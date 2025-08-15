import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip, faPaperPlane, faImage, faFile, faMicrophone, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { Job } from '../../../types/job';

interface ChatTabProps {
    job: Job;
    onSendMessage: (message: string, attachments?: File[]) => void;
}

const ChatTab: React.FC<ChatTabProps> = ({ job, onSendMessage }) => {
    const [message, setMessage] = useState('');
    const [attachments, setAttachments] = useState<File[]>([]);
    const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const handleSendMessage = () => {
        if (message.trim() || attachments.length > 0) {
            onSendMessage(message, attachments);
            setMessage('');
            setAttachments([]);
        }
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            setAttachments([...attachments, ...Array.from(files)]);
        }
        setShowAttachmentMenu(false);
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSendMessage();
        }
    };

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [job.chat_messages]);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden h-[600px] flex flex-col">
            {/* Chat header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Chat</h2>
            </div>

            {/* Chat messages */}
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                {job.chat_messages?.map((msg, index) => (
                    <div key={msg.id || index} className={`flex ${msg.sender === 'provider' ? 'justify-end' : 'justify-start'}`}>
                        <div
                            className={`max-w-[70%] rounded-lg p-3 ${
                                msg.sender === 'provider' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100' : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                            }`}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium">{msg.sender === 'provider' ? 'You' : msg.sender_name}</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                            </div>
                            <p className="text-sm">{msg.message}</p>
                            {msg.attachments && msg.attachments.length > 0 && (
                                <div className="mt-2 space-y-2">
                                    {msg.attachments.map((attachment, idx) => (
                                        <div key={idx} className="flex items-center space-x-2 p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                                            <FontAwesomeIcon icon={attachment.type.startsWith('image/') ? faImage : faFile} className="text-gray-500 dark:text-gray-400" />
                                            <span className="text-sm text-gray-700 dark:text-gray-300">{attachment.name}</span>
                                            <a
                                                href={attachment.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
                                            >
                                                View
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Message input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                {/* Attachments preview */}
                {attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                        {attachments.map((file, index) => (
                            <div key={index} className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2">
                                <FontAwesomeIcon icon={file.type.startsWith('image/') ? faImage : faFile} className="text-gray-500 dark:text-gray-400" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">{file.name}</span>
                                <button
                                    onClick={() => setAttachments(attachments.filter((_, i) => i !== index))}
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex items-center space-x-2">
                    {/* Attachment menu */}
                    <div className="relative">
                        <button onClick={() => setShowAttachmentMenu(!showAttachmentMenu)} className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                            <FontAwesomeIcon icon={faPaperclip} />
                        </button>
                        {showAttachmentMenu && (
                            <div className="absolute bottom-full left-0 mb-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                                >
                                    <FontAwesomeIcon icon={faImage} className="mr-2" />
                                    Upload Image
                                </button>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                                >
                                    <FontAwesomeIcon icon={faFile} className="mr-2" />
                                    Upload File
                                </button>
                                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center">
                                    <FontAwesomeIcon icon={faMicrophone} className="mr-2" />
                                    Record Voice
                                </button>
                            </div>
                        )}
                        <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelect} multiple />
                    </div>

                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        className="flex-1 min-h-[40px] max-h-[120px] p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        rows={1}
                    />

                    <button
                        onClick={handleSendMessage}
                        disabled={!message.trim() && attachments.length === 0}
                        className="p-2 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 disabled:text-gray-400 dark:disabled:text-gray-600"
                    >
                        <FontAwesomeIcon icon={faPaperPlane} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatTab;
