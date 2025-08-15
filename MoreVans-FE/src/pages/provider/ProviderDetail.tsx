import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Card,
    Row,
    Col,
    Avatar,
    Tag,
    Button,
    Tabs,
    Table,
    Statistic,
    Timeline,
    Rate,
    Space,
    Descriptions,
    Modal,
    Form,
    Input,
    Select,
    Upload,
    message,
    Spin,
    Alert,
    Badge,
    Tooltip,
    Progress
} from 'antd';
import {
    UserOutlined,
    EditOutlined,
    MailOutlined,
    PhoneOutlined,
    CalendarOutlined,
    CarOutlined,
    StarOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    UploadOutlined,
    ArrowLeftOutlined,
    EyeOutlined,
    HistoryOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { UploadFile } from 'antd/es/upload/interface';
import { providerService } from '../../services/providerService';
import type { Provider } from './hooks/useProviderManagement';

const { TabPane } = Tabs;

interface JobRecord {
    id: string;
    title: string;
    customer: string;
    date: string;
    status: 'completed' | 'in-progress' | 'cancelled';
    amount: number;
    rating?: number;
}

interface ActivityLog {
    id: string;
    action: string;
    timestamp: string;
    details: string;
    type: 'info' | 'success' | 'warning' | 'error';
}

const ProviderDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    // State
    const [provider, setProvider] = useState<Provider | null>(null);
    const [loading, setLoading] = useState(true);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [jobs, setJobs] = useState<JobRecord[]>([]);
    const [activities, setActivities] = useState<ActivityLog[]>([]);
    const [activeTab, setActiveTab] = useState('overview');
    const [form] = Form.useForm();

    // Effects
    useEffect(() => {
        if (id) {
            fetchProviderData();
        }
    }, [id]);

    // Fetch provider data
    const fetchProviderData = async () => {
        if (!id) return;
        
        setLoading(true);
        try {
            const [providerResponse, activityResponse] = await Promise.all([
                providerService.getProvider(id),
                providerService.getProviderActivity(id)
            ]);

            if (providerResponse.success) {
                setProvider(providerResponse.data);
                form.setFieldsValue(providerResponse.data);
            }

            if (activityResponse.success) {
                setActivities(activityResponse.data);
            }

            // Mock jobs data - replace with actual API call
            setJobs([
                {
                    id: '1',
                    title: 'House Moving Service',
                    customer: 'John Doe',
                    date: '2024-01-15',
                    status: 'completed',
                    amount: 250,
                    rating: 5
                },
                {
                    id: '2',
                    title: 'Office Relocation',
                    customer: 'ABC Corp',
                    date: '2024-01-20',
                    status: 'completed',
                    amount: 500,
                    rating: 4
                }
            ]);
        } catch (error) {
            message.error('Failed to fetch provider data');
        } finally {
            setLoading(false);
        }
    };

    // Handle edit provider
    const handleEdit = async () => {
        try {
            const values = await form.validateFields();
            if (!id || !provider) return;

            await providerService.updateProvider(id, values);
            setProvider({ ...provider, ...values });
            setEditModalVisible(false);
            message.success('Provider updated successfully');
        } catch (error) {
            message.error('Failed to update provider');
        }
    };

    // Handle status change
    const handleStatusChange = async (newStatus: string) => {
        if (!id || !provider) return;

        try {
            await providerService.updateProviderStatus(id, newStatus);
            setProvider({ ...provider, status: newStatus as any });
            message.success('Status updated successfully');
        } catch (error) {
            message.error('Failed to update status');
        }
    };

    // Handle verification toggle
    const handleVerificationToggle = async () => {
        if (!id || !provider) return;

        try {
            const newVerified = !provider.verified;
            await providerService.verifyProvider(id, newVerified);
            setProvider({ ...provider, verified: newVerified });
            message.success(`Provider ${newVerified ? 'verified' : 'unverified'} successfully`);
        } catch (error) {
            message.error('Failed to update verification status');
        }
    };

    // Handle image upload
    const handleImageUpload = async (file: UploadFile) => {
        if (!id || !provider) return false;

        setUploading(true);
        try {
            const response = await providerService.uploadProviderImage(id, file as any);
            if (response.success) {
                setProvider({ ...provider, profileImage: response.data.imageUrl });
                message.success('Profile image updated successfully');
            }
        } catch (error) {
            message.error('Failed to upload image');
        } finally {
            setUploading(false);
        }
        return false; // Prevent default upload behavior
    };

    // Get status color
    const getStatusColor = (status: string) => {
        const colors = {
            active: 'green',
            inactive: 'default',
            pending: 'orange',
            suspended: 'red'
        };
        return colors[status as keyof typeof colors] || 'default';
    };

    // Get rating color
    const getRatingColor = (rating: number) => {
        if (rating >= 4.5) return '#52c41a';
        if (rating >= 4.0) return '#faad14';
        if (rating >= 3.0) return '#fa8c16';
        return '#f5222d';
    };

    // Jobs table columns
    const jobColumns: ColumnsType<JobRecord> = [
        {
            title: 'Job Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Customer',
            dataIndex: 'customer',
            key: 'customer',
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (date: string) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={status === 'completed' ? 'green' : status === 'in-progress' ? 'blue' : 'red'}>
                    {status.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount: number) => `$${amount}`,
        },
        {
            title: 'Rating',
            dataIndex: 'rating',
            key: 'rating',
            render: (rating?: number) => rating ? <Rate disabled value={rating} /> : 'N/A',
        },
    ];

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!provider) {
        return (
            <Alert
                message="Provider Not Found"
                description="The requested provider could not be found."
                type="error"
                showIcon
                action={
                    <Button onClick={() => navigate('/provider/management')}>
                        Back to Providers
                    </Button>
                }
            />
        );
    }

    return (
        <div className="provider-detail">
            {/* Header */}
            <Card className="provider-header-card" style={{ marginBottom: 24 }}>
                <Row justify="space-between" align="middle">
                    <Col>
                        <Button 
                            icon={<ArrowLeftOutlined />} 
                            onClick={() => navigate('/provider/management')}
                            style={{ marginBottom: 16 }}
                        >
                            Back to Providers
                        </Button>
                    </Col>
                    <Col>
                        <Space>
                            <Button icon={<EditOutlined />} onClick={() => setEditModalVisible(true)}>
                                Edit Provider
                            </Button>
                            <Button type="primary" onClick={handleVerificationToggle}>
                                {provider.verified ? 'Unverify' : 'Verify'} Provider
                            </Button>
                        </Space>
                    </Col>
                </Row>

                <Row gutter={24} align="middle">
                    <Col>
                        <Upload
                            beforeUpload={handleImageUpload}
                            showUploadList={false}
                            accept="image/*"
                        >
                            <Avatar
                                size={100}
                                src={provider.profileImage}
                                icon={<UserOutlined />}
                                style={{ cursor: 'pointer', border: '3px solid #f0f0f0' }}
                            />
                            {uploading && (
                                <div style={{ textAlign: 'center', marginTop: 8 }}>
                                    <Spin size="small" />
                                </div>
                            )}
                        </Upload>
                    </Col>
                    <Col flex={1}>
                        <div>
                            <h2 style={{ margin: 0, marginBottom: 8 }}>
                                {provider.firstName} {provider.lastName}
                                {provider.verified && (
                                    <Badge 
                                        count={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                                        style={{ marginLeft: 8 }}
                                    />
                                )}
                            </h2>
                            <p style={{ margin: 0, color: '#666', fontSize: '16px' }}>
                                {provider.company || 'Independent Provider'}
                            </p>
                            <Space style={{ marginTop: 8 }}>
                                <Tag color={getStatusColor(provider.status)}>
                                    {provider.status.toUpperCase()}
                                </Tag>
                                <span style={{ color: getRatingColor(provider.rating) }}>
                                    <StarOutlined /> {provider.rating.toFixed(1)} Rating
                                </span>
                                <span>{provider.totalJobs} Jobs Completed</span>
                            </Space>
                        </div>
                    </Col>
                    <Col>
                        <Row gutter={16}>
                            <Col>
                                <Statistic
                                    title="Total Jobs"
                                    value={provider.totalJobs}
                                    prefix={<CheckCircleOutlined />}
                                />
                            </Col>
                            <Col>
                                <Statistic
                                    title="Rating"
                                    value={provider.rating}
                                    precision={1}
                                    prefix={<StarOutlined />}
                                    suffix="/ 5"
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Card>

            {/* Content Tabs */}
            <Card>
                <Tabs activeKey={activeTab} onChange={setActiveTab}>
                    <TabPane tab="Overview" key="overview">
                        <Row gutter={24}>
                            <Col span={12}>
                                <Card title="Contact Information" size="small">
                                    <Descriptions column={1} size="small">
                                        <Descriptions.Item 
                                            label={<><MailOutlined /> Email</>}
                                        >
                                            {provider.email}
                                        </Descriptions.Item>
                                        <Descriptions.Item 
                                            label={<><PhoneOutlined /> Phone</>}
                                        >
                                            {provider.phone}
                                        </Descriptions.Item>
                                        <Descriptions.Item 
                                            label={<><CalendarOutlined /> Joined</>}
                                        >
                                            {new Date(provider.joinedDate).toLocaleDateString()}
                                        </Descriptions.Item>
                                        <Descriptions.Item 
                                            label={<><EyeOutlined /> Last Active</>}
                                        >
                                            {new Date(provider.lastActive).toLocaleDateString()}
                                        </Descriptions.Item>
                                    </Descriptions>
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card title="Service Information" size="small">
                                    <div style={{ marginBottom: 16 }}>
                                        <strong>Vehicle Types:</strong>
                                        <div style={{ marginTop: 8 }}>
                                            {provider.vehicleTypes.map(type => (
                                                <Tag key={type} icon={<CarOutlined />}>
                                                    {type}
                                                </Tag>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <strong>Service Areas:</strong>
                                        <div style={{ marginTop: 8 }}>
                                            {provider.serviceAreas.map(area => (
                                                <Tag key={area} color="blue">
                                                    {area}
                                                </Tag>
                                            ))}
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        </Row>

                        <Row gutter={24} style={{ marginTop: 24 }}>
                            <Col span={24}>
                                <Card title="Performance Metrics" size="small">
                                    <Row gutter={16}>
                                        <Col span={6}>
                                            <Statistic 
                                                title="Completion Rate" 
                                                value={95} 
                                                suffix="%" 
                                            />
                                            <Progress percent={95} showInfo={false} strokeColor="#52c41a" />
                                        </Col>
                                        <Col span={6}>
                                            <Statistic 
                                                title="Response Time" 
                                                value={12} 
                                                suffix="min" 
                                            />
                                            <Progress percent={80} showInfo={false} strokeColor="#1890ff" />
                                        </Col>
                                        <Col span={6}>
                                            <Statistic 
                                                title="Customer Satisfaction" 
                                                value={4.8} 
                                                suffix="/ 5" 
                                                precision={1}
                                            />
                                            <Progress percent={96} showInfo={false} strokeColor="#faad14" />
                                        </Col>
                                        <Col span={6}>
                                            <Statistic 
                                                title="On-Time Delivery" 
                                                value={92} 
                                                suffix="%" 
                                            />
                                            <Progress percent={92} showInfo={false} strokeColor="#722ed1" />
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        </Row>
                    </TabPane>

                    <TabPane tab="Job History" key="jobs">
                        <Table
                            columns={jobColumns}
                            dataSource={jobs}
                            rowKey="id"
                            pagination={{
                                pageSize: 10,
                                showSizeChanger: true,
                                showTotal: (total, range) => 
                                    `${range[0]}-${range[1]} of ${total} jobs`,
                            }}
                        />
                    </TabPane>

                    <TabPane tab="Activity Log" key="activity">
                        <Timeline>
                            {activities.map(activity => (
                                <Timeline.Item
                                    key={activity.id}
                                    color={
                                        activity.type === 'success' ? 'green' :
                                        activity.type === 'warning' ? 'orange' :
                                        activity.type === 'error' ? 'red' : 'blue'
                                    }
                                >
                                    <div>
                                        <strong>{activity.action}</strong>
                                        <br />
                                        <span style={{ color: '#666' }}>{activity.details}</span>
                                        <br />
                                        <small style={{ color: '#999' }}>
                                            {new Date(activity.timestamp).toLocaleString()}
                                        </small>
                                    </div>
                                </Timeline.Item>
                            ))}
                        </Timeline>
                    </TabPane>
                </Tabs>
            </Card>

            {/* Edit Modal */}
            <Modal
                title="Edit Provider"
                open={editModalVisible}
                onOk={handleEdit}
                onCancel={() => setEditModalVisible(false)}
                width={700}
                destroyOnClose
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={provider}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="firstName"
                                label="First Name"
                                rules={[{ required: true, message: 'Please enter first name' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="lastName"
                                label="Last Name"
                                rules={[{ required: true, message: 'Please enter last name' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[
                                    { required: true, message: 'Please enter email' },
                                    { type: 'email', message: 'Please enter valid email' }
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="phone"
                                label="Phone"
                                rules={[{ required: true, message: 'Please enter phone number' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="company" label="Company">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="status"
                                label="Status"
                                rules={[{ required: true, message: 'Please select status' }]}
                            >
                                <Select>
                                    <Select.Option value="active">Active</Select.Option>
                                    <Select.Option value="inactive">Inactive</Select.Option>
                                    <Select.Option value="pending">Pending</Select.Option>
                                    <Select.Option value="suspended">Suspended</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="vehicleTypes"
                                label="Vehicle Types"
                                rules={[{ required: true, message: 'Please select vehicle types' }]}
                            >
                                <Select mode="multiple">
                                    <Select.Option value="van">Van</Select.Option>
                                    <Select.Option value="truck">Truck</Select.Option>
                                    <Select.Option value="pickup">Pickup</Select.Option>
                                    <Select.Option value="suv">SUV</Select.Option>
                                    <Select.Option value="car">Car</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="serviceAreas"
                                label="Service Areas"
                                rules={[{ required: true, message: 'Please select service areas' }]}
                            >
                                <Select mode="multiple">
                                    <Select.Option value="downtown">Downtown</Select.Option>
                                    <Select.Option value="suburbs">Suburbs</Select.Option>
                                    <Select.Option value="airport">Airport</Select.Option>
                                    <Select.Option value="industrial">Industrial</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
};

export default ProviderDetail;