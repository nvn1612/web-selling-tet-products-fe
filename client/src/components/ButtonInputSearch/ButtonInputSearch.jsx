import React from 'react'
import { Button } from 'antd'
import {
    SearchOutlined
  } from '@ant-design/icons';

import InputComponent from '../InputComponent/InputComponent';
const ButtonInputSearch = (props) => {
    const {size, placeholder, textbutton, backgroundButton='rgb(245, 206, 66)',textColorButton='#FFFFFF'} = props
  return (
    <div style={{display: 'flex'}}>
        <InputComponent size={size} placeholder={placeholder} style={{ borderRadius: '0', border: 'none'}} {...props}/>
        <Button size={size} icon={<SearchOutlined style={{color: textColorButton}}/>} style={{ borderRadius: '0', backgroundColor: backgroundButton,border: 'none' }} borderless>
            <span style={{color: textColorButton}}>
                {textbutton}
            </span> 
        </Button>
    </div>
  )
}

export default ButtonInputSearch