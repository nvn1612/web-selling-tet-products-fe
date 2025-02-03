import styled from "styled-components";
import { Card } from 'antd';



export const WrapperCardStyle = styled(Card)`
    width: 200px;
    & img{
        height: 200px;
        width: 200px;
    }
    position: relative;
    background-color: ${props => props.disabled ? '#ccc' : '#fff'};
    cursor:  ${props => props.disabled ? 'not-allowed' : 'pointer'};
`



export const StyleNameProduct = styled.div`
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    color: rgb(56, 56, 61)
    font-weight: 400
`
export const WrapperReportText = styled.div`
    font-size: 11px;
    display: flex;
    color: rgb(128, 128, 137);
    align-items: center;
    margin:6px 0 4px;
`
export const WrapperPriceText = styled.div`
    font-size: 16px;
    font-weight: 500;
    color: rgb(255, 66, 78);
    
`
export const WrapperDiscountText = styled.span`
    font-size: 12px;
    font-weight: 500;
    color: rgb(255, 66, 78);
`