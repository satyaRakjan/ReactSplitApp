import React, { useState } from 'react';
import { Empty, Input, Switch, Typography, Form, Breadcrumb, Layout, Menu, theme, Button, Flex, Space, Tabs, TabsProps, Badge, Descriptions, Rate } from 'antd';
import { setFullPage, setClosePage, resetDefault, setSizes } from "../store/splitterSlice";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams, useLocation } from "react-router-dom";
import { AndroidOutlined, AppleOutlined, CloseOutlined, FullscreenOutlined, FullscreenExitOutlined, EditOutlined } from '@ant-design/icons';
import { Phone, emptyPhone } from '../model/PhoneContext';

const { Title } = Typography;

const { Header, Content, Footer } = Layout;

const items = Array.from({ length: 15 }).map((_, index) => ({
    key: index + 1,
    label: `nav ${index + 1}`,
}));

const boxStyle: React.CSSProperties = {
    width: '100%',
    height: 120,
    borderRadius: 6,
};


const SecondPage: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // get id from URL
    const location = useLocation();
    const [isEditing, setIsEditing] = useState(false);
    const [form] = Form.useForm();
    const record = location.state || emptyPhone; // get ful
    console.log(id)
    console.log(record)

    const dispatch = useDispatch<AppDispatch>();
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const navigate = useNavigate();
    const handleNavigate = (path: string) => navigate(path);


    const onChange = (key: string) => {
        console.log(key);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const handleEdit = () => {
        setIsEditing(true);
        form.setFieldsValue({
            phoneName: record.phoneName,
            inStock: record.inStock ? 'Yes' : 'No',
            rating: record.rating,
        });
    };

    const handleSave = () => {
        form.validateFields().then(values => {
            console.log('Updated Values:', values);
            // You can call API to save changes here
            setIsEditing(false);
        });
    };

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Info.',
            children:
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <Title level={3} style={{ margin: 0 }}>Phone Information</Title>
                        {!isEditing && (
                            <Button icon={<EditOutlined />} onClick={handleEdit}>
                                Edit
                            </Button>
                        )}
                    </div>
                    {isEditing ? (
                        <Form form={form} layout="vertical">
                            <Form.Item name="phoneName" label="Phone Name">
                                <Input />
                            </Form.Item>
                            <Form.Item name="inStock" label="Stock" valuePropName="checked">
                                <Switch checkedChildren="In Stock" unCheckedChildren="Out of Stock" />
                            </Form.Item>
                            <Form.Item name="rating" label="Rating">
                                <Rate />
                            </Form.Item>
                            <div style={{ marginTop: 16 }}>
                                <Button type="primary" onClick={handleSave} style={{ marginRight: 8 }}>Save</Button>
                                <Button onClick={handleCancel}>Cancel</Button>
                            </div>
                        </Form>
                    ) : (
                        <div>
                            <Descriptions bordered column={1} size="middle">
                                <Descriptions.Item label="Name">{record.phoneName}</Descriptions.Item>
                                <Descriptions.Item label="brand">{record.brand}</Descriptions.Item>
                                <Descriptions.Item label="camera">{record.camera}</Descriptions.Item>
                                <Descriptions.Item label="os">{record.os}</Descriptions.Item>
                                <Descriptions.Item label="price">{record.price}</Descriptions.Item>
                                <Descriptions.Item label="ram">{record.ram}</Descriptions.Item>
                                <Descriptions.Item label="releaseYear">{record.releaseYear}</Descriptions.Item>
                                <Descriptions.Item label="screenSize">{record.screenSize}</Descriptions.Item>
                                <Descriptions.Item label="storage">{record.storage}</Descriptions.Item>
                                <Descriptions.Item label="Rating">
                                    <Rate disabled value={record.rating} />
                                </Descriptions.Item>
                            </Descriptions>
                            <p>{record.description}</p>
                        </div>
                    )}

                </div>
        },
        {
            key: '2',
            label: 'Reviews',
            children: 'Content of Tab Pane 2',
        },

    ];

    const isRecordEmpty = !record || record.id === 0;

    return (
        <Layout style={{ minHeight: '90vh' }}  >

            <Header style={{ display: 'flex', alignItems: 'center', justifyContent: "space-between", background: colorBgContainer }}>
                <Space>
                    <Title level={3} style={{ margin: 0 }}>{record.phoneName}</Title>
                    <Badge status={record.inStock ? "success" : "error"} text={record.inStock ? "In Stock" : "Out of Stock"} />
                </Space>
                <Space>
                    <Button icon={<FullscreenOutlined />} onClick={() => dispatch(setFullPage())}></Button>
                    <Button icon={<FullscreenExitOutlined />} onClick={() => dispatch(resetDefault())}></Button>
                    <Button icon={<CloseOutlined />} onClick={() => dispatch(setClosePage())}></Button>
                </Space>

            </Header>
            <Content style={{ padding: '0 20px' }}>
                <Space style={{ margin: "10px" }}>
                    <div />
                </Space>

                <div
                    style={{
                        background: colorBgContainer,
                        minHeight: '80vh',
                        padding: 24,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    {!isRecordEmpty ? (
                        <Tabs defaultActiveKey="1" items={items} onChange={onChange} />

                    ) : (
                        <Empty description="No data found" />

                    )}

                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>
                {/* Ant Design ©{new Date().getFullYear()} Created by Ant UED */}
            </Footer>
        </Layout>
    );
};

export default SecondPage;
