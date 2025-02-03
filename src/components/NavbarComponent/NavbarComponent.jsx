import React from 'react'
import {WrapperLabelText, WrapperTextValue,WrapperContent,WrapperTextPrice} from './style'
import { Checkbox, Rate  } from 'antd'

const NavbarComponent = () => {
    const renderContent = (type, options) => {
        switch (type) {
            case 'text':
                return options.map((option) => {
                    return (
                        <WrapperTextValue>{option}</WrapperTextValue>
                    )
                })
            case 'checkbox':
                return (
                    <Checkbox.Group style={{width: '100%', display: 'flex', flexDirection: 'column', gap: '20px'}}>
                        {options.map((option) => {
                            return (
                                <Checkbox value={option.value}>
                                    {option.label}
                                </Checkbox>
                            )
                        })}
                    </Checkbox.Group>
                )
            case 'star':
                return options.map((option) =>{
                    return (
                        <div style={{display: 'flex', gap: '4px'}}>
                            <Rate disable defaultValue={option} style={{fontSize: '12px'}}/>
                            <span>{`tu ${option} sao`}</span>
                        </div>
                    )
                })
                case 'price':
                    return options.map((option) => {
                        return (
                            <WrapperTextPrice style={{padding: '4px', borderRadius: '10px', backgroundColor: '#ccc', width:'fit-content'}}>{option}</WrapperTextPrice>
                        )
                    })
            default: 
                return {}
        }
    }
  return (
    <div>
        <WrapperLabelText>abc</WrapperLabelText>
        <WrapperContent>
            {renderContent('text', ['Bánh','quần áo','Đồ trang trí'])}
        </WrapperContent>
        {/* <WrapperContent>
            {renderContent('checkbox', [
                {value: 'a', label: 'A'},
                {value: 'b', label: 'B'},
            ])}
        </WrapperContent>
        <WrapperContent>
            {renderContent('star', [3, 4, 5])}
        </WrapperContent>
        <WrapperContent>
            {renderContent('price', ['Duoi 40', 'tren 50'])}
        </WrapperContent> */}
    </div>
  )
}

export default NavbarComponent