import React,{useEffect, useMemo, useState} from "react";
import { Button, Col, Descriptions, Form, Row } from "antd";
import { Checkbox } from "antd";
import { Flex } from "antd";
import {
  WrapperBill,
  WrapperHeaderListOrder,
  WrapperItemListOrder,
  WrapperQualityProduct,
  WrapperInputNumber,
  
} from "./style";
import { DeleteOutlined,
        MinusOutlined,
        PlusOutlined
 } from "@ant-design/icons";
import { useDispatch, useSelector } from 'react-redux'
import { convertPrice } from "../../ultis";
import { decreaseOrder, increaseOrder, removeAllOrderProduct, removeOrderProduct, selectedOrder, setOrderDetails } from "../../redux/slides/orderSlide";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import InputComponent from "../../components/InputComponent/InputComponent";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as UserService from "../../service/UserService"
import { isPending } from "@reduxjs/toolkit";
import Loading from "../../components/LoadingComponent/LoadingComponent";
import * as message from "../../components/Message/Message"
import { updateUser } from "../../redux/slides/userSlide";
import { useNavigate } from "react-router-dom";
import StepComponent from "../../components/StepComponent/StepComponent";


const OrderPage = () => {
  const order = useSelector((state) => state.order)
  const user = useSelector((state) => state.user)
  const [listChecked, setListChecker] = useState([])
  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false)
  const [stateUserDetail, setStateUserDetail] = useState({
    name: '',
    phone: '',
    address:'',
    city: ''
  
})

