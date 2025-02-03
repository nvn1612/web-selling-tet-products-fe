import React, { useEffect, useState } from "react";
import { Col, Pagination, Row } from "antd";
import NavbarComponent from "../../components/NavbarComponent/NavbarComponent";
import CardComponent from "../../components/CardComponent/CardComponent";
import { WrapperProducts, WrapperNavbar } from "./style";
import { useLocation } from "react-router-dom";
import * as ProductService from "../../service/ProductService"
import Loading from "../../components/LoadingComponent/LoadingComponent";
import {useSelector} from 'react-redux'
import { useDebounce } from '../../hooks/useDebounce'


const TypeProductPage = () => {
  const searchProduct = useSelector((state) => state?.product?.search)
  const searchDebounce = useDebounce(searchProduct,500)

  const [products, setProducts] = useState([])
  const [loading, setloading] = useState(false)
  const [panigate, setPanigate] = useState({
    page: 0,
    limit: 10,
    total: 1
  })
  
  const {state} = useLocation()
  const fetchTypeProduct = async (type, page, limit) =>{
    setloading(true)
    const res = await ProductService.getProductType(type, page, limit)
    if(res?.status === 'OK')
      {
        setloading(false)
        setProducts(res?.data)
        setPanigate({
          ...panigate,
          total: res?.totalPage
        })
      }else{
        setloading(false)
      }
  }
  useEffect(() => {
    if(state) {
      fetchTypeProduct(state, panigate.page, panigate.limit)
    }
  },[state,  panigate.page, panigate.limit])
  const onChange = (current, pageSize) => {
    setPanigate({...panigate, page: current - 1, limit: pageSize})
  };


  return (
    <Loading isLoading={loading}>
      <div style={{ width: "100%", background: "#efefef",height: 'calc(100vh - 66px'}}>
        <div style={{  width: "1270px", margin: '0 auto',height: '100%' }}>
          <Row style={{ flexWrap: "nowrap", paddingTop: "10px",height: '100%' }}>
            <WrapperNavbar span={4}>
              <NavbarComponent />
            </WrapperNavbar>
            <Col span={20}>
              <WrapperProducts>
                {products?.filter((pro) => {
                  if(searchDebounce === '')
                    {
                      return pro
                    }else if(pro?.name?.toLowerCase()?.includes(searchDebounce?.toLowerCase()))
                      {
                        return pro
                      }
                })?.map((product) => {
                  return (
                    <CardComponent 
                    key={product._id}
                    countInStock={product.countInStock}
                    description={product.description}
                    image={product.image}
                    name={product.name}
                    price={product.price}
                    rating={product.rating}
                    type={product.type}
                    discount={product.discount}
                    selled={product.selled}
                    id={product._id}/>
                  )
                })}
              </WrapperProducts>
              <Pagination
                defaultCurrent={panigate.page + 1}
                total={panigate?.total}
                onChange={onChange}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "10px",
                }}
              />
            </Col>
          </Row>
        </div>
      </div> 
    </Loading>
  );
};

export default TypeProductPage;
