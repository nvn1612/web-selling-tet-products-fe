import styled from "styled-components";
import {InputNumber} from "antd"

export const WrapperOrderItem = styled.div `
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    width: 700px;
    padding: 20px;
    background-color: #fff;
    margin-top: 20px
`
export const WrapperOrderList = styled.div `
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 100%;
    margin-top:'20px';
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
