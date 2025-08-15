import React, { useState } from 'react';
import JobDetailsTab from '../../../../components/Provider/JobDetailTabs/JobDetailsTab';
import RouteTab from '../../../../components/Provider/JobDetailTabs/RouteTab';
import ItemsTab from '../../../../components/Provider/JobDetailTabs/ItemsTab';
import TimelineTab from '../../../../components/Provider/JobDetailTabs/TimelineTab';
import DocumentsTab from '../../../../components/Provider/JobDetailTabs/DocumentsTab';
import ChatTab from '../../../../components/Provider/JobDetailTabs/ChatTab';
import type { Job } from '../../../../types/job';

type JobTabsProps = {
  job: Job;
  onSendMessage: (message: string, attachments?: File[]) => Promise<void> | void;
};

const JobTabs: React.FC<JobTabsProps> = ({ job, onSendMessage }) => {
  const [activeTab, setActiveTab] = useState<'details' | 'route' | 'items' | 'timeline' | 'documents' | 'chat'>('details');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
        <nav className="flex -mb-px overflow-x-auto">
          {[
            { id: 'details', label: 'Details' },
            { id: 'route', label: 'Route' },
            { id: 'items', label: 'Items' },
            { id: 'timeline', label: 'Timeline' },
            { id: 'documents', label: 'Documents' },
            { id: 'chat', label: 'Chat' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === (tab.id as any)
                  ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800'
                  : 'text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-6">
        {activeTab === 'details' && <JobDetailsTab job={job} />}
        {activeTab === 'route' && <RouteTab job={job} />}
        {activeTab === 'items' && <ItemsTab job={job} />}
        {activeTab === 'timeline' && <TimelineTab job={job} userType="provider" />}
        {activeTab === 'documents' && <DocumentsTab job={job} />}
        {activeTab === 'chat' && <ChatTab job={job} onSendMessage={onSendMessage} />}
      </div>
    </div>
  );
};

export default JobTabs;


