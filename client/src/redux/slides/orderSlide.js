import { createSlice } from '@reduxjs/toolkit'

export const orderSlice = createSlice({
  name: 'order',
  initialState: {
    orderItems: [],
    orderItemsSelected: [],
    shippingAddress: {
    },
    paymentMethod: '',
    itemsPrice: 0,
    shippingPrice: 0,
    taxiPrice: 0,
    totalPrice: 0,
    user:'',
    isPaid: false,
    paidAt: '',
    isDelivered: false,
    deliveredAt:'',

    priceMemo: 0,
    discountMemo: 0,
    deliveryMemo: 0,
    totalPriceMemo: 0,

  },
  reducers: {
    addOrderProduct: (state, action) => {
      const {orderItem} = action.payload
      const itemOrder = state?.orderItems?.find((item) => item?.product === orderItem.product)
      if(itemOrder)
        {
            itemOrder.amount += orderItem?.amount
        }else{
            state.orderItems.push(orderItem)
        }
    },
    removeOrderProduct: (state, action) => {
        const {idProduct} = action.payload
        const itemOrder = state?.orderItems?.filter((item) => item?.product !== idProduct)
        const itemOrderSelected = state?.orderItemsSelected?.filter((item) => item?.product !== idProduct)
          state.orderItems = itemOrder;
          state.orderItemsSelected = itemOrderSelected;
      },
    removeAllOrderProduct: (state, action) => {
      const {listChecked} = action.payload
      const itemOrders = state?.orderItems?.filter((item) => !listChecked.includes(item.product))
      const itemOrdersSelected = state?.orderItems?.filter((item) => !listChecked.includes(item.product))
      state.orderItems = itemOrders;
      state.orderItemsSelected = itemOrdersSelected
    },
      increaseOrder: (state, action) => {
        const {idProduct} = action.payload
        const itemOrder = state?.orderItems?.find((item) => item?.product === idProduct)
        const itemOrderSelected = state?.orderItemsSelected?.find((item) => item?.product === idProduct)
        itemOrder.amount++
        if(itemOrderSelected)
          {
            itemOrderSelected.amount++
          }
      },
      decreaseOrder: (state, action) => {
        const {idProduct} = action.payload
        const itemOrder = state?.orderItems?.find((item) => item?.product === idProduct)
        const itemOrderSelected = state?.orderItemsSelected?.find((item) => item?.product === idProduct)
        itemOrder.amount--
        if(itemOrderSelected)
          {
            itemOrderSelected.amount--
          }
      },
      selectedOrder: (state, action) => {
        const { listChecked } = action.payload;
        const orderSelected = [];
        state.orderItems.forEach((order) => {
          if (listChecked.includes(order.product)) { 
            orderSelected.push(order);
          }
        });
        state.orderItemsSelected = orderSelected
      },
      setOrderDetails: (state, action) => {
        const { priceMemo, discountMemo, deliveryMemo, totalPriceMemo } = action.payload;
        state.priceMemo = priceMemo;
        state.discountMemo = discountMemo;
        state.deliveryMemo = deliveryMemo;
        state.totalPriceMemo = totalPriceMemo;
      },
      
  }
})  


export const { addOrderProduct, selectedOrder, removeOrderProduct, removeAllOrderProduct
  ,decreaseOrder,increaseOrder, setOrderDetails
 } = orderSlice.actions

export default orderSlice.reducer