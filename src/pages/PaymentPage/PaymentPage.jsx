import React,{useEffect, useMemo, useState} from "react";
import {  Col, Form, Radio, Row } from "antd";
import { Flex } from "antd";
import {
  WrapperBill,
  WrapperMenthod,
  WrapperNameMethod
} from "./style";
import { useDispatch, useSelector } from 'react-redux'
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import InputComponent from "../../components/InputComponent/InputComponent";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as UserService from "../../service/UserService"
import * as OrderService from "../../service/OrderService"
import * as PaymentService from "../../service/PaymentService"
import Loading from "../../components/LoadingComponent/LoadingComponent";
import { updateUser } from "../../redux/slides/userSlide";
import { Checkbox } from 'antd';
import * as message from "../../components/Message/Message"
import { useNavigate } from "react-router-dom";
import { removeAllOrderProduct } from "../../redux/slides/orderSlide";
import { PayPalButton } from "react-paypal-button-v2";
import { convertPrice } from "../../ultis";


const PaymentPage = () => {
  const user = useSelector((state) => state.user)
  const order = useSelector((state) => state.order)

  const navigate = useNavigate()

  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false)
  const [stateUserDetail, setStateUserDetail] = useState({
    name: '',
    phone: '',
    address:'',
    city: ''
  
})
const [selected, setSelected] = useState('Fast'); 
const [selectedPayment, setSelectedPayment] = useState('Payment'); 
const [sdkReady, setSdkReady] = useState(false); 


