import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    IconArrowLeft,
    IconRefresh,
    IconEdit,
    IconTrash
} from '@tabler/icons-react';
import { Button } from '../../../../../components/ui/Button';

interface BinHeaderProps {
    binName: string;
    binId: string;
    onRefresh?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
}

const BinHeader: React.FC<BinHeaderProps> = ({
    binName,
    binId,
    onRefresh,
    onEdit,
    onDelete
}) => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
                <Button variant="outline" onClick={() => navigate('/admin/smart-bins')}>
                    <IconArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{binName}</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{binId}</p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <Button variant="outline" onClick={onRefresh}>
                    <IconRefresh className="w-4 h-4 mr-2" />
                    Refresh
                </Button>
                <Button onClick={onEdit}>
                    <IconEdit className="w-4 h-4 mr-2" />
                    Edit
                </Button>
                <Button variant="outline" className="text-red-600 hover:text-red-700" onClick={onDelete}>
                    <IconTrash className="w-4 h-4 mr-2" />
                    Delete
                </Button>
            </div>
        </div>
    );
};

export default BinHeader;
