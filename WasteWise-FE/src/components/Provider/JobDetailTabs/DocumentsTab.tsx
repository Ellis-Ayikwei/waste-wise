import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faFileImage, faBox, faDownload, faEye, faImages, faCamera, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { Job } from '../../../types/job';

interface DocumentsTabProps {
    job: Job;
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({ job }) => {
    const jobPhotos = job.request.photo_urls || [];

    // Safely handle moving_items which might be null for journey requests
    const movingItems = job.request.moving_items || [];
    const itemPhotos = movingItems
        .filter((item) => item.photo)
        .map((item) => ({
            url: item.photo!,
            itemName: item.name,
            itemId: item.id,
        }));

    const hasDocuments = jobPhotos.length > 0 || itemPhotos.length > 0;

    const renderPhotoCard = (url: string, title: string, subtitle?: string, icon = faImage) => (
        <div className="backdrop-blur-sm bg-slate-50/80 dark:bg-slate-900/30 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 hover:border-orange-300 dark:hover:border-orange-600 transition-all duration-200 hover:shadow-lg">
            <div className="flex items-start gap-4">
                <div className="relative group">
                    <img
                        src={url}
                        alt={title}
                        className="w-24 h-24 object-cover rounded-xl border-2 border-slate-200/50 dark:border-slate-700/50 group-hover:border-orange-300 dark:group-hover:border-orange-600 transition-all duration-200"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-xl transition-all duration-200"></div>
                </div>

                <div className="flex-1">
                    <div className="flex items-start justify-between">
                        <div>
                            <h4 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h4>
                            {subtitle && <p className="text-slate-600 dark:text-slate-400 font-medium mt-1">{subtitle}</p>}
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Uploaded: {new Date(job.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="w-10 h-10 rounded-xl bg-blue-100/80 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200/80 dark:hover:bg-blue-800/50 transition-all duration-200 flex items-center justify-center">
                                <FontAwesomeIcon icon={faEye} />
                            </button>
                            <button className="w-10 h-10 rounded-xl bg-green-100/80 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200/80 dark:hover:bg-green-800/50 transition-all duration-200 flex items-center justify-center">
                                <FontAwesomeIcon icon={faDownload} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse"></div>
                    Job Documentation
                </h2>
                <div className="text-lg font-semibold text-slate-600 dark:text-slate-400">{jobPhotos.length + itemPhotos.length} Documents</div>
            </div>

            {hasDocuments ? (
                <div className="space-y-8">
                    {/* Job Photos Section */}
                    {jobPhotos.length > 0 && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                                    <FontAwesomeIcon icon={faImages} className="text-white text-xl" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Job Overview Photos</h3>
                                    <p className="text-slate-600 dark:text-slate-400">General photos of the moving job</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {jobPhotos.map((photo, index) => (
                                    <div key={index}>{renderPhotoCard(photo, `Job Photo ${index + 1}`, 'Overview documentation')}</div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Item Photos Section */}
                    {itemPhotos.length > 0 && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
                                    <FontAwesomeIcon icon={faBox} className="text-white text-xl" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Item Documentation</h3>
                                    <p className="text-slate-600 dark:text-slate-400">Photos of individual items to be moved</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {itemPhotos.map((item, index) => (
                                    <div key={item.itemId}>{renderPhotoCard(item.url, item.itemName, 'Item documentation', faBox)}</div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                /* Empty State */
                <div className="text-center py-16">
                    <div className="backdrop-blur-xl bg-slate-50/80 dark:bg-slate-800/50 rounded-3xl p-12 border border-slate-200/50 dark:border-slate-700/30 max-w-md mx-auto">
                        <div className="w-20 h-20 bg-slate-200/80 dark:bg-slate-700/80 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <FontAwesomeIcon icon={faFileAlt} className="text-4xl text-slate-400 dark:text-slate-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">No Documents Available</h3>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            No photos or documents have been uploaded for this job yet. Documents will appear here once they are added to the job request.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DocumentsTab;
