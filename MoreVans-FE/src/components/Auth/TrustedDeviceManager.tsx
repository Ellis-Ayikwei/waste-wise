import React from 'react';

type DeviceInfo = {
  id: string;
  device_name: string;
  last_used?: string;
  created_at?: string;
  expires_at?: string;
  is_active?: boolean;
  is_current?: boolean;
};

interface TrustedDeviceManagerProps {
  devices?: DeviceInfo[];
  onRevoke?: (deviceId: string) => void;
  isLoading?: boolean;
}

const TrustedDeviceManager: React.FC<TrustedDeviceManagerProps> = ({ devices = [], onRevoke, isLoading }) => {
  if (isLoading) {
    return <div className="text-sm text-slate-500">Loading trusted devices…</div>;
  }

  if (!devices.length) {
    return <div className="text-sm text-slate-500">No trusted devices.</div>;
  }

  return (
    <div className="space-y-3">
      {devices.map((d) => (
        <div key={d.id} className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-700 p-3">
          <div>
            <div className="font-medium text-slate-900 dark:text-slate-100">{d.device_name}</div>
            <div className="text-xs text-slate-500">Last used: {d.last_used || '—'}{d.is_current ? ' • current device' : ''}</div>
          </div>
          {onRevoke && (
            <button onClick={() => onRevoke(d.id)} className="text-xs px-3 py-1.5 rounded-md bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30">Revoke</button>
          )}
        </div>
      ))}
    </div>
  );
};

export default TrustedDeviceManager;



