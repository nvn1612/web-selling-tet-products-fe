import React, {useState } from 'react'
import { WrapperHeader } from './style'
import { Button,Space } from 'antd'
import TableComponent from '../TableComponent/TableComponent'
import InputComponent from '../InputComponent/InputComponent'
import {useQuery } from '@tanstack/react-query'
import {useSelector} from 'react-redux'
import * as OrderService from "../../service/OrderService"
import { SearchOutlined} from '@ant-design/icons'
import { orderConstants } from "../../constants";
import PieChartComponent from './PieChartComponent'
import { convertPrice } from '../../ultis'



const OrderAdmin = () => {
    const [rowSelected, setRowSelected] = useState('')
    const user = useSelector((state)=>state?.user)

    const getAllOrders = async() =>{
        const res = await OrderService.getAllOrder(user?.access_token)
        return res
      } 
  
      const queryOrder = useQuery({queryKey: ['order'],queryFn: getAllOrders})
      const {data: orders, isPending: isPendingOrder} = queryOrder
      console.log("a", orders )

      //search
  
      const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
      };
  
      const handleReset = (clearFilters) => {
        clearFilters();
      };
  
      const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
          <div
            style={{
              padding: 8,
            }}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <InputComponent
              // ref={searchInput}
              placeholder={`Search ${dataIndex}`}
              value={selectedKeys[0]}
              onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
              style={{
                marginBottom: 8,
                display: 'block',
              }}
            />
            <Space>
              <Button
                type="primary"
                // onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                icon={<SearchOutlined />}
                size="small"
                style={{
                  width: 90,
                }}
              >
                Search
              </Button>
              <Button
                // onClick={() => clearFilters && handleReset(clearFilters)}
                size="small"
                style={{
                  width: 90,
                }}
              >
                Reset
              </Button>
            </Space>
          </div>
        ),
        filterIcon: (filtered) => (
          <SearchOutlined
            style={{
              color: filtered ? '#1677ff' : undefined,
            }}
          />
        ),
        onFilter: (value, record) =>
          record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        filterDropdownProps: {
          onOpenChange(open) {
            if (open) {
              // setTimeout(() => searchInput.current?.select(), 100);
            }
          },
        },
      });
  
      const columns = [
        {
          title: 'User Name',
          dataIndex: 'userName',
         sorter: (a,b) => a.userName.length - b.userName.length,
         ...getColumnSearchProps('userName')
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
           sorter: (a,b) => a.phone.length - b.phone.length,
           ...getColumnSearchProps('phone')
          },
          {
            title: 'Address',
            dataIndex: 'address',
           sorter: (a,b) => a.address.length - b.address.length,
           ...getColumnSearchProps('address')
          },
          {
            title: 'Paided',
            dataIndex: 'isPaid',
            sorter: (a,b) => a.isPaid.length - b.isPaid.length,
            ...getColumnSearchProps('isPaid')
          },
          {
            title: 'Shipped',
            dataIndex: 'isDelivered',
           sorter: (a,b) => a.isDelivered.length - b.isDelivered.length,
           ...getColumnSearchProps('isDelivered')
          },
          {
            title: 'Payment menthod',
            dataIndex: 'paymentMenthod',
            sorter: (a,b) => a.paymentMenthod.length - b.paymentMenthod.length,
           ...getColumnSearchProps('paymentMenthod')
          },
          {
            title: 'Total Price',
            dataIndex: 'totalPrice',
           sorter: (a,b) => a.totalPrice.length - b.totalPrice.length,
           ...getColumnSearchProps('totalPrice')
          },
      ];
      const dataTable = orders?.data?.length && orders?.data?.map((order) => {
        return {...order, key: order._id, userName: order?.shippingAddress?.fullName, phone: order?.shippingAddress?.phone, address: order?.shippingAddress?.address
          ,paymentMenthod: orderConstants.payment[order?.paymentMethod], isPaid: order?.isPaid ? 'TRUE' : 'FALSE', isDelivered: order?.isDelivered ? 'TRUE' : 'FALSE',
          totalPrice: convertPrice(order?.totalPrice)
        }
      })
      console.log("data", orders?.data)
      return (
    <div>
        <WrapperHeader>
            Quản lý người dùng
        </WrapperHeader>
        <div style={{height:200, width:200}}>
          <PieChartComponent data={orders?.data}/>
        </div>
        <div style={{marginTop: '20px'}}>
            <TableComponent data={dataTable} isPending={isPendingOrder} columns={columns} />
        </div>
    </div>
  )
}

export default OrderAdmin