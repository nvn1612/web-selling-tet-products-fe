import { Row } from 'antd';
import styled from 'styled-components'

export const WrapperHeader = styled(Row)`
    padding: 10px 120px;
    background-color: rgb(245, 66, 90);
    align-items: center;
    gap: 16px;
    flex-wrap: nowrap;
`

export const WrapperTextHeader = styled.span`
    font-size: 18px;
    color: #fff;
    font-weight:bold;
    text-align: left;
    cursor: pointer
`

export const WrapperHeaderAccount = styled.div`
    display: flex;
    text-align: center;
    color: #fff;
    gap: 10px;
    white-space: nowrap;
    
`
export const WrapperHeaderTextSmall = styled.div`
    font-size: 12px;
    color: #fff;

`
export const WrapperContentPopup = styled.p`
    cursor: pointer;
    &:hover {
        color: rgb(26, 148, 255)
    }
`