import React,{useEffect, useMemo, useState} from "react";
import { Button, Col, Descriptions, Form, Row } from "antd";
import { Checkbox } from "antd";
import { Flex } from "antd";
import {
  WrapperInfor
  
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
import * as OrderService from "../../service/OrderService"
import { isPending } from "@reduxjs/toolkit";
import Loading from "../../components/LoadingComponent/LoadingComponent";
import * as message from "../../components/Message/Message"
import { updateUser } from "../../redux/slides/userSlide";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import StepComponent from "../../components/StepComponent/StepComponent";
import { useQuery } from "@tanstack/react-query";
import { orderConstants } from "../../constants";


const DetailsOrder = () => {
  const param = useParams()
  const {id} = param
  const location = useLocation()
  const {state} = location
  const fetchOrderDetails = async () =>{
   const res = await OrderService.getDetailsOrder(id, state?.token)
   return res.data
 }
 const queryOrderDetails = useQuery(
  {queryKey: ['order-details'],queryFn: fetchOrderDetails,enabled: Boolean(id && state?.token)}
  
);
 const {isPending, data: orderDetails} = queryOrderDetails

  // price when not have shipping price
  const priceMemo = useMemo(()=>{
    const result = orderDetails?.orderItems?.reduce((total, cur) => {
      return total + ((cur.price * cur.amount))
    },0)
    return result
  },[orderDetails])

  return (
    <>
    <Loading isLoading={isPending}>
      <div
        style={{ padding: "0 120px", background: "#efefef", height:'100vh'}}
      >
        <div style={{fontWeight:'bold', padding:'20px 0',fontSize:'15px'}}>Chi tiết đơn hàng</div>
        <Flex justify="space-between">

        <Flex vertical gap={'10px'}>
          <div style={{ fontSize:'15px'}}>ĐỊA CHỈ NGƯỜI NHẬN</div>
          <div>
            <WrapperInfor>
              <span style={{fontWeight:'bold',fontSize:'15px',textTransform: 'uppercase'}}>{orderDetails?.shippingAddress?.fullName}</span>
              <div  style={{ fontSize:'15px'}}>Địa chỉ: <span>{`${orderDetails?.shippingAddress?.address} ${orderDetails?.shippingAddress?.city}`}</span></div>
              <div  style={{ fontSize:'15px'}}>Điện thoại: <span>{orderDetails?.shippingAddress?.phone}</span></div>
            </WrapperInfor>
          </div>
        </Flex>

        <Flex vertical gap={'10px'}>
          <div style={{ fontSize:'15px'}}>HÌNH THỨC GIAO HÀNG</div>
          <div>
            <WrapperInfor>
              <div  style={{ fontSize:'15px'}}><span  style={{ textTransform:'uppercase',color:'#ffab3a'}}>{orderConstants.delivery[orderDetails?.paymentMethod]}</span> Giao hàng tiết kiệm</div>
              <div  style={{ fontSize:'15px'}}>Phí giao hàng: <span>{orderDetails?.shippingPrice}</span></div>
            </WrapperInfor>
          </div>
        </Flex>

        <Flex vertical gap={'10px'}>
          <div style={{ fontSize:'15px'}}>HÌNH THỨC THANH TOÁN</div>
          <div>
            <WrapperInfor>
              <div style={{ fontSize:'15px'}}>{orderConstants.payment[orderDetails?.paymentMethod]}</div>
              <div style={{ fontSize:'15px',color:'orange' }}>{orderDetails?.isPaid ? 'Đã thanh toán' :  'Chưa thanh toán'}</div>
            </WrapperInfor>
          </div>
        </Flex>

        </Flex>

        <div style={{ paddingTop:'20px'}}>
          <div style={{ fontSize:'15px',  display:'flex'}}>
            <span style={{marginRight:'350px'}}>Sản phẩm</span>
            <span style={{marginRight:'100px'}}>Giá</span>
            <span style={{marginRight:'100px'}}>Số lượng</span>
            <span style={{marginRight:'100px'}}>Giảm giá</span>
          </div>
          {orderDetails?.orderItems?.map((item) =>{
            return (
            <div div style={{ fontSize:'15px', marginTop:'20px', alignItems:'center', display:'flex'}}>
                <img src={item.image} alt="" 
                style={{width:'70px', height:'70px', marginRight:'30px'}}/>
                <span style={{marginRight:'250px'}}>{item.name}</span>
                <span style={{marginRight:'100px'}}>{convertPrice(item?.price)}</span>
                <span style={{marginRight:'100px'}}>{convertPrice(item?.amount)}</span>
                <span style={{marginRight:'100px'}}>{item?.discount ? convertPrice(priceMemo*item.discount / 100) : 0}</span>
            </div>
            )
          })}
        </div>
        <div style={{marginTop:'20px', fontSize:'20px'}}>
            <span style={{marginRight:'100px'}}>Tạm tính : {convertPrice(priceMemo)}</span>
            <span style={{ fontWeight:'bold'}}>Tổng cộng : {convertPrice(orderDetails?.totalPrice)}</span>
        </div>
        
    </div>
    </Loading>
    </>
  );
  }

export default DetailsOrder;
