import React from 'react';
import {
  Star,
  Car,
  Calendar,
  DollarSign,
  Shield,
  FileText,
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock
} from 'lucide-react';
import { formatDate, formatPhoneNumber, getStatusBadgeClass } from '../../utils';
import Gbp from '../../../../../helper/CurrencyFormatter';
import type { Provider as ProviderType } from '../../types';

interface OverviewTabProps {
  provider: ProviderType;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ provider }) => {
  return (
    <div className="space-y-6">
      {/* Provider Information */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center">
          <FileText className="w-5 h-5 text-blue-500 mr-2" />
          <h3 className="text-lg font-semibold">Provider Information</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-4">Contact Details</h4>
              <div className="space-y-3">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">{provider?.base_location || 'N/A'}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">{formatPhoneNumber(provider?.user?.phone_number)}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">{provider?.user?.email}</span>
                </div>
                <div className="flex items-center">
                  <Globe className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">{provider?.website || 'N/A'}</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-4">Business Details</h4>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">Joined {formatDate(provider?.user?.date_joined)}</span>
                </div>
                <div className="flex items-center">
                  <Shield className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">
                    Verification Status: <span className={getStatusBadgeClass(provider?.verification_status)}>{provider?.verification_status}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center">
          <DollarSign className="w-5 h-5 text-blue-500 mr-2" />
          <h3 className="text-lg font-semibold">Performance Metrics</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Star className="w-4 h-4 text-yellow-400 mr-2" />
                <span className="text-sm font-medium text-gray-500">Average Rating</span>
              </div>
              <div className="text-2xl font-semibold text-gray-900">
                {provider.average_rating ? provider.average_rating.toFixed(1) : 'N/A'}
              </div>
              <div className="text-sm text-gray-500">
                from {provider.reviews?.length || 0} reviews
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Car className="w-4 h-4 text-blue-500 mr-2" />
                <span className="text-sm font-medium text-gray-500">Total Jobs</span>
              </div>
              <div className="text-2xl font-semibold text-gray-900">
                {provider.completed_bookings_count || 0}
              </div>
              <div className="text-sm text-gray-500">completed successfully</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Calendar className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-sm font-medium text-gray-500">Response Time</span>
              </div>
              <div className="text-2xl font-semibold text-gray-900">
                {provider.last_active ? formatDate(provider.last_active) : 'N/A'}
              </div>
              <div className="text-sm text-gray-500">last active</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <DollarSign className="w-4 h-4 text-purple-500 mr-2" />
                <span className="text-sm font-medium text-gray-500">Total Revenue</span>
              </div>
              <div className="text-2xl font-semibold text-gray-900">
                {Gbp(provider.payments?.reduce((sum: number, payment: { amount?: number }) => sum + (payment.amount || 0), 0) || 0)}
              </div>
              <div className="text-sm text-gray-500">lifetime earnings</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 