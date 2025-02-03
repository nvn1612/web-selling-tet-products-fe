import styled from "styled-components";
import {Upload } from 'antd'

export const WrapperHeader = styled.h1`
    color: #000;
    font-size: 24px;
`;

export const WrapperContentProfile = styled.div`
    width: 600px;
    display: flex;
    flex-direction: column;
    border: 1px solid #ccc;
    margin: 0 auto;
    padding: 30px;
    border-radius: 10px;
    gap: 30px;
`;

export const WrapperLable = styled.label`
    color: #000;
    font-size: 16px;
    line-height: 30px;
    font-weight: 600px;
    text-align: left;
    width: 60px;
`;

export const WrapperInput = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
`;

export const WrapperUploadFile = styled(Upload)`
  & .ant-upload-list-item.ant-upload-list-item-error {
    display: none;
  }
`;