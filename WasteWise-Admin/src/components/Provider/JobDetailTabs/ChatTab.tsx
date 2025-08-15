import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip, faPaperPlane, faImage, faFile, faMicrophone, faEllipsisV, faEdit, faTrash, faSpinner, faCheck, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { Job } from '../../../types/job';
import { Message } from '../../../types/message';
import { RootState } from '../../../store';
import axiosInstance from '../../../services/axiosInstance';
import confirmDialog from '../../../helper/confirmDialog';

// Define the message interface based on the actual data structure
interface Message {
    id: string;
    request: string;
    sender: {
        id: string;
        email: string;
        first_name: string;
        last_name: string;
        phone_number: string;
        profile_picture: string | null;
        rating: string;
        user_type: string;
        account_status: string;
        last_active: string | null;
        date_joined: string;
    };
    receiver: {
        id: string;
        email: string;
        first_name: string;
        last_name: string;
        phone_number: string;
        profile_picture: string | null;
        rating: string;
        user_type: string;
        account_status: string;
        last_active: string | null;
        date_joined: string;
    };
    content: string;
    attachment: string | null;
    attachment_url: string | null;
    attachment_name: string;
    attachment_size: number | null;
    attachment_type: string;
    formatted_file_size: string | null;
    file_extension: string | null;
    is_image: boolean;
    message_type: string;
    read: boolean;
    read_at: string | null;
    created_at: string;
    updated_at: string;
    time_since_sent: string;
    is_sender: boolean;
}

interface ChatTabProps {
    job: Job & { request?: { messages?: Message[] } };
    onSendMessage: (message: string, attachments?: File[]) => void;
    onMessageUpdate?: () => void; // Callback to refresh messages after edit/delete
}

