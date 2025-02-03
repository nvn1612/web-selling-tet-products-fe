import React, { useState } from 'react';
import { AppstoreOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent';
import AdminUser from '../../components/AdminUser/AdminUser';
import AdminProduct from '../../components/AdminProduct/AdminProduct';
import OrderAdmin from '../../components/OrderAdmin/OrderAdmin';

const items = [
    {
      key: 'user',
      label: 'Nguời dùng',
      icon: <UserOutlined />,
     
    },
    {
      key: 'product',
      label: 'Sản phẩm',
      icon: <AppstoreOutlined />,
    
    },
    {
      key: 'order',
      label: 'Đơn hàng',
      icon: <ShoppingCartOutlined />,
    
    },
  ];


  const renderPage = (key) => {
    switch(key) {
      case 'user': 
        return (
          <AdminUser/>
        )
      case 'product': 
        return (
          <AdminProduct/>
        )
        case 'order': 
        return (
          <OrderAdmin/>
        )
        default:
          return <></>
    }

  }

const AdminPage = () => {

      const [current, setCurrent] = useState('');
      const onClick = (e) => {
        setCurrent(e.key);
      };
  

  return (
    <>
        <HeaderComponent isHiddenCart isHiddenSearch/>
        <div style={{display: 'flex'}}>
            <Menu
            onClick={onClick}
            style={{
                width: 256,
                height: '100vh',
                boxShadow: '1px 1px 2px #ccc'

            }}
            defaultOpenKeys={['sub1']}
            selectedKeys={[current]}
            mode="inline"
            items={items}
            />
            <div style={{flex: 1, padding: '15px'}}>
              {renderPage(current)} 
            </div>
        </div>
  </>
  )
}

export default AdminPage