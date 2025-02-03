import React from 'react'
import ProductDetailComponent from '../../components/ProductDetailComponent/ProductDetailComponent'
import { useNavigate, useParams } from 'react-router-dom'
const ProductDetailsPage = () => {
  const {id} = useParams()
  const navigate = useNavigate()
  return (
    <div style={{padding: '0 120px', background: '#efefef' }}>
      <h5 style={{margin: '0'}}><span style={{cursor:'pointer', fontWeight: 'bold'}} onClick={()=> navigate('/')}>Trang chủ</span>- chi tiết sản phẩm </h5>
      <ProductDetailComponent idProduct={id}/>
    </div>
  )
}

export default ProductDetailsPage