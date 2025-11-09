import React, { useEffect, useState, useRef } from "react";
import { Typography, Avatar, List, message, Badge, Flex, Button, Segmented, Table, Input, Space, Rate } from "antd";
import { usePhones, Phone } from "../model/PhoneContext";
import { SearchOutlined } from '@ant-design/icons';
import VirtualList from 'rc-virtual-list';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import type { InputRef, TableColumnsType, TableColumnType } from 'antd';
import Highlighter from 'react-highlight-words';

import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";

type DataIndex = keyof Phone;

const FirstPage: React.FC = () => {
    const { phones } = usePhones();

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);

    const handleSearch = (
        selectedKeys: string[],
        confirm: FilterDropdownProps['confirm'],
        dataIndex: DataIndex,
    ) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters: () => void) => {
        clearFilters();
        setSearchText('');
    };


    const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<Phone> => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({ closeDropdown: false });
                            setSearchText((selectedKeys as string[])[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes((value as string).toLowerCase()),
        filterDropdownProps: {
            onOpenChange(open) {
                if (open) {
                    setTimeout(() => searchInput.current?.select(), 100);
                }
            },
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });
    const navigate = useNavigate();
//    const handleNavigate = (path: string) => navigate(path);

    const handleCellClick = (record: Phone, columnKey: string) => {
        
         navigate(`/detail/${record.id}`, { state: record });

    };


    const columns: TableColumnsType<Phone> = [
        {
            title: 'Phone Name',
            dataIndex: 'phoneName',
            key: 'phoneName',
            width: '30%',
            fixed: 'left',
            onCell: (record: Phone) => ({
                onClick: () => handleCellClick(record, "name"),
            }),
            ...getColumnSearchProps('phoneName'),
        },
        {
            title: 'Stock Available',
            dataIndex: 'inStock',
            key: 'inStock',
            ...getColumnSearchProps('inStock'),
            render: (inStock) => {
                return <Badge
                    status={inStock ? "success" : "error"}

                    text={inStock ? "In Stock" : "Out of Stock"}
                />
            },

        },
        {
            title: 'Rating',
            dataIndex: 'rating',
            key: 'rating',
            ...getColumnSearchProps('rating'),
            sorter: (a, b) => a.rating - b.rating,
            sortDirections: ['descend', 'ascend'],
            render: (Rating) => {
                return <Rate disabled value={Rating} />
            },

        },
    ];




    return (
        <Table<Phone> columns={columns} dataSource={phones} pagination={false} scroll={{ x: 'max-content' }} />
        // <List>
        //     <VirtualList
        //         data={phones}
        //         itemKey="email"
        //     >
        //         {(item: Phone) => (
        //             <List.Item key={item.id}>
        //                 <List.Item.Meta
        //                     //  avatar={<a >{item.phoneName}</a>}
        //                     title={

        //                         <a >{item.phoneName}</a>
        //                         //     <Flex gap="middle" align="start" vertical >
        //                         //     <Flex justify="space-between" align="center" >
        //                         //         <a>{item.phoneName}</a>
        //                         //         <Badge status={item.inStock ? "success" : "error"} text={item.inStock ? "In Stock" : "Out of Stock"} />
        //                         //     </Flex>
        //                         // </Flex>

        //                     }
        //                     description={item.rating}

        //                 />
        //                 <Badge status={item.inStock ? "success" : "error"} text={item.inStock ? "In Stock" : "Out of Stock"} />
        //             </List.Item>
        //         )}
        //     </VirtualList>
        // </List>

    );
};

export default FirstPage;