const [form] = Form.useForm();
const navigate = useNavigate()



  const dispatch = useDispatch()
  const onChange = (e) =>{
    if(listChecked.includes(e.target.value)){
      const newListChecked = listChecked.filter((item) =>item !== e.target.value)
      setListChecker(newListChecked)
    }else{
      setListChecker([...listChecked, e.target.value])
    }
  }

  const handleOnchangeCheckAll = (e) =>{
    if(e.target.checker) {
      const newListChecked = [] 
      order?.orderItems.forEach((item) => {
        newListChecked.push(item?.product)
      })
      setListChecker(newListChecked)
    }else{
      setListChecker([])
    }
  }

  useEffect(() => {
    dispatch(selectedOrder({listChecked}))
  },[listChecked])

  // update form 

  useEffect(() => {
    if(isOpenModalUpdateInfo)
      {
        setStateUserDetail({
          ...stateUserDetail,
          city: user?.city,
          name: user?.name,
          phone: user?.phone,
          address: user?.address,
        })
      }
  },[isOpenModalUpdateInfo])

  useEffect(() =>{
    form.setFieldsValue(stateUserDetail)
  },[form, stateUserDetail])




  //count value allSum

  const priceMemo = useMemo(()=>{
    const result = order?.orderItemsSelected?.reduce((total, cur) => {
      return total + ((cur.price * cur.amount))
    },0)
    return result
  },[order])

  //count value discount

  const discountMemo = useMemo(()=>{
    const result = order?.orderItemsSelected?.reduce((total, cur) => {
     const  totalDiscount = cur.discount? cur.discount : 0
      return total +  (priceMemo*(totalDiscount * cur.amount) / 100)
    },0)
    if(Number(result)){
      return result
    }
    return 0 
  },[order])

  //delivery

  const deliveryMemo = useMemo(()=>{
   if(priceMemo >= 200000 && priceMemo < 500000 )
    {
      return 10000
    }else if(priceMemo >= 500000 || order?.orderItemsSelected?.length === 0 ){
      return 0
    }else{
      return 20000
    }
  },[order])

  //total price

  const totalPriceMemo = useMemo(() => {
    return Number(priceMemo) - Number(discountMemo) + Number(deliveryMemo) 
  }, [priceMemo, discountMemo, deliveryMemo]);

  //update value in redux

  useEffect(() => {
    dispatch(setOrderDetails({ priceMemo, discountMemo, deliveryMemo, totalPriceMemo }));
  }, [dispatch, priceMemo, discountMemo, deliveryMemo, totalPriceMemo]);

  //delete item order

  const handleDeleteOrder = (idProduct) => {
    dispatch(removeOrderProduct({idProduct}))
  }

  //delete all items order 

  const handleRemoveAllOrder = () => {
    if(listChecked?.length > 0)
      {
        dispatch(removeAllOrderProduct({listChecked}))
      }
  }

  //change number product

 const handleChangeCount = (type, idProduct, limited) =>{
      if(type === 'increase')
        {
          if(!limited)
            {
              dispatch(increaseOrder({idProduct}))
            }
        }else {
          if(!limited)
            {
              dispatch(decreaseOrder({idProduct}))
            }
        }
 }

 // handle add card

 const handleAddCard = () => {
   if(!order?.orderItemsSelected?.length)
      {
        message.error('vui lòng chọn sản phẩm')
      }else if(!user?.name || !user?.phone || !user?.address || !user?.city )
        {
          setIsOpenModalUpdateInfo(true)
        }else{
          navigate('/payment')
        }
 }

 // close modal update inf4 user

  const handleCancelUpdate = () =>{
    setIsOpenModalUpdateInfo(false)
    setStateUserDetail({
      name: '',
      phone: '',
      city: '',
      address: ''
    })
    form.resetFields();
  }

  //update infor user


  const handleOnChangeDetail = (e) =>{
    setStateUserDetail({
      ...stateUserDetail,
      [e.target.name]: e.target.value
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

  const handleUpdateInforUser = () =>{
    const {name, city, address, phone} = stateUserDetail
    if(name && city && address && phone)
      {
        mutationUpdateUser.mutate({id: user?.id,token: user?.access_token, ...stateUserDetail },{
          onSuccess: () => {
            dispatch(updateUser({name, city, address, phone}));
            setIsOpenModalUpdateInfo(false)
          }
        })
      }
  }

  const {isPending, data} = mutationUpdateUser

  //change address user

  const handleOnChangeAddress = () =>{
      setIsOpenModalUpdateInfo(true)
  }

  //step list item

  const items = [
    {
        title: '20.000 VND',
        description: 'Dưới 200.000 VND'
    },
    {
        title: '10.000 VND',
        description: 'Từ 200.000 VND đến dưới 500.000 VND'
    },
    {
        title: '0 VND',
        description: 'trên 500.000 VND'
    },
  ]

  return (
    <>
    <div
      style={{ padding: "0 120px", background: "#efefef", height: "1000px" }}
    >
      <h5 style={{ margin: "0" }}>
        <span
          style={{ cursor: "pointer", fontWeight: "bold", fontSize: "20px" }}
        >
          Giỏ hàng
        </span>
      </h5>
      <div style={{ width: "100%" }}>
        <Row gutter={16}>
          <Col span={19}>
            <div>
              <WrapperHeaderListOrder>
                <div>
                  <StepComponent items={items} current={deliveryMemo === 10000 ? 2 : deliveryMemo === 20000 ? 1
                     : order?.orderItemsSelected.length === 0 ? 0 : 3}/>
                </div>
                <Flex justify={"space-between"} gap="middle" >
                  <Checkbox onChange={handleOnchangeCheckAll} checked={listChecked?.length === order?.orderItems?.length}>
                  </Checkbox>
                  <span>
                    tất cả sản phẩm ({order?.orderItems?.length})sản phẩm
                  </span>
                  <span>Đơn giá</span>
                  <span>Số lượng</span>
                  <span>Thành tiền</span>
                  <DeleteOutlined onClick={handleRemoveAllOrder}/>
                </Flex>
              </WrapperHeaderListOrder>
              {order?.orderItems?.map((order) => {
                return (
                  <WrapperItemListOrder key={order?.product}>
                    <Flex align={"center"}>
                      <Flex align={"center"}>
                        <Checkbox onChange={onChange} value={order?.product} checked={listChecked.includes(order?.product)} />
                        <img
                          style={{
                            width: "50px",
                            height: "50px",
                            marginLeft: "8px",
                            marginRight: "8px",
                          }}
                          src={order?.image}
                          alt=""
                        />
                        <span
                          style={{
                            maxWidth: "120px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                            {order?.name}
                        </span>
                      </Flex>
                      <span style={{marginLeft:"170px"}}>
                          {convertPrice(order?.price)}
                      </span>
                      <WrapperQualityProduct>
                            <button style={{border: 'none', background: 'transparent', cursor: 'pointer'}} onClick={()=>handleChangeCount('decrease',order?.product,  order?.amount === 1)}>
                                <MinusOutlined style={{color: '#000', fontSize: '20px'}} />
                            </button>
                            <WrapperInputNumber defaultValue={order?.amount}  value={order?.amount} min={1} max={order?.countInStock}/>
                            <button style={{border: 'none', background: 'transparent', cursor: 'pointer'}} onClick={()=>handleChangeCount('increase',order?.product, order?.amount === order?.countInStock)}>
                                <PlusOutlined style={{color: '#000', fontSize: '20px'}}/>
                            </button>
                        </WrapperQualityProduct>
                      <span style={{marginLeft:"140px"}}>
                        {convertPrice(order?.price * order?.amount)}
                      </span>
                      <div style={{marginLeft:"155px"}}>
                        <DeleteOutlined  onClick={() => handleDeleteOrder(order.product)}/>
                      </div>
                    </Flex>
                  </WrapperItemListOrder>
                )
              })}
            </div>
          </Col>
          <Col span={5}>
            <WrapperBill>
              <Flex vertical={true}>
                <div>
                    <span>Địa chỉ: </span>
                    <span style={{fontWeight: 'bold'}}>{` ${user?.address} ${user?.city}`}</span>
                    <span onClick={handleOnChangeAddress} style={{color: 'blue', cursor: 'pointer'}}> Thay đổi</span>

                </div>
                <hr style={{border: "1px solid black"}}></hr>
                <Flex justify={"space-between"}>
                  <span>Tạm tính</span>
                  <span>{convertPrice(priceMemo)}</span>
                </Flex>
                <Flex justify={"space-between"}>
                  <span>Giảm giá</span>
                  <span>{convertPrice(discountMemo)}%</span>
                </Flex>
                <Flex justify={"space-between"}>
                  <span>Phí giao hàng</span>
                  <span>{convertPrice(deliveryMemo)}</span>
                </Flex>
              </Flex>
              <Flex style={{ marginTop: "20px" }} gap="50px">
                <span>Tổng tiền</span>
                <flex vertical={true}>
                  <span
                    style={{
                      fontWeight: "bold",
                      color: "red",
                      fontSize: "20px",
                    }}
                  >
                    {totalPriceMemo}
                  </span>
                  <div style={{ fontSize: "10px" }}>
                    (Đã bao gồm VAT nếu có)
                  </div>
                </flex>
              </Flex>
            </WrapperBill>
                <ButtonComponent textbutton='Mua hàng' styleButton={{width: '257px', color:'red'}}
                  onClick={()=> handleAddCard()}
                 />
          </Col>
        </Row>
      </div>
    </div>
    <ModalComponent forceRender title="Cập nhập thông tin người dùng" open={isOpenModalUpdateInfo} onCancel={handleCancelUpdate} onOk={handleUpdateInforUser} >  
          <Loading isLoading={isPending}>
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
                
                // onFinish={onUpdateUser}
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
                label="City"
                name="city"
                rules={[
                    {
                    required: true,
                    message: 'Please input your city!',
                    },
                ]}
                >
                <InputComponent value={stateUserDetail.city} onChange={handleOnChangeDetail} name='city'/>
                </Form.Item>
            </Form>
          </Loading>
        </ModalComponent>
    </>
  );
};

export default OrderPage;
