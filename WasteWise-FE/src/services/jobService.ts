import api from './api';

export interface Job {
  id: string;
  job_number: string;
  title: string;
  description: string;
  status: 'draft' | 'pending' | 'bidding' | 'accepted' | 'assigned' | 'in_transit' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  price: number;
  minimum_bid: number;
  bidding_end_time: string | null;
  is_instant: boolean;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
  
  // Request details
  request: {
    id: string;
    customer: {
      id: string;
      name: string;
      phone: string;
      email: string;
    };
    pickup_location: string;
    dropoff_location: string;
    service_type: string;
    estimated_volume: string;
    scheduled_time: string;
    special_instructions: string;
  };
  
  // Provider details
  assigned_provider?: {
    id: string;
    name: string;
    phone: string;
    rating: number;
  };
  
  // Driver and vehicle
  driver?: {
    id: string;
    name: string;
    phone: string;
    license: string;
  };
  
  vehicle?: {
    id: string;
    type: string;
    model: string;
    capacity: string;
    license: string;
  };
  
  // Additional fields
  preferred_vehicle_types?: string[];
  required_qualifications?: string[];
  notes?: string;
}

export interface JobRequest {
  id: string;
  customer: {
    id: string;
    name: string;
    phone: string;
    email: string;
  };
  pickup_location: string;
  dropoff_location: string;
  service_type: string;
  estimated_volume: string;
  scheduled_time: string;
  special_instructions: string;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface JobBid {
  id: string;
  job: string;
  provider: {
    id: string;
    name: string;
    rating: number;
  };
  amount: number;
  estimated_duration: string;
  notes: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}

export interface JobTracking {
  job_id: string;
  current_status: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  estimated_arrival: string;
  driver: {
    name: string;
    phone: string;
  };
  vehicle: {
    type: string;
    model: string;
    license: string;
  };
  progress_percentage: number;
  last_update: string;
}

class JobService {
  // Get all jobs
  async getAllJobs(params?: {
    status?: string;
    priority?: string;
    limit?: number;
    offset?: number;
    ordering?: string;
  }): Promise<{ results: Job[]; count: number; next: string | null; previous: string | null }> {
    try {
      const response = await api.get('/Wasgo/api/v1/jobs/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }
  }

  // Get specific job by ID
  async getJobById(id: string): Promise<Job> {
    try {
      const response = await api.get(`/Wasgo/api/v1/jobs/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching job:', error);
      throw error;
    }
  }

  // Create new job
  async createJob(jobData: Partial<Job>): Promise<Job> {
    try {
      const response = await api.post('/Wasgo/api/v1/jobs/', jobData);
      return response.data;
    } catch (error) {
      console.error('Error creating job:', error);
      throw error;
    }
  }

  // Update job
  async updateJob(id: string, jobData: Partial<Job>): Promise<Job> {
    try {
      const response = await api.patch(`/Wasgo/api/v1/jobs/${id}/`, jobData);
      return response.data;
    } catch (error) {
      console.error('Error updating job:', error);
      throw error;
    }
  }

  // Accept job (for providers)
  async acceptJob(jobId: string, providerId: string, bidAmount?: number): Promise<Job> {
    try {
      const response = await api.post(`/Wasgo/api/v1/jobs/${jobId}/accept/`, {
        provider_id: providerId,
        bid_amount: bidAmount
      });
      return response.data;
    } catch (error) {
      console.error('Error accepting job:', error);
      throw error;
    }
  }

  // Complete job
  async completeJob(jobId: string, completionData?: {
    actual_duration?: string;
    notes?: string;
    photos?: string[];
  }): Promise<Job> {
    try {
      const response = await api.post(`/Wasgo/api/v1/jobs/${jobId}/complete/`, completionData);
      return response.data;
    } catch (error) {
      console.error('Error completing job:', error);
      throw error;
    }
  }

  // Cancel job
  async cancelJob(jobId: string, reason?: string): Promise<Job> {
    try {
      const response = await api.post(`/Wasgo/api/v1/jobs/${jobId}/cancel/`, { reason });
      return response.data;
    } catch (error) {
      console.error('Error cancelling job:', error);
      throw error;
    }
  }

  // Get job tracking information
  async getJobTracking(jobId: string): Promise<JobTracking> {
    try {
      const response = await api.get(`/Wasgo/api/v1/jobs/${jobId}/tracking/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching job tracking:', error);
      throw error;
    }
  }

  // Get job bids
  async getJobBids(jobId: string): Promise<JobBid[]> {
    try {
      const response = await api.get(`/Wasgo/api/v1/jobs/${jobId}/bids/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching job bids:', error);
      throw error;
    }
  }

  // Submit bid for job
  async submitBid(jobId: string, bidData: {
    amount: number;
    estimated_duration: string;
    notes?: string;
  }): Promise<JobBid> {
    try {
      const response = await api.post(`/Wasgo/api/v1/jobs/${jobId}/bids/`, bidData);
      return response.data;
    } catch (error) {
      console.error('Error submitting bid:', error);
      throw error;
    }
  }

  // Get jobs by status
  async getJobsByStatus(status: string): Promise<Job[]> {
    try {
      const response = await api.get('/Wasgo/api/v1/jobs/', {
        params: { status }
      });
      return response.data.results || response.data;
    } catch (error) {
      console.error('Error fetching jobs by status:', error);
      throw error;
    }
  }

  // Get jobs by priority
  async getJobsByPriority(priority: string): Promise<Job[]> {
    try {
      const response = await api.get('/Wasgo/api/v1/jobs/', {
        params: { priority }
      });
      return response.data.results || response.data;
    } catch (error) {
      console.error('Error fetching jobs by priority:', error);
      throw error;
    }
  }

  // Get jobs for specific provider
  async getProviderJobs(providerId: string): Promise<Job[]> {
    try {
      const response = await api.get('/Wasgo/api/v1/jobs/', {
        params: { provider: providerId }
      });
      return response.data.results || response.data;
    } catch (error) {
      console.error('Error fetching provider jobs:', error);
      throw error;
    }
  }

  // Get jobs for specific customer
  async getCustomerJobs(customerId: string): Promise<Job[]> {
    try {
      const response = await api.get('/Wasgo/api/v1/jobs/', {
        params: { customer: customerId }
      });
      return response.data.results || response.data;
    } catch (error) {
      console.error('Error fetching customer jobs:', error);
      throw error;
    }
  }

  // Get jobs by location
  async getJobsByLocation(latitude: number, longitude: number, radiusKm: number = 10): Promise<Job[]> {
    try {
      const response = await api.get('/Wasgo/api/v1/jobs/', {
        params: {
          latitude,
          longitude,
          radius_km: radiusKm
        }
      });
      return response.data.results || response.data;
    } catch (error) {
      console.error('Error fetching jobs by location:', error);
      throw error;
    }
  }

  // Get job statistics
  async getJobStatistics(): Promise<{
    total_jobs: number;
    completed_jobs: number;
    pending_jobs: number;
    cancelled_jobs: number;
    average_completion_time: number;
    total_earnings: number;
    jobs_by_status: Record<string, number>;
    jobs_by_priority: Record<string, number>;
  }> {
    try {
      const response = await api.get('/Wasgo/api/v1/jobs/statistics/');
      return response.data;
    } catch (error) {
      console.error('Error fetching job statistics:', error);
      throw error;
    }
  }

  // Get recent jobs
  async getRecentJobs(limit: number = 10): Promise<Job[]> {
    try {
      const response = await api.get('/Wasgo/api/v1/jobs/', {
        params: {
          limit,
          ordering: '-created_at'
        }
      });
      return response.data.results || response.data;
    } catch (error) {
      console.error('Error fetching recent jobs:', error);
      throw error;
    }
  }

  // Search jobs
  async searchJobs(query: string): Promise<Job[]> {
    try {
      const response = await api.get('/Wasgo/api/v1/jobs/', {
        params: { search: query }
      });
      return response.data.results || response.data;
    } catch (error) {
      console.error('Error searching jobs:', error);
      throw error;
    }
  }

  // Get job requests (for customers)
  async getJobRequests(customerId?: string): Promise<JobRequest[]> {
    try {
      const params = customerId ? { customer: customerId } : {};
      const response = await api.get('/Wasgo/api/v1/requests/', { params });
      return response.data.results || response.data;
    } catch (error) {
      console.error('Error fetching job requests:', error);
      throw error;
    }
  }

  // Create job request
  async createJobRequest(requestData: {
    pickup_location: string;
    dropoff_location: string;
    service_type: string;
    estimated_volume: string;
    scheduled_time: string;
    special_instructions?: string;
  }): Promise<JobRequest> {
    try {
      const response = await api.post('/Wasgo/api/v1/requests/', requestData);
      return response.data;
    } catch (error) {
      console.error('Error creating job request:', error);
      throw error;
    }
  }

  // Update job request
  async updateJobRequest(requestId: string, requestData: Partial<JobRequest>): Promise<JobRequest> {
    try {
      const response = await api.patch(`/Wasgo/api/v1/requests/${requestId}/`, requestData);
      return response.data;
    } catch (error) {
      console.error('Error updating job request:', error);
      throw error;
    }
  }

  // Cancel job request
  async cancelJobRequest(requestId: string, reason?: string): Promise<JobRequest> {
    try {
      const response = await api.post(`/Wasgo/api/v1/requests/${requestId}/cancel/`, { reason });
      return response.data;
    } catch (error) {
      console.error('Error cancelling job request:', error);
      throw error;
    }
  }
}

export default new JobService();
