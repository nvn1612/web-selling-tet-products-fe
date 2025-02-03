import { Modal } from 'antd'
import React from 'react'

const ModalComponent = ({title="Modal",children ,isOpen=false, ...rests}) => {
  return (
    <div>
      <Modal title={title} open={isOpen} {...rests}>
            {children }
      </Modal>
    </div>
  )
}

export default ModalComponent