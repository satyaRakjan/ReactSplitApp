import React, { useState, useEffect } from 'react';
import { Alert, List, InputNumber, Card, Col, Row, Statistic, Image, Empty, Input, Switch, Typography, Form, Breadcrumb, Layout, Menu, theme, Button, Flex, Space, Tabs, TabsProps, Badge, Descriptions, Rate } from 'antd';
import { setFullPage, setClosePage, resetDefault, setSizes } from "../store/splitterSlice";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowDownOutlined, ArrowUpOutlined, AndroidOutlined, AppleOutlined, CloseOutlined, FullscreenOutlined, FullscreenExitOutlined, EditOutlined, PhoneFilled } from '@ant-design/icons';
import { Phone, emptyPhone } from '../model/PhoneContext';
import type { InputNumberProps } from 'antd';
import { Review, useReviews, emptyReview } from '../model/ReviewContext';
import { setPhonesUpdated } from "../store/refreshSlice";


const { Title, Text } = Typography;
const { TextArea } = Input;
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
    const [phoneDetail, setPhoneDetail] = useState<Phone>(emptyPhone);
    const [editRecord, setEditRecord] = useState<Phone>(emptyPhone);
    // const [phoneList, setPhoneList] = useState<Phone[]>([]);
    const [phoneReviws, setPhoneReviws] = useState<Review[]>([]);
    const [reviewForm, setreviewForm] = useState<Review>(emptyReview);
    const location = useLocation();
    const [isEditing, setIsEditing] = useState(false);
    const [reload, setReload] = useState(0);

    const [TabID, setTabID] = useState("1");
    const [form] = Form.useForm();
    const [formReview] = Form.useForm();
    const record = location.state || emptyPhone; // get ful
    const isRecordEmpty = !record || record.id === 0;



    // let editRecord = { ...record };
    // const filteredReviews = useReviews().reviews.filter(review => review.phoneId === Number(id));
    // console.log(filteredReviews)
    useEffect(() => {
        console.log(id)
        if (id) {
            const fetchPhones = async () => {
                try {
                    const response = await fetch(`${process.env.REACT_APP_API_URL}/phones/${id}`);
                    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                    const data = await response.json();
                    console.log(data)
                    setPhoneDetail(data);
                    setEditRecord({ ...data });
                    // editRecord = { ...data };

                } catch (error) {
                    setPhoneDetail(record);
                    console.error("Failed to fetch phones:", error);
                }
            };


            const fetchReviws = async () => {
                try {
                    const response = await fetch(`${process.env.REACT_APP_API_URL}/reviews/${id}`);
                    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                    const dataReview = await response.json();

                    setPhoneReviws(dataReview);
                } catch (error) {
                    setPhoneReviws([]);
                    console.error("Failed to fetch phones:", error);
                }
            };



            fetchPhones();
            fetchReviws();
            setreviewForm(emptyReview);

        }
        // Cleanup function here can cancel any pending network requests
        return () => {
            setPhoneDetail(record);
            setPhoneReviws([]);
            setIsEditing(false);
        };
    }, [id, reload]); // 👈 Key Dependency Array
    console.log(phoneReviws)
    let diff = 0;
    let isUp = true;
    if (id) {
        diff = ((phoneDetail.price - phoneDetail.launchPrice) / phoneDetail.launchPrice) * 100;
        isUp = diff >= 0;
    }


    const dispatch = useDispatch<AppDispatch>();
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const navigate = useNavigate();
    const handleNavigate = (path: string) => navigate(path);


    const onChange = (key: string) => {
        setTabID(key);
        console.log(key);
    };

    const handleCancel = () => {
        // editRecord = {...phoneDetail};
        if (phoneDetail) {
            form.setFieldsValue({
                price: phoneDetail.price,
                inStock: phoneDetail.inStock,
                description: phoneDetail.description,
            });
        }
        setIsEditing(false);
    };

    const handleEdit = () => {
        setIsEditing(true);
        form.setFieldsValue({
            price: editRecord.price,
            inStock: editRecord.inStock ? true : false,
            description: editRecord.description,
        });
    };

    const handleSave = async () => {

        const values = await form.validateFields();
        console.log(values)
        if (values.description['currentTarget']) {
            values.description = values.description['currentTarget'].value

        }
        console.log(values)

        try {
            if (!id) throw new Error("Phone ID is missing.");

            const response = await fetch(`http://localhost:5000/phones/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                throw new Error(`Failed to update phone: ${response.statusText}`);
            }

            setReload(prev => prev + 1);
            setIsEditing(false);
            dispatch(setPhonesUpdated(true));
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            console.error("Error saving phone data:", error);
        }
    };

    const handleSubMitReview = async () => {
        const values = await formReview.validateFields();
        if (values.description['currentTarget']) {
            values.description = values.description['currentTarget'].value

        }
        const payload = {
            ...values,
            phoneId: Number(id),  // make sure id is a number
            uid: "user123",       // replace with actual user ID from context/auth
        };

        try {
            if (!id) throw new Error("Phone ID is missing.");

            const response = await fetch(`http://localhost:5000/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`Failed to update phone: ${response.statusText}`);
            }

            setReload(prev => prev + 1);
            setIsEditing(false);
            dispatch(setPhonesUpdated(true));
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            console.error("Error saving phone data:", error);
        }
    }


    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Info.',
            children:
                <Flex gap="large" vertical={true} >
                    <Flex gap="middle" justify="center" align="center" vertical={false} >
                        <Image
                            width={400}
                            preview={{
                                destroyOnHidden: true,
                                imageRender: () => (
                                    <iframe
                                        width="100%"
                                        height="1167"
                                        src="https://assets.pinterest.com/ext/embed.html?id=254875660155238616"

                                    />
                                ),
                                toolbarRender: () => null,
                            }}
                            src="https://i.pinimg.com/736x/51/78/bd/5178bde9c0aae54875cd6ed0ade23cfe.jpg"
                        />
                    </Flex>

                    <Flex gap="middle" justify="center" align="center" vertical={false} >
                        <Statistic
                            title="Price"
                            value={phoneDetail.price}
                            precision={2}
                        />
                        <Statistic
                            value={Math.abs(diff)}
                            precision={2}
                            valueStyle={{ color: isUp ? '#3f8600' : '#cf1322' }}
                            prefix={isUp ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                            suffix="%"
                        />
                    </Flex>

                    <Flex gap="middle" justify="space-between" align="center" vertical={false} >
                        <Title level={3} style={{ margin: 0 }}>Phone Information</Title>
                        {!isEditing && (
                            <Button icon={<EditOutlined />} onClick={handleEdit}>
                                Edit
                            </Button>
                        )}
                    </Flex>









                    {isEditing ? (
                        <Form form={form} style={{ maxWidth: 600 }} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} layout="horizontal" >
                            <Form.Item name="price" label="Price" valuePropName="price" rules={[{ type: 'number', min: 0 }]} >
                                <InputNumber style={{ width: '100%' }} defaultValue={editRecord.price} />
                            </Form.Item>
                            <Form.Item name="inStock" label="Stock" valuePropName="inStock">
                                <Switch checkedChildren="In Stock" unCheckedChildren="Out of Stock" defaultChecked={editRecord.inStock} />
                            </Form.Item>
                            <Form.Item name="description" label="Description" valuePropName="description" >
                                <Input.TextArea rows={4} defaultValue={editRecord.description} />
                            </Form.Item>
                            <Space >
                                <Button type="primary" onClick={handleSave} style={{ marginRight: 8 }}>Save</Button>
                                <Button onClick={handleCancel}>Cancel</Button>
                            </Space>
                        </Form>
                    ) : (
                        <div>
                            <Descriptions bordered column={1} size="middle">
                                <Descriptions.Item label="Name">{phoneDetail.phoneName}</Descriptions.Item>
                                <Descriptions.Item label="brand">{phoneDetail.brand}</Descriptions.Item>
                                <Descriptions.Item label="camera">{phoneDetail.camera}</Descriptions.Item>
                                <Descriptions.Item label="os">{phoneDetail.os}</Descriptions.Item>
                                <Descriptions.Item label="price">{phoneDetail.price}</Descriptions.Item>
                                <Descriptions.Item label="launch Price">{phoneDetail.launchPrice}</Descriptions.Item>
                                <Descriptions.Item label="ram">{phoneDetail.ram}</Descriptions.Item>
                                <Descriptions.Item label="releaseYear">{phoneDetail.releaseYear}</Descriptions.Item>
                                <Descriptions.Item label="screenSize">{phoneDetail.screenSize}</Descriptions.Item>
                                <Descriptions.Item label="storage">{phoneDetail.storage}</Descriptions.Item>
                                <Descriptions.Item label="Rating">
                                    <Rate disabled value={phoneDetail.rating} />
                                </Descriptions.Item>
                            </Descriptions>
                            <p>{phoneDetail.description}</p>
                        </div>
                    )}

                </Flex>
        },
        {
            key: '2',
            label: 'Reviews',
            children:
                <Flex gap="large" vertical={true} >
                    <Flex vertical={true} >
                        <Title level={5}>Reviews({phoneReviws.length})</Title>
                        <List
                            itemLayout="vertical" pagination={{
                                onChange: (page) => {
                                    console.log(page);
                                },
                                pageSize: 3,
                            }}
                            dataSource={phoneReviws}
                            renderItem={(item, index) => (
                                <List.Item>
                                    <Card
                                        size="small"
                                        style={{
                                            marginBottom: 10,
                                            borderRadius: 8,
                                            background: "#fafafa",
                                        }}
                                    >
                                        <Space direction="vertical" style={{ width: "100%" }}>
                                            <Text strong>User ID:</Text> {item.uid}
                                            <Rate disabled defaultValue={item.rating} />
                                            <Text>{item.description}</Text>
                                            <Text type="secondary" style={{ fontSize: 12 }}>
                                            </Text>
                                        </Space>
                                    </Card>
                                </List.Item>
                            )}
                        />

                    </Flex>

                    <Flex vertical={true} >
                        <Title level={5}>Add a Review</Title>
                        <Form
                            form={formReview}
                            layout="vertical"
                            style={{ marginTop: 10 }}
                        >

                            <Form.Item
                                label="Rating"
                                name="rating" valuePropName="rating"
                                rules={[{ required: true, message: "Please select a rating" }]}
                            >
                                <Rate defaultValue={reviewForm.rating} />
                            </Form.Item>

                            <Form.Item
                                label="Review Description"
                                name="description" valuePropName="description"
                                rules={[{ required: true, message: "Please enter your review" }]}
                            >
                                <TextArea rows={3} defaultValue={reviewForm.description} placeholder="Share your thoughts..." />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" onClick={handleSubMitReview} block>
                                    Submit Review
                                </Button>
                            </Form.Item>
                        </Form>
                    </Flex>

                </Flex>
        },

    ];

    const handleCloseClick = () => {
        navigate(`/`);
        dispatch(setClosePage())

    };


    return (
        <Layout style={{ minHeight: '90vh' }}  >

            <Header style={{ background: colorBgContainer }}>
                <Flex gap="middle" justify="space-between" vertical={false} >
                    <Space>
                        <Title level={3} style={{ margin: 0 }}>{phoneDetail.phoneName}</Title>
                        <Badge status={phoneDetail.inStock ? "success" : "error"} text={phoneDetail.inStock ? "In Stock" : "Out of Stock"} />
                    </Space>
                    <Space>
                        <Button icon={<FullscreenOutlined />} onClick={() => dispatch(setFullPage())}></Button>
                        <Button icon={<FullscreenExitOutlined />} onClick={() => dispatch(resetDefault())}></Button>
                        <Button icon={<CloseOutlined />} onClick={() => handleCloseClick()}></Button>
                    </Space>

                </Flex>


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
                        <Tabs activeKey={TabID} items={items} onChange={onChange} />

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
