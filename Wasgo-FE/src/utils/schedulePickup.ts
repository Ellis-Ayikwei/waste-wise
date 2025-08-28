import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateFormValues, setCurrentStep } from '../store/slices/createRequestSlice';

interface SchedulePickupParams {
    binId: string;
    binName: string;
    binAddress: string;
    binType: string;
    fillLevel: number;
}

export const useSchedulePickup = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const schedulePickup = ({ binId, binName, binAddress, binType, fillLevel }: SchedulePickupParams) => {
        // Open the customer service request creation modal with pre-selected bin
        const params = new URLSearchParams({
            bin_id: binId,
            bin_name: binName,
            bin_address: binAddress,
            bin_type: binType,
            fill_level: fillLevel.toString(),
            service_type: 'waste_collection'
        });
        
        // Navigate to the customer service request creation page
        navigate(`/service-request/create?${params.toString()}`);
    };

    return { schedulePickup };
};
