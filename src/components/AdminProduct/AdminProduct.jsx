import React, { useEffect, useRef, useState } from 'react'
import { WrapperHeader } from './style'
import { Button, Form,  Select,  Space } from 'antd'
import {PlusOutlined,UploadOutlined, EditOutlined, DeleteOutlined,SearchOutlined} from '@ant-design/icons'
import TableComponent from '../TableComponent/TableComponent'
import InputComponent from '../InputComponent/InputComponent'
import { WrapperUploadFile } from './style'
import { getBase64, renderOptions } from '../../ultis'
import { useMutationHooks } from '../../hooks/useMutationHook'
import Loading from '../../components/LoadingComponent/LoadingComponent'
import * as ProductService from "../../service/ProductService"
import * as message from "../../components/Message/Message"
import {useQuery } from '@tanstack/react-query'
import DrawerComponent from '../DrawerComponent/DrawerComponent'
import {useSelector} from 'react-redux'
import ModalComponent from '../ModalComponent/ModalComponent'

const AdminProduct = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isLoadingUpdate,SetIsLoadingUpdate] = useState(false);
  const [isModalOpenDelete,setIsModalOpenDelete] = useState(false);
  const [typeSelect,setTypeSelect] = useState('')

  //search
 
  const searchInput = useRef(null);

  const [rowSelected, setRowSelected] = useState('')
  const [stateProduct, setStateProduct] = useState({
      name: '',
      image: '',
      price: '',
      countInStock: '',
      type: '',
      rating: '',
      description: '',
      newType: '',
      discount: '' 
      
  })
  const [stateProductDetail, setStateProductDetail] = useState({
    name: '',
    image: '',
    price: '',
    countInStock: '',
    type: '',
    rating: '',
    description: '',
    discount: ''    
})
  const user = useSelector((state)=>state?.user)
  const [form] = Form.useForm();

  const renderAction = () => {
    return (
      <>
        <DeleteOutlined  style={{fontSize: '20px', color: 'red', cursor:'pointer'}} onClick={()=>setIsModalOpenDelete(true)}/>
        <EditOutlined style={{fontSize: '20px', color: 'orange', cursor:'pointer'}}  onClick={handleDetailProduct}/>
      </>
    )
  }

  const fetchDetailProduct = async(rowSelected) =>{
    
    const res = await ProductService.getDetailProduct(rowSelected)
    if(res?.data) {
      setStateProductDetail({
        name: res?.data.name,
        image: res?.data.image,
        price: res?.data.price,
        countInStock: res?.data.countInStock,
        type: res?.data.type,
        rating: res?.data.rating,
        description: res?.data.description,
        discount: res?.data.discount
      })
    }
    SetIsLoadingUpdate(false)
  } 
  

  useEffect(() =>{
    form.setFieldsValue(stateProductDetail)
  },[form, stateProductDetail])

  useEffect(()=>{
    if(rowSelected && isOpenDrawer)
      {
        SetIsLoadingUpdate(true)
        fetchDetailProduct(rowSelected)
      }
  },[rowSelected, isOpenDrawer])

  const handleDetailProduct = () =>{
      setIsOpenDrawer(true)
  }
  const showModal = () => {
    setIsModalOpen(true);
  };
  
  const handleCancel = () => {
    setIsModalOpen(false);
    setStateProduct({
      name: '',
      image: '',
      price: '',
      countInStock: '',
      type: '',
      rating: '',
      description: '',
      discount: ''
    })
    form.resetFields();
  };
  
  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
    setStateProductDetail({
      name: '',
      image: '',
      price: '',
      countInStock: '',
      type: '',
      rating: '',
      description: ''
    })
    form.resetFields();

  };
  

  const handleOnChange = (e) =>{
    setStateProduct({
      ...stateProduct,
      [e.target.name]: e.target.value
    })
  }

  const handleOnChangeDetail = (e) =>{
    setStateProductDetail({
      ...stateProductDetail,
      [e.target.name]: e.target.value
    })
  }

  const handleOnchangeAvatar = async({fileList}) =>{
    const file = fileList[0]
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateProduct({
      ...stateProduct,
      image: file.preview
    })
  }
  const handleOnchangeAvatarDetail = async({fileList}) =>{
    const file = fileList[0]
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateProductDetail({
      ...stateProductDetail,
      image: file.preview
    })

  }
  
  const mutation = useMutationHooks(
    (data) => {
      const {  name,
        image,
        price,
        countInStock,
        type,
        rating,
        description,
        discount } = data
        const res = ProductService.createProduct({
          name,
          image,
          price,
          countInStock,
          type,
          rating,
          description,
          discount
        })
        return res
      }
    )

    const mutationUpdateProduct = useMutationHooks(
      (data) => {
        const {  id,
          token,
         ...rests} = data
          const res = ProductService.updateProduct(
            id,
            token,
            {...rests}
          )
          return res
        }
      )

      const {data: dataUpdated, isPending: isPendingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated} = mutationUpdateProduct

      const onUpdateProduct = () =>{
         mutationUpdateProduct.mutate({id: rowSelected,token: user?.access_token, ...stateProductDetail },{
          onSettled: () => {
            queryProduct.refetch()
          }
         })
      }

    const getAllProduct = async() =>{
      const res = await ProductService.getAllProduct()
      return res
    } 

    const queryProduct = useQuery({queryKey: ['product'],queryFn: getAllProduct})
    const {data: products, isPending: isPendingProduct} = queryProduct

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
      // render: (text) =>
      //   searchedColumn === dataIndex ? (
      //     <Highlighter
      //       highlightStyle={{
      //         backgroundColor: '#ffc069',
      //         padding: 0,
      //       }}
      //       searchWords={[searchText]}
      //       autoEscape
      //       textToHighlight={text ? text.toString() : ''}
      //     />
      //   ) : (
      //     text
      //   ),
    });

    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
       sorter: (a,b) => a.name.length - b.name.length,
       ...getColumnSearchProps('name')
      },
      {
        title: 'Price',
        dataIndex: 'price',
        sorter: (a,b) => a.price - b.price,
        filters: [
          {
            text: '>=50',
            value: '>='
          },
          {
            text: '<=50',
            value: '<='
          }
        ],
        onFilter: (value, record) =>{
          if(value==='>='){
            return record.price >= 50
          }
          return record.price <= 50
        }
      },
      {
        title: 'Rating',
        dataIndex: 'rating',
        sorter: (a,b) => a.rating - b.rating,
        filters: [
          {
            text: '>=3',
            value: '>='
          },
          {
            text: '<=3',
            value: '<='
          }
        ],
        onFilter: (value, record) =>{
          if(value==='>='){
            return record.rating >= 3
          }
          return record.rating <= 3
        }
      },
      {
        title: 'Action',
        dataIndex: 'action',
        render: renderAction
      },
    ];
    const dataTable = products?.data?.length && products?.data?.map((product) => {
      return {...product, key: product._id}
    })
  
    const {data, isPending, isSuccess, isError} = mutation
    
     useEffect(() => {
      if(isSuccess && data.status ==='OK') {
        message.success()
        handleCancel()
      }else if (isError) {
        message.error()
      }
    }, [isSuccess, isError])

    useEffect(() => {
      if(isSuccessUpdated && dataUpdated.status ==='OK') {
        message.success()
        handleCloseDrawer()
      }else if (isErrorUpdated) {
        message.error()
      }
    }, [isSuccessUpdated, isErrorUpdated])


    const onFinish = () => {
      const params = {
        name: stateProduct.name,
        image: stateProduct.image,
        price: stateProduct.price,
        countInStock: stateProduct.countInStock,
        type: stateProduct.type === 'add_type' ? stateProduct.newType : stateProduct.type,
        rating: stateProduct.rating,
        description: stateProduct.description,
        discount: stateProduct.discount
      }
      mutation.mutate(params,{
        onSettled: () => {
          queryProduct.refetch()
        }
      })
      
    };

    //delete product

    const handleCancelDelete = () =>{
      setIsModalOpenDelete(false)
    }

    const handleDeleteProduct = () => {
      mutationDeleteProduct.mutate({id: rowSelected,token: user?.access_token},{
        onSettled: () => {
          queryProduct.refetch()
        }
       })
    }

    const mutationDeleteProduct = useMutationHooks(
      (data) => {
        const { id, token} = data
        const res = ProductService.deleteProduct(id, token)
        return res
      }
    )
    const {data: dataDelete, isPending: isPendingDelete, isSuccess: isSuccessDelete, isError: isErrorDelete} = mutationDeleteProduct

    useEffect(() => {
      if(isSuccessDelete && dataDelete.status ==='OK') {
        message.success()
        handleCancelDelete()
      }else if (isErrorDelete) {
        message.error()
      }
    }, [isSuccessDelete, isErrorDelete])

    //delete many

    const mutationDeleteManyProduct = useMutationHooks(
      (data) => {
        const {token, ids} = data
        const res = ProductService.deleteManyProduct(token,ids)
        return res
      }
    )


    const handleDeleteManyProduct = (_ids) =>{
      mutationDeleteManyProduct.mutate({token: user?.access_token, ids: _ids},{
        onSettled: () => {
          queryProduct.refetch()
        }
       })
    }

    const {data: dataDeleteMany, isPending: isPendingDeleteMany, isSuccess: isSuccessDeleteMany, isError: isErrorDeleteMany} = mutationDeleteManyProduct


    useEffect(() => {
      if(isSuccessDeleteMany && dataDeleteMany.status ==='OK') {
        message.success()
      }else if (isErrorDeleteMany) {
        message.error()
      }
    }, [isSuccessDeleteMany, isErrorDeleteMany])

    //get type

    const fetchTypeProduct = async () =>{
      const res = await ProductService.getAllType()
      return res
    }

    const typeProduct = useQuery({queryKey: ['type-product'],queryFn: fetchTypeProduct})

    // type select 
    const onChangeSelect = (value) =>{
          setStateProduct({
            ...stateProduct,
            type: value
    
          })
      

    }
   


  return (
    <div>
        <WrapperHeader>
            Quản lý sản phẩm 
        </WrapperHeader>
        <div style={{marginTop: '10px'}}>
            <Button style={{height: '150px', width: '150px', borderRadius:'6px', borderStyle:'dashed'}} onClick={showModal}>
                <PlusOutlined style={{fontSize: '60px'}}/>
            </Button>
        </div>
        <div style={{marginTop: '20px'}}>
            <TableComponent data={dataTable} isPending={isPendingProduct} columns={columns}
             onRow={(record, rowIndex) => {
              return {
                onClick: (event) => {
                  setRowSelected(record._id)
                },
              
              };
            }}
            handleDeleteMany={handleDeleteManyProduct}
            />
        </div>
        <ModalComponent forceRender title="Tạo sản phẩm" open={isModalOpen} onCancel={handleCancel} footer={null}>  
          <Loading isLoading={isPending}>
            <Form
                // form={form}
                name="basic"
                labelCol={{
                span: 6,
                }}
                wrapperCol={{
                span: 18,
                }}
                style={{
                maxWidth: 600,
                }}
                
                onFinish={onFinish}
                autoComplete="off"
                // form={form}
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
                <InputComponent value={stateProduct.name} onChange={handleOnChange} name='name' />
                </Form.Item>

                <Form.Item
                label="Description"
                name="description"
                rules={[
                    {
                    required: true,
                    message: 'Please input your description!',
                    },
                ]}
                >
                <InputComponent value={stateProduct.description} onChange={handleOnChange} name='description'/>

                </Form.Item>
                <Form.Item
                label="Type"
                name="type"
                rules={[
                    {
                    required: true,
                    message: 'Please input your type!',
                    },
                ]}
                >
                <Select
                  name='type'
                  value={stateProduct.type}
                  style={{ width: 120 }}
                  onChange={onChangeSelect}
                  options={renderOptions(typeProduct?.data?.data)}
                  />

                </Form.Item>
                {stateProduct.type === 'add_type' && (

                  <Form.Item
                  label="New Type"
                  name="new-type"
                  rules={[
                      {
                      required: true,
                      message: 'Please input your type!',
                      },
                  ]}
                  >
                      <InputComponent value={stateProduct.newType} onChange={handleOnChange} name='newType'/>
                  </Form.Item>
                )}

                <Form.Item
                label="Price"
                name="price"
                rules={[
                    {
                    required: true,
                    message: 'Please input your price!',
                    },
                ]}
                >
                <InputComponent  value={stateProduct.price} onChange={handleOnChange} name='price'/>
                </Form.Item>

                <Form.Item
                label="CountInStock"
                name="countInStock"
                rules={[
                    {
                    required: true,
                    message: 'Please input your countInStock!',
                    },
                ]}
                >
                <InputComponent value={stateProduct.countInStock} onChange={handleOnChange} name='countInStock'/>
                </Form.Item>

                <Form.Item
                    label="Rating"
                    name="rating"
                    rules={[
                        {
                        required: true,
                        message: 'Please input your rating!',
                        },
                    ]}
                    >
                <InputComponent value={stateProduct.rating} onChange={handleOnChange} name='rating' />
                </Form.Item>
                <Form.Item
                  label="Discount"
                  name="discount"
                  rules={[
                      {
                      required: true,
                      message: 'Please input your discount!',
                      },
                  ]}
                >
                <InputComponent value={stateProduct.discount} onChange={handleOnChange} name='discount' />
                </Form.Item>

                <Form.Item
                label="Image"
                name="image"
                rules={[
                    {
                    required: true,
                    message: 'Please input your image!',
                    },
                ]}
                >
                {/* <InputComponent  value={stateProduct.image} onChange={handleOnChange} name='iamge'/> */}
                <WrapperUploadFile onChange={handleOnchangeAvatar} maxCount={1}>
                  <Button icon={<UploadOutlined/>}>
                  </Button>
                {stateProduct?.image &&(
                  <img src={stateProduct?.image} 
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
                      Submit
                  </Button>
                </Form.Item>
            </Form>
          </Loading>
          
        </ModalComponent>

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
                
                onFinish={onUpdateProduct}
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
                <InputComponent value={stateProductDetail.name} onChange={handleOnChangeDetail} name='name' />
                </Form.Item>

                <Form.Item
                label="Description"
                name="description"
                rules={[
                    {
                    required: true,
                    message: 'Please input your description!',
                    },
                ]}
                >
                <InputComponent value={stateProductDetail.description} onChange={handleOnChangeDetail} name='description'/>

                </Form.Item>
                <Form.Item
                label="Type"
                name="type"
                rules={[
                    {
                    required: true,
                    message: 'Please input your type!',
                    },
                ]}
                >
                <InputComponent value={stateProductDetail.type} onChange={handleOnChangeDetail} name='type'/>
                </Form.Item>

                <Form.Item
                label="Price"
                name="price"
                rules={[
                    {
                    required: true,
                    message: 'Please input your price!',
                    },
                ]}
                >
                <InputComponent  value={stateProductDetail.price} onChange={handleOnChangeDetail} name='price'/>
                </Form.Item>

                <Form.Item
                label="CountInStock"
                name="countInStock"
                rules={[
                    {
                    required: true,
                    message: 'Please input your countInStock!',
                    },
                ]}
                >
                <InputComponent value={stateProductDetail.countInStock} onChange={handleOnChangeDetail} name='countInStock'/>
                </Form.Item>

                <Form.Item
                label="Rating"
                name="rating"
                rules={[
                    {
                    required: true,
                    message: 'Please input your rating!',
                    },
                ]}
                >
                <InputComponent value={stateProductDetail.rating} onChange={handleOnChangeDetail} name='rating' />
                </Form.Item>

                <Form.Item
                label="Discount"
                name="discount"
                rules={[
                    {
                    required: true,
                    message: 'Please input your discount!',
                    },
                ]}
                >
                <InputComponent value={stateProductDetail.discount} onChange={handleOnChangeDetail} name='discount' />
                </Form.Item>

                <Form.Item
                label="Image"
                name="image"
                rules={[
                    {
                    required: true,
                    message: 'Please input your image!',
                    },
                ]}
                >
                <WrapperUploadFile onChange={handleOnchangeAvatarDetail} maxCount={1}>
                  <Button icon={<UploadOutlined/>}>
                  </Button>
                {stateProductDetail?.image &&(
                  <img src={stateProductDetail?.image} 
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

        <ModalComponent forceRender title="Xóa sản phẩm" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteProduct} >  
          <Loading isLoading={isPendingDelete}>
                <div>Bạn có chắc chắn muốn xóa sản phẩm này không ?</div>
          </Loading>
          
        </ModalComponent>
    </div>
  )
}
export default AdminProduct