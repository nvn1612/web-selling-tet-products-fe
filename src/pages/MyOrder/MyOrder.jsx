import React,{useEffect} from "react";
import { Flex } from "antd";
import {
  WrapperOrderItem,
  WrapperOrderList
  
} from "./style";

import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as OrderService from "../../service/OrderService"
import Loading from "../../components/LoadingComponent/LoadingComponent";
import * as message from "../../components/Message/Message"
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";


const MyOrder = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const {state} = location
  const fetchMyOrder = async () =>{
   const res = await OrderService.getOrderByUserId(state?.id, state?.token)
   return res.data
 }
 const queryOrder = useQuery(
  {queryKey: ['orders'],queryFn: fetchMyOrder,enabled: Boolean(state?.id && state?.token)}
  
);
 const {isPending, data: order} = queryOrder

  //see detail product
  const handleDetailsOrder = (id) =>{
    navigate(`/details-order/${id}`,{
      state: {
        token: state?.token
      }
    })
  }

  //delete order

  const mutation = useMutationHooks(
    (data) => {
      const { id, token, orderItems} = data
      const res = OrderService.cancelOrder(id, token, orderItems)
      return res
    }
  )

  const handleCancelOrder = (data) =>{
    mutation.mutate({id: data?._id,token: state?.token, orderItems: data?.orderItems },{
      onSuccess: () => {
        queryOrder.refetch()
      }
     })
  }

  const {isPending: isPendingCancel, isSuccess: isSuccessCancel, isError: isErrorCancel, data: dataOrderCancel} = mutation

  useEffect(() => {
    if(isSuccessCancel && dataOrderCancel.status ==='OK') {
      message.success()
    }else if (isErrorCancel) {
      message.error()
    }
  }, [isSuccessCancel, isErrorCancel])

  return (
    <>
    <Loading isLoading={isPending || isPendingCancel }>
      <div
        style={{ padding: "0 120px", background: "#efefef", height: "1000px" }}
      >
        order
        <WrapperOrderList>
          {order?.map((data) =>{
            return (
            <WrapperOrderItem key={order?._id}>
                <div>
                    <Flex vertical>
                      <span style={{fontWeight:'bold', fontSize:'13px'}}>Trạng thái</span>
                      <span style={{color: 'red', fontSize:'13px'}}>Giao hàng: <span style={{color: 'black'}}>Chua giao hang</span></span>
                      <span style={{color: 'red',  fontSize:'13px'}}>Thanh toán: <span style={{color: 'black'}}>{data?.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}</span></span>
                    </Flex>
                </div>
                <hr />
                {data?.orderItems?.map((item) =>{
                  return (
                <div>
                  <div style={{fontSize:'13px'}}>
                      <Flex justify='space-between'  align='center'>
                        <Flex align='center' gap={'10px'}>
                          <img style={{width:'55px', height:'55px'}} src={item.image} alt="" />
                          <span>{item.name}</span>
                        </Flex>
                        <div>
                          <span>{item.price} VND</span>
                        </div>
                      </Flex>
                  </div>
                <hr />
                  <div>
                    <Flex justify="flex-end">
                        <span>Tổng tiền: <span>{data.totalPrice} đ</span></span>
                    </Flex>
                  </div>
                </div>

                  )
                })}


                <div>
                        <Flex justify="flex-end" gap={'10px'} style={{marginTop: '10px'}}>
                            <ButtonComponent textbutton='Huỷ đơn hàng'
                             onClick={()=> handleCancelOrder(data)}
                            />
                            <ButtonComponent textbutton='Xem chi tiết'
                            onClick={()=> handleDetailsOrder(data?._id)}/>
                        </Flex>
                </div>
            </WrapperOrderItem>
            )
          })}
        </WrapperOrderList>
    </div>
    </Loading>
    </>
  );
};

export default MyOrder;
