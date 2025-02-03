import React, { useEffect, useRef, useState } from 'react'
import { WrapperHeader, WrapperUploadFile } from './style'
import { Button, Checkbox, Form, Modal,Space } from 'antd'
import TableComponent from '../TableComponent/TableComponent'
import InputComponent from '../InputComponent/InputComponent'
import ModalComponent from '../ModalComponent/ModalComponent'
import Loading from '../LoadingComponent/LoadingComponent'
import DrawerComponent from '../DrawerComponent/DrawerComponent'
import { getBase64 } from '../../ultis'
import * as message from "../../components/Message/Message"
import {useQuery } from '@tanstack/react-query'
import {useSelector} from 'react-redux'
import { useMutationHooks } from '../../hooks/useMutationHook'
import * as UserService from "../../service/UserService"
import { EditOutlined, DeleteOutlined,SearchOutlined,UploadOutlined} from '@ant-design/icons'


const AdminUser = () => {
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);
    const [isLoadingUpdate,SetIsLoadingUpdate] = useState(false);
    const [isModalOpenDelete,setIsModalOpenDelete] = useState(false);
  
    //search
   
    const searchInput = useRef(null);
  
    const [rowSelected, setRowSelected] = useState('')
  
    const [stateUserDetail, setStateUserDetail] = useState({
        name: '',
        email: '',
        phone: '',
        isAdmin: false,
        avatar: '',
        address:''
      
  })
    const user = useSelector((state)=>state?.user)
    const [form] = Form.useForm();
  
    const renderAction = () => {
      return (
        <>
          <DeleteOutlined  style={{fontSize: '20px', color: 'red', cursor:'pointer'}} onClick={()=>setIsModalOpenDelete(true)}/>
          <EditOutlined style={{fontSize: '20px', color: 'orange', cursor:'pointer'}}  onClick={handleDetailUser}/>
        </>
      )
    }
  
    const fetchDetailUser = async(rowSelected) =>{
      
      const res = await UserService.getDetailUser(rowSelected)
      if(res?.data) {
        setStateUserDetail({
          name: res?.data.name,
          email: res?.data.email,
          phone: res?.data.phone,
          isAdmin: res?.data.isAdmin,
          address: res?.data.address,
          avatar: res?.data.avatar
        })
      }
      SetIsLoadingUpdate(false)
    } 
    
  
    useEffect(() =>{
      form.setFieldsValue(stateUserDetail)
    },[form, stateUserDetail])
  
    useEffect(()=>{
      if(rowSelected && isOpenDrawer)
        {
          SetIsLoadingUpdate(true)
          fetchDetailUser(rowSelected)
        }
    },[rowSelected,isOpenDrawer])
  
    const handleDetailUser = () =>{
        setIsOpenDrawer(true)
    }
 

    
    const handleCloseDrawer = () => {
      setIsOpenDrawer(false);
      setStateUserDetail({
        name: '',
        email: '',
        phone: '',
        isAdmin: false
      })
      form.resetFields();
  
    };
    
    const handleOnChangeDetail = (e) =>{
      setStateUserDetail({
        ...stateUserDetail,
        [e.target.name]: e.target.value
      })
    }
  
    const handleOnchangeAvatarDetail = async({fileList}) =>{
      const file = fileList[0]
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      setStateUserDetail({
        ...stateUserDetail,
        avatar: file.preview
      })
  
    }
    
    
      const mutationUpdateUser = useMutationHooks(
        (data) => {
          const {  id,
            token,
           ...rests} = data
            const res = UserService.updateUser(
              id,
              {...rests},
              token
              
            )
            return res
          }
        )
  
        const {data: dataUpdated, isPending: isPendingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated} = mutationUpdateUser
  
        const onUpdateUser = () =>{
           mutationUpdateUser.mutate({id: rowSelected,token: user?.access_token, ...stateUserDetail },{
            onSettled: () => {
              queryUser.refetch()
            }
           })
        }
  
      const getAllUsers = async() =>{
        const res = await UserService.getAllUser(user?.access_token)
        return res
      } 
  
      const queryUser = useQuery({queryKey: ['user'],queryFn: getAllUsers})
      const {data: users, isPending: isPendingUser} = queryUser
  
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
              ref={searchInput}
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
                onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                icon={<SearchOutlined />}
                size="small"
                style={{
                  width: 90,
                }}
              >
                Search
              </Button>
              <Button
                onClick={() => clearFilters && handleReset(clearFilters)}
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
              setTimeout(() => searchInput.current?.select(), 100);
            }
          },
        },
      });
  
      const columns = [
        {
          title: 'Name',
          dataIndex: 'name',
         sorter: (a,b) => a.name.length - b.name.length,
         ...getColumnSearchProps('name')
        },
        {
            title: 'Email',
            dataIndex: 'email',
           sorter: (a,b) => a.email.length - b.email.length,
           ...getColumnSearchProps('email')
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
          title: 'IsAdmin',
          dataIndex: 'isAdmin',
          sorter: (a,b) => a.email - b.email,
          filters: [
            {
              text: 'True',
              value: true
            },
            {
              text: 'False',
              value: false
            }
          ],
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: renderAction
          },
      ];
      const dataTable = users?.data?.length && users?.data?.map((user) => {
        return {...user, key: user._id, isAdmin: user.isAdmin ? 'TRUE' : 'FALSE'}
      })
    
      
      useEffect(() => {
        if(isSuccessUpdated && dataUpdated.status ==='OK') {
          message.success()
          handleCloseDrawer()
        }else if (isErrorUpdated) {
          message.error()
        }
      }, [isSuccessUpdated, isErrorUpdated])
  
  
    
  
      //delete User
  
      const handleCancelDelete = () =>{
        setIsModalOpenDelete(false)
      }
  
      const handleDeleteUser = () => {
        mutationDeleteUser.mutate({id: rowSelected,token: user?.access_token},{
          onSettled: () => {
            queryUser.refetch()
          }
         })
      }
  
      const mutationDeleteUser = useMutationHooks(
        (data) => {
          const { id, token} = data
          const res = UserService.deleteUser(id, token)
          return res
        }
      )
      const {data: dataDelete, isPending: isPendingDelete, isSuccess: isSuccessDelete, isError: isErrorDelete} = mutationDeleteUser
  
      useEffect(() => {
        if(isSuccessDelete && dataDelete.status ==='OK') {
          message.success()
          handleCancelDelete()
        }else if (isErrorDelete) {
          message.error()
        }
      }, [isSuccessDelete, isErrorDelete])

       //delete many

    const mutationDeleteManyUser = useMutationHooks(
      (data) => {
        const {token, ids} = data
        const res = UserService.deleteManyUser(token,ids)
        return res
      }
    )


    const handleDeleteManyUser = (_ids) =>{
      mutationDeleteManyUser.mutate({token: user?.access_token, ids: _ids},{
        onSettled: () => {
          queryUser.refetch()
        }
       })
    }

    const {data: dataDeleteMany, isPending: isPendingDeleteMany, isSuccess: isSuccessDeleteMany, isError: isErrorDeleteMany} = mutationDeleteManyUser


    useEffect(() => {
      if(isSuccessDeleteMany && dataDeleteMany.status ==='OK') {
        message.success()
      }else if (isErrorDeleteMany) {
        message.error()
      }
    }, [isSuccessDeleteMany, isErrorDeleteMany])

  
  return (
    <div>
        <WrapperHeader>
            Quản lý người dùng
        </WrapperHeader>
        <div style={{marginTop: '20px'}}>
            <TableComponent data={dataTable} isPending={isPendingUser} columns={columns}
             onRow={(record, rowIndex) => {
              return {
                onClick: (event) => {
                  setRowSelected(record._id)
                },
              
              };
            }}
            handleDeleteMany={handleDeleteManyUser}

            />
        </div>
       

        <DrawerComponent title='Chi tiết sản phẩm' onClose={() => setIsOpenDrawer(false)} isOpen={isOpenDrawer} width="90%">
          <Loading isLoading={isLoadingUpdate||isPendingUpdated}>
            <Form
                form={form}
                name="basic"
                labelCol={{
                span: 6,
                }}
                wrapperCol={{
                span: 25,
                }}
                style={{
                maxWidth: 600,
                }}
                
                onFinish={onUpdateUser}
                autoComplete="off"
               
            >
                <Form.Item
                label="Name"
                name="name"
                rules={[
                    {
                    required: true,
                    message: 'Please input your name!',
                    },
                ]}
                >
                <InputComponent value={stateUserDetail.name} onChange={handleOnChangeDetail} name='name' />
                </Form.Item>

                <Form.Item
                label="Email"
                name="email"
                rules={[
                    {
                    required: true,
                    message: 'Please input your email!',
                    },
                ]}
                >
                <InputComponent value={stateUserDetail.email} onChange={handleOnChangeDetail} name='email'/>

                </Form.Item>
                <Form.Item
                label="Phone"
                name="phone"
                rules={[
                    {
                    required: true,
                    message: 'Please input your phone!',
                    },
                ]}
                >
                <InputComponent value={stateUserDetail.phone} onChange={handleOnChangeDetail} name='phone'/>
                </Form.Item>

                <Form.Item
                label="Address"
                name="address"
                rules={[
                    {
                    required: true,
                    message: 'Please input your address!',
                    },
                ]}
                >
                <InputComponent value={stateUserDetail.address} onChange={handleOnChangeDetail} name='address'/>
                </Form.Item>

                <Form.Item
                label="Avatar"
                name="avatar"
                rules={[
                    {
                    required: true,
                    message: 'Please input your avatar!',
                    },
                ]}
                >
                <WrapperUploadFile onChange={handleOnchangeAvatarDetail} maxCount={1}>
                  <Button icon={<UploadOutlined/>}>
                  </Button>
                {stateUserDetail?.avatar &&(
                  <img src={stateUserDetail?.avatar} 
                  style={{height: '60px',
                    width: '60px',
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }} alt="image"/>
                )}
               </WrapperUploadFile>
              
                </Form.Item>


                <Form.Item label={null} wrapperCol={{offset: 20, span: 16}}>
                  <Button type="primary" htmlType="submit">
                      Apply
                  </Button>
                </Form.Item>
            </Form>
          </Loading>
        </DrawerComponent>

        <ModalComponent  title="Xóa người dùng" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteUser} >  
          <Loading isLoading={isPendingDelete}>
                <div>Bạn có chắc chắn muốn xóa tài khoản này không ?</div>
          </Loading>
          
        </ModalComponent>
    </div>
  )
}

export default AdminUser