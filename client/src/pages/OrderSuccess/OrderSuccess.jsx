import React, { useEffect, useMemo, useState } from "react";
import { Col, Form, Row } from "antd";
import { Flex } from "antd";
import { WrapperBill, WrapperMenthod, WrapperNameMethod,WrapperItemListOrder,
  WrapperQualityProduct
} from "./style";
import { useDispatch, useSelector } from "react-redux";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import InputComponent from "../../components/InputComponent/InputComponent";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as UserService from "../../service/UserService";
import * as OrderService from "../../service/OrderService";
import Loading from "../../components/LoadingComponent/LoadingComponent";
import { updateUser } from "../../redux/slides/userSlide";
import { Checkbox } from "antd";
import * as message from "../../components/Message/Message";
import { convertPrice } from "../../ultis";
import { useLocation } from "react-router-dom";
import { orderConstants } from "../../constants";

const OrderSuccess = () => {
  // const order = useSelector((state) => state.order);
  const location = useLocation()
  const {state} = location
  return (
    <>
      <Loading isLoading={false}>
        <div
          style={{
            padding: "0 120px",
            background: "#efefef",
            height: "1000px",
          }}
        >
          <h5 style={{ margin: "0" }}>
            <span
              style={{
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "20px",
              }}
            >
              Đơn hàng đặt thành công
            </span>
          </h5>
          <div style={{ width: "100%" }}>
            <div style={{ backgroundColor: "#fff", fontSize: "20px" }}>
              <Flex vertical>
                <span>Phương thức giao hàng</span>
                <WrapperMenthod>
                  <Flex vertical>
                    <span>
                      <WrapperNameMethod>{orderConstants.delivery[state?.selected]}</WrapperNameMethod> Giao hàng tiết
                      kiệm
                    </span>
                  </Flex>
                </WrapperMenthod>
              </Flex>
              <Flex vertical>
                <span>Phương thức thanh toán</span>
                <WrapperMenthod>
                  <Flex vertical>
                    <span>{orderConstants.payment[state?.selectedPayment]}</span>
                  </Flex>
                </WrapperMenthod>
              </Flex>
              <div>
                {state?.orders?.map((order) => {
                  return (
                  <WrapperItemListOrder key={order?.name}>
                    <Flex align={"center"}>
                      <Flex align={"center"}>
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
                      <span style={{ marginLeft: "170px" }}>
                        {convertPrice(order?.price)}
                      </span>
                      {/* <WrapperQualityProduct>
                        <button
                          style={{
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            handleChangeCount("decrease", order?.product)
                          }
                        >
                          <MinusOutlined
                            style={{ color: "#000", fontSize: "20px" }}
                          />
                        </button>
                        <WrapperInputNumber
                          defaultValue={order?.amount}
                          value={order?.amount}
                        />
                        <button
                          style={{
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                          }}
                          onClick={""}
                        >
                          <PlusOutlined
                            style={{ color: "#000", fontSize: "20px" }}
                          />
                        </button>
                      </WrapperQualityProduct> */}
                      <span style={{ marginLeft: "140px" }}>
                        Giá tiền:
                        {convertPrice(order?.price * order?.amount)}
                      </span>
                      <div style={{ marginLeft: "155px" }}>
                      <span style={{ marginLeft: "140px" }}>
                        Số lượng:
                        {order?.amount}
                      </span>
                      </div>
                    </Flex>
                  </WrapperItemListOrder>
                  )
                })}
                <div>
                  <span>Tổng tiền: {state?.totalPrice}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Loading>
    </>
  );
};

export default OrderSuccess;