const [form] = Form.useForm();
const dispatch = useDispatch()



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

  // check menthod 

  const handleChange = (value) => {
    setSelected(value); 
  }

  //create order

  const mutationAddOrder = useMutationHooks(
    (data) => {
      const { 
        token,
       ...rests} = data
        const res = OrderService.createOrder(
          {...rests},
          token
          
        )
        return res
      }
    )

    const handleAddOrder = () => {
      if (
        user?.access_token &&
        order?.orderItemsSelected &&
        user?.name &&
        user?.address &&
        user?.phone &&
        user?.city &&
        priceMemo &&
        user?.id
      ) {
        mutationAddOrder.mutate(
          {
            token: user?.access_token,
            orderItems: order?.orderItemsSelected,
            fullName: user?.name, 
            address: user?.address,
            phone: user?.phone,
            city: user?.city,
            paymentMethod: selectedPayment, 
            itemsPrice: priceMemo,
            shippingPrice: deliveryMemo,
            totalPrice: totalPriceMemo,
            user: user?.id,
            email: user?.email,
          },
        );
      }
    };

    const {isPending: isPendingAddOrder, data: dataAddOrder, isSuccess, isError} = mutationAddOrder

    useEffect(() => {
      if(isSuccess && dataAddOrder.status ==='OK') {
        const arrayOrdered = []
        order?.orderItemsSelected?.forEach(Element => {
          arrayOrdered.push(Element.product)
        })
        dispatch(removeAllOrderProduct({listChecked: arrayOrdered}))  
        message.success('Đặt hàng thành công!')
        navigate('/orderSuccess', {
          state: {
            selected,
            selectedPayment,
            orders: order?.orderItemsSelected,
            totalPrice: totalPriceMemo
          }
        })
      }else if (isError) {
        message.error()
      }
    }, [isSuccess, isError])


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
      return total + ((cur.discount * cur.amount))
    },0)
    if(Number(result)){
      return result
    }
    return 0 
  },[order])

  //delivery

  const deliveryMemo = useMemo(()=>{
   if(priceMemo > 200000)
    {
      return 10000
    }else if(priceMemo === 0){
      return 0
    }else{
      return 20000
    }
  },[order])

  //total price

  const totalPriceMemo = useMemo(() => {
    return Number(priceMemo) - Number(discountMemo) + Number(deliveryMemo);
  }, [priceMemo, discountMemo, deliveryMemo]);

  //payment paypal

  const addPaypalScript = async () =>{
    const {data} = await PaymentService.getConfig()
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = `https://www.paypal.com/sdk/js?client-id=${data}`
    script.async = true;
    script.onload = () =>{
      setSdkReady(true)
    }
    document.body.appendChild(script)
  }

  useEffect(() => {
    if(!window.paypal)
      {
        addPaypalScript()
      }else{
        setSdkReady(true)
      }
  },[])

  const onSuccessPaypal = (details, data) =>{
    mutationAddOrder.mutate(
      {
        token: user?.access_token,
        orderItems: order?.orderItemsSelected,
        fullName: user?.name, 
        address: user?.address,
        phone: user?.phone,
        city: user?.city,
        paymentMethod: selectedPayment, 
        itemsPrice: priceMemo,
        shippingPrice: deliveryMemo,
        totalPrice: totalPriceMemo,
        user: user?.id,
        isPaid: true,
        paidAt: details.update_time,
        email: user?.email
      },
    );
  }

  return (
    <>
    <Loading isLoading={isPendingAddOrder}>
      <div
        style={{ padding: "0 120px", background: "#efefef", height: "1000px" }}
      >
        <h5 style={{ margin: "0" }}>
          <span
            style={{ cursor: "pointer", fontWeight: "bold", fontSize: "20px" }}
          >
            Chọn phương thức thanh toán
          </span>
        </h5>
        <div style={{ width: "100%"}}>
          <Row gutter={16}>
            <Col span={19} style={{backgroundColor:"#fff"}}>
              <div>
                <Flex vertical>
                  <span>Chọn phương thức giao hàng</span>
                  <WrapperMenthod>
                      <Flex vertical>
                        <Checkbox
                        checked={selected === 'Fast'} 
                        onChange={() => handleChange('Fast')}>
                          <WrapperNameMethod>Fast</WrapperNameMethod> Giao hàng tiết kiệm
                        </Checkbox>
                        <Checkbox
                        checked={selected === 'Go_ject'} 
                        onChange={() => handleChange('Go_ject')}
                        ><WrapperNameMethod>Go_ject</WrapperNameMethod> Giao hàng tiết kiệm</Checkbox>
                      </Flex>
                  </WrapperMenthod>
                </Flex>
                <Flex vertical>
                  <span>Chọn phương thức thanh toán</span>
                  <WrapperMenthod>
                      <Flex vertical>
                        <Checkbox  checked={selectedPayment === 'Payment'} 
                        onChange={() => setSelectedPayment('Payment')}>
                          Thanh toán khi nhận hàng
                        </Checkbox>
                        <Checkbox  checked={selectedPayment === 'paypal'} 
                        onChange={() => setSelectedPayment('paypal')}>
                          Thanh toán bằng paypal
                        </Checkbox>
                      </Flex>
                  </WrapperMenthod>
                </Flex>
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
                    <span>{priceMemo}</span>
                  </Flex>
                  <Flex justify={"space-between"}>
                    <span>Giảm giá</span>
                    <span>{discountMemo}</span>
                  </Flex>
                  <Flex justify={"space-between"}>
                    <span>Phí giao hàng</span>
                    <span>{deliveryMemo}</span>
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
                    {convertPrice(totalPriceMemo)}
                    </span>
                    <div style={{ fontSize: "10px" }}>
                      (Đã bao gồm VAT nếu có)
                    </div>
                  </flex>
                </Flex>
              </WrapperBill>
              {selectedPayment === 'paypal' && sdkReady  ? (
                           <PayPalButton
                           amount= {Math.round(totalPriceMemo / 30000)}
                           // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
                           onSuccess={onSuccessPaypal}
                           onError={(err) => {
                            console.error('PayPal error:', err);
                            alert('Có lỗi xảy ra, vui lòng thử lại.');
                          }}
                          onCancel={() => {
                            alert('Giao dịch bị hủy.');
                          }}
                         />
              ) : (
                <ButtonComponent textbutton='Đặt hàng' styleButton={{width: '257px', color:'red'}}
                onClick={handleAddOrder}
                />
              )}
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
    </Loading>
    </>
  );
};

export default PaymentPage;
