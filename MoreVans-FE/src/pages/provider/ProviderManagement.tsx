import React, { useState, useEffect, useMemo } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, Card, Tag, Avatar, Tooltip, Popconfirm, message, Row, Col, Statistic, Badge } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, FilterOutlined, ExportOutlined, UserOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { TableProps } from 'antd';
import { useProviderManagement } from './hooks/useProviderManagement';

// Types
interface Provider {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    company?: string;
    status: 'active' | 'inactive' | 'pending' | 'suspended';
    verified: boolean;
    rating: number;
    totalJobs: number;
    joinedDate: string;
    lastActive: string;
    vehicleTypes: string[];
    serviceAreas: string[];
    profileImage?: string;
}

interface ProviderFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    company?: string;
    status: string;
    vehicleTypes: string[];
    serviceAreas: string[];
}

const ProviderManagement: React.FC = () => {
    // Hooks
    const {
        providers,
        loading,
        createProvider,
        updateProvider,
        deleteProvider,
        fetchProviders,
        searchProviders,
        filterProviders,
        exportProviders
    } = useProviderManagement();

    // State
    const [searchText, setSearchText] = useState('');
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingProvider, setEditingProvider] = useState<Provider | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [filterVerified, setFilterVerified] = useState<string>('all');
    const [form] = Form.useForm();

    // Effect for initial data loading
    useEffect(() => {
        fetchProviders();
    }, []);

    // Computed values
    const stats = useMemo(() => {
        const total = providers.length;
        const active = providers.filter(p => p.status === 'active').length;
        const pending = providers.filter(p => p.status === 'pending').length;
        const verified = providers.filter(p => p.verified).length;
        
        return { total, active, pending, verified };
    }, [providers]);

    // Filtered data based on search and filters
    const filteredProviders = useMemo(() => {
        let filtered = providers;

        // Search filter
        if (searchText) {
            filtered = filtered.filter(provider =>
                provider.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
                provider.lastName.toLowerCase().includes(searchText.toLowerCase()) ||
                provider.email.toLowerCase().includes(searchText.toLowerCase()) ||
                provider.phone.includes(searchText) ||
                (provider.company && provider.company.toLowerCase().includes(searchText.toLowerCase()))
            );
        }

        // Status filter
        if (filterStatus !== 'all') {
            filtered = filtered.filter(provider => provider.status === filterStatus);
        }

        // Verified filter
        if (filterVerified !== 'all') {
            const isVerified = filterVerified === 'verified';
            filtered = filtered.filter(provider => provider.verified === isVerified);
        }

        return filtered;
    }, [providers, searchText, filterStatus, filterVerified]);

    // Handlers
    const handleAdd = () => {
        setEditingProvider(null);
        setModalVisible(true);
        form.resetFields();
    };

    const handleEdit = (provider: Provider) => {
        setEditingProvider(provider);
        setModalVisible(true);
        form.setFieldsValue({
            firstName: provider.firstName,
            lastName: provider.lastName,
            email: provider.email,
            phone: provider.phone,
            company: provider.company,
            status: provider.status,
            vehicleTypes: provider.vehicleTypes,
            serviceAreas: provider.serviceAreas,
        });
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteProvider(id);
            message.success('Provider deleted successfully');
        } catch (error) {
            message.error('Failed to delete provider');
        }
    };

    const handleBulkDelete = async () => {
        try {
            await Promise.all(selectedRowKeys.map(id => deleteProvider(id as string)));
            message.success(`${selectedRowKeys.length} providers deleted successfully`);
            setSelectedRowKeys([]);
        } catch (error) {
            message.error('Failed to delete providers');
        }
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            const providerData: ProviderFormData = values;

            if (editingProvider) {
                await updateProvider(editingProvider.id, providerData);
                message.success('Provider updated successfully');
            } else {
                await createProvider(providerData);
                message.success('Provider created successfully');
            }

            setModalVisible(false);
            form.resetFields();
        } catch (error) {
            message.error('Please check the form for errors');
        }
    };

    const handleExport = async () => {
        try {
            await exportProviders(filteredProviders);
            message.success('Data exported successfully');
        } catch (error) {
            message.error('Failed to export data');
        }
    };

    const getStatusColor = (status: string) => {
        const colors = {
            active: 'green',
            inactive: 'default',
            pending: 'orange',
            suspended: 'red'
        };
        return colors[status as keyof typeof colors] || 'default';
    };

    const getRatingColor = (rating: number) => {
        if (rating >= 4.5) return '#52c41a';
        if (rating >= 4.0) return '#faad14';
        if (rating >= 3.0) return '#fa8c16';
        return '#f5222d';
    };

    // Table columns
    const columns: ColumnsType<Provider> = [
        {
            title: 'Provider',
            key: 'provider',
            width: 250,
            render: (_, record) => (
                <Space>
                    <Avatar 
                        src={record.profileImage} 
                        icon={<UserOutlined />}
                        size={40}
                    />
                    <div>
                        <div style={{ fontWeight: 500 }}>
                            {record.firstName} {record.lastName}
                            {record.verified && (
                                <Badge 
                                    count="✓" 
                                    style={{ backgroundColor: '#52c41a', marginLeft: 8 }}
                                />
                            )}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                            {record.company || 'Independent'}
                        </div>
                    </div>
                </Space>
            )
        },
        {
            title: 'Contact',
            key: 'contact',
            width: 200,
            render: (_, record) => (
                <div>
                    <div style={{ marginBottom: 4 }}>
                        <MailOutlined style={{ marginRight: 4, color: '#666' }} />
                        {record.email}
                    </div>
                    <div>
                        <PhoneOutlined style={{ marginRight: 4, color: '#666' }} />
                        {record.phone}
                    </div>
                </div>
            )
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status: string) => (
                <Tag color={getStatusColor(status)}>
                    {status.toUpperCase()}
                </Tag>
            ),
            filters: [
                { text: 'Active', value: 'active' },
                { text: 'Inactive', value: 'inactive' },
                { text: 'Pending', value: 'pending' },
                { text: 'Suspended', value: 'suspended' },
            ],
            onFilter: (value, record) => record.status === value,
        },
        {
            title: 'Rating',
            dataIndex: 'rating',
            key: 'rating',
            width: 100,
            render: (rating: number) => (
                <span style={{ color: getRatingColor(rating), fontWeight: 500 }}>
                    ⭐ {rating.toFixed(1)}
                </span>
            ),
            sorter: (a, b) => a.rating - b.rating,
        },
        {
            title: 'Jobs',
            dataIndex: 'totalJobs',
            key: 'totalJobs',
            width: 80,
            sorter: (a, b) => a.totalJobs - b.totalJobs,
        },
        {
            title: 'Vehicle Types',
            dataIndex: 'vehicleTypes',
            key: 'vehicleTypes',
            width: 150,
            render: (types: string[]) => (
                <div>
                    {types.slice(0, 2).map(type => (
                        <Tag key={type} size="small">{type}</Tag>
                    ))}
                    {types.length > 2 && (
                        <Tag size="small">+{types.length - 2}</Tag>
                    )}
                </div>
            )
        },
        {
            title: 'Joined',
            dataIndex: 'joinedDate',
            key: 'joinedDate',
            width: 100,
            render: (date: string) => new Date(date).toLocaleDateString(),
            sorter: (a, b) => new Date(a.joinedDate).getTime() - new Date(b.joinedDate).getTime(),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 120,
            fixed: 'right',
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="View Details">
                        <Button 
                            type="text" 
                            icon={<EyeOutlined />} 
                            size="small"
                            onClick={() => {/* Navigate to provider detail */}}
                        />
                    </Tooltip>
                    <Tooltip title="Edit">
                        <Button 
                            type="text" 
                            icon={<EditOutlined />} 
                            size="small"
                            onClick={() => handleEdit(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Popconfirm
                            title="Are you sure you want to delete this provider?"
                            onConfirm={() => handleDelete(record.id)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button 
                                type="text" 
                                icon={<DeleteOutlined />} 
                                size="small"
                                danger
                            />
                        </Popconfirm>
                    </Tooltip>
                </Space>
            )
        }
    ];

    // Row selection config
    const rowSelection: TableProps<Provider>['rowSelection'] = {
        selectedRowKeys,
        onChange: setSelectedRowKeys,
        getCheckboxProps: (record) => ({
            disabled: record.status === 'active', // Disable checkbox for active providers
        }),
    };

    return (
        <div className="provider-management">
            {/* Statistics Cards */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Total Providers"
                            value={stats.total}
                            prefix={<UserOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Active Providers"
                            value={stats.active}
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Pending Approval"
                            value={stats.pending}
                            valueStyle={{ color: '#cf1322' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Verified Providers"
                            value={stats.verified}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Main Content Card */}
            <Card 
                title="Provider Management"
                className="provider-table-card"
                extra={
                    <Space>
                        <Button 
                            type="primary" 
                            icon={<PlusOutlined />}
                            onClick={handleAdd}
                        >
                            Add Provider
                        </Button>
                        <Button 
                            icon={<ExportOutlined />}
                            onClick={handleExport}
                        >
                            Export
                        </Button>
                    </Space>
                }
            >
                {/* Filters and Search */}
                <Row gutter={16} style={{ marginBottom: 16 }}>
                    <Col span={8}>
                        <Input.Search
                            placeholder="Search providers..."
                            allowClear
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            prefix={<SearchOutlined />}
                        />
                    </Col>
                    <Col span={4}>
                        <Select
                            placeholder="Status"
                            value={filterStatus}
                            onChange={setFilterStatus}
                            style={{ width: '100%' }}
                        >
                            <Select.Option value="all">All Status</Select.Option>
                            <Select.Option value="active">Active</Select.Option>
                            <Select.Option value="inactive">Inactive</Select.Option>
                            <Select.Option value="pending">Pending</Select.Option>
                            <Select.Option value="suspended">Suspended</Select.Option>
                        </Select>
                    </Col>
                    <Col span={4}>
                        <Select
                            placeholder="Verification"
                            value={filterVerified}
                            onChange={setFilterVerified}
                            style={{ width: '100%' }}
                        >
                            <Select.Option value="all">All</Select.Option>
                            <Select.Option value="verified">Verified</Select.Option>
                            <Select.Option value="unverified">Unverified</Select.Option>
                        </Select>
                    </Col>
                    <Col span={8} style={{ textAlign: 'right' }}>
                        {selectedRowKeys.length > 0 && (
                            <Space>
                                <span>{selectedRowKeys.length} selected</span>
                                <Popconfirm
                                    title={`Delete ${selectedRowKeys.length} selected providers?`}
                                    onConfirm={handleBulkDelete}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button type="primary" danger size="small">
                                        Delete Selected
                                    </Button>
                                </Popconfirm>
                            </Space>
                        )}
                    </Col>
                </Row>

                {/* Table */}
                <Table<Provider>
                    columns={columns}
                    dataSource={filteredProviders}
                    rowKey="id"
                    rowSelection={rowSelection}
                    loading={loading}
                    pagination={{
                        total: filteredProviders.length,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) => 
                            `${range[0]}-${range[1]} of ${total} providers`,
                    }}
                    scroll={{ x: 1200 }}
                    size="middle"
                />
            </Card>

            {/* Add/Edit Modal */}
            <Modal
                title={editingProvider ? 'Edit Provider' : 'Add New Provider'}
                open={modalVisible}
                onOk={handleModalOk}
                onCancel={() => {
                    setModalVisible(false);
                    form.resetFields();
                }}
                width={600}
                destroyOnClose
            >
                <Form
                    form={form}
                    layout="vertical"
                    requiredMark={false}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="firstName"
                                label="First Name"
                                rules={[{ required: true, message: 'Please enter first name' }]}
                            >
                                <Input placeholder="Enter first name" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="lastName"
                                label="Last Name"
                                rules={[{ required: true, message: 'Please enter last name' }]}
                            >
                                <Input placeholder="Enter last name" />
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
                                <Input placeholder="Enter email address" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="phone"
                                label="Phone"
                                rules={[{ required: true, message: 'Please enter phone number' }]}
                            >
                                <Input placeholder="Enter phone number" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="company"
                                label="Company"
                            >
                                <Input placeholder="Enter company name (optional)" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="status"
                                label="Status"
                                rules={[{ required: true, message: 'Please select status' }]}
                            >
                                <Select placeholder="Select status">
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
                                <Select
                                    mode="multiple"
                                    placeholder="Select vehicle types"
                                    options={[
                                        { label: 'Van', value: 'van' },
                                        { label: 'Truck', value: 'truck' },
                                        { label: 'Pickup', value: 'pickup' },
                                        { label: 'SUV', value: 'suv' },
                                        { label: 'Car', value: 'car' },
                                    ]}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="serviceAreas"
                                label="Service Areas"
                                rules={[{ required: true, message: 'Please select service areas' }]}
                            >
                                <Select
                                    mode="multiple"
                                    placeholder="Select service areas"
                                    options={[
                                        { label: 'Downtown', value: 'downtown' },
                                        { label: 'Suburbs', value: 'suburbs' },
                                        { label: 'Airport', value: 'airport' },
                                        { label: 'Industrial', value: 'industrial' },
                                    ]}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
};

export default ProviderManagement;