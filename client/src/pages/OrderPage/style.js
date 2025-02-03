import styled from "styled-components";
import {InputNumber} from "antd"

export const WrapperBill = styled.div `
    padding: 20px;
    background-color: #fff;
`
export const WrapperHeaderListOrder = styled.div `
    padding: 10px;
    background-color: #fff;
`
export const WrapperItemListOrder = styled.div `
    margin-top: 10px;
    padding: 20px 10px;
    background-color: #fff;
    
`
export const WrapperQualityProduct = styled.div`
    display: flex;
    gap: 4px;
    align-items: center;
    width: 110px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-left: 140px
   
`

export const WrapperInputNumber = styled(InputNumber)`
        width: 100px;
        border-top: none;
        border-bottom: none;
`