const ChatTab: React.FC<ChatTabProps> = ({ job, onSendMessage, onMessageUpdate }) => {
    const [message, setMessage] = useState('');
    const [attachments, setAttachments] = useState<File[]>([]);
    const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
    const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState('');
    const [localMessages, setLocalMessages] = useState<Message[]>(job?.request?.messages || []);
    const [isUpdating, setIsUpdating] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    // Update local messages when job.messages changes
    useEffect(() => {
        if (job?.request?.messages) {
            setLocalMessages(job.request.messages);
        }
    }, [job?.request?.messages]);

    const handleSendMessage = async () => {
        if (message.trim() || attachments.length > 0) {
            try {
                await onSendMessage(message, attachments);
                // Only clear input if message was sent successfully
                setMessage('');
                setAttachments([]);
            } catch (error) {
                // Don't clear input on error - let user retry
                console.error('Failed to send message:', error);
            }
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

    const handleEditKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSaveEdit();
        } else if (event.key === 'Escape') {
            handleCancelEdit();
        }
    };

    const toggleDropdown = (messageId: string) => {
        setOpenDropdownId(openDropdownId === messageId ? null : messageId);
    };

    const handleEditMessage = (msg: Message) => {
        setEditingMessageId(msg.id);
        setEditContent(msg.content);
        setOpenDropdownId(null);
    };

    const handleSaveEdit = async () => {
        if (editingMessageId && editContent.trim() && !isUpdating) {
            setIsUpdating(true);
            try {
                // Optimistically update the message locally
                setLocalMessages(prevMessages =>
                    prevMessages.map(msg =>
                        msg.id === editingMessageId
                            ? { ...msg, content: editContent.trim(), updated_at: new Date().toISOString() }
                            : msg
                    )
                );

                // Make API call to update the message
                const response = await axiosInstance.patch(`/messages/${editingMessageId}/`, {
                    content: editContent.trim()
                });

                // Update with the response data to ensure consistency
                setLocalMessages(prevMessages =>
                    prevMessages.map(msg =>
                        msg.id === editingMessageId
                            ? { ...msg, ...response.data }
                            : msg
                    )
                );

                setEditingMessageId(null);
                setEditContent('');
                
                // Notify parent component to refresh messages if needed
                if (onMessageUpdate) {
                    onMessageUpdate();
                }
            } catch (error) {
                console.error('Failed to edit message:', error);
                // Revert the optimistic update on error
                setLocalMessages(prevMessages =>
                    prevMessages.map(msg =>
                        msg.id === editingMessageId
                            ? { ...msg, content: job?.request?.messages?.find((m: Message) => m.id === editingMessageId)?.content || msg.content }
                            : msg
                    )
                );
                // You could show an error message to the user here
            } finally {
                setIsUpdating(false);
            }
        }
    };

    const handleCancelEdit = () => {
        setEditingMessageId(null);
        setEditContent('');
    };

    const handleDeleteMessage = async (messageId: string) => {
        if (isUpdating) return;
        
        // Show confirmation dialog
        const confirmed = await confirmDialog({
            title: 'Delete Message',
            body: 'This action will permanently delete this message.',
            note: 'This action cannot be undone.',
            finalQuestion: 'Are you sure you want to delete this message?',
            type: 'warning',
            confirmText: 'Delete',
            denyText: 'Cancel',
            cancelText: 'Cancel'
        });
        
        if (!confirmed) return;
        
        setIsUpdating(true);
        let deletedMessage: Message | undefined;
        
        try {
            // Optimistically remove the message locally
            deletedMessage = localMessages.find(msg => msg.id === messageId);
            setLocalMessages(prevMessages =>
                prevMessages.filter(msg => msg.id !== messageId)
            );

            // Make API call to delete the message
            await axiosInstance.delete(`/messages/${messageId}/`);
            
            setOpenDropdownId(null);
            
            // Notify parent component to refresh messages if needed
            if (onMessageUpdate) {
                onMessageUpdate();
            }
        } catch (error) {
            console.error('Failed to delete message:', error);
            // Restore the message on error
            if (deletedMessage) {
                setLocalMessages(prevMessages => [...prevMessages, deletedMessage as Message]);
            }
            // You could show an error message to the user here
        } finally {
            setIsUpdating(false);
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (openDropdownId && dropdownRefs.current[openDropdownId]) {
                const dropdown = dropdownRefs.current[openDropdownId];
                if (dropdown && !dropdown.contains(event.target as Node)) {
                    setOpenDropdownId(null);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openDropdownId]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [localMessages]);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden h-[600px] flex flex-col">
            {/* Chat header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Chat</h2>
            </div>

            {/* Chat messages */}
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                {localMessages?.map((msg: Message, index: number) => (
                    <div key={msg.id || index} className={`flex ${msg.is_sender ? 'justify-end' : 'justify-start'}`}>
                        <div
                            className={`max-w-[70%] rounded-lg p-3 relative group ${
                                msg.is_sender ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100' : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                            }`}
                        >
                            {/* Message dropdown menu - only show for sender's messages */}
                            {msg.is_sender && (
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="relative" ref={(el) => (dropdownRefs.current[msg.id] = el)}>
                                        <button
                                            onClick={() => toggleDropdown(msg.id)}
                                            disabled={isUpdating}
                                            className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded disabled:opacity-50"
                                        >
                                            <FontAwesomeIcon icon={faEllipsisV} className="text-sm" />
                                        </button>
                                        
                                        {openDropdownId === msg.id && (
                                            <div className="absolute right-0 top-6 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                                                <button
                                                    onClick={() => handleEditMessage(msg)}
                                                    disabled={isUpdating}
                                                    className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center disabled:opacity-50"
                                                >
                                                    <FontAwesomeIcon icon={faEdit} className="mr-2 text-xs" />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteMessage(msg.id)}
                                                    disabled={isUpdating}
                                                    className="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center disabled:opacity-50"
                                                >
                                                    <FontAwesomeIcon icon={faTrash} className="mr-2 text-xs" />
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium">
                                    {msg.is_sender ? 'You' : `${msg.sender.first_name} ${msg.sender.last_name}`.trim() || msg.sender.email}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">{msg.time_since_sent}</span>
                            </div>
                            
                            {/* Message content - show edit input if editing */}
                            {editingMessageId === msg.id ? (
                                <div className="space-y-2">
                                    <textarea
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        onKeyPress={handleEditKeyPress}
                                        disabled={isUpdating}
                                        className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none disabled:opacity-50"
                                        rows={Math.max(1, editContent.split('\n').length)}
                                        autoFocus
                                    />
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={handleSaveEdit}
                                            disabled={isUpdating || !editContent.trim()}
                                            className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isUpdating ? 'Saving...' : 'Save'}
                                        </button>
                                        <button
                                            onClick={handleCancelEdit}
                                            disabled={isUpdating}
                                            className="px-3 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm">{msg.content}</p>
                            )}
                            
                            {msg.attachment_url && (
                                <div className="mt-2 space-y-2">
                                    <div className="flex items-center space-x-2 p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                                        <FontAwesomeIcon icon={msg.is_image ? faImage : faFile} className="text-gray-500 dark:text-gray-400" />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">{msg.attachment_name || 'Attachment'}</span>
                                        <a
                                            href={msg.attachment_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
                                        >
                                            View
                                        </a>
                                    </div>
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
