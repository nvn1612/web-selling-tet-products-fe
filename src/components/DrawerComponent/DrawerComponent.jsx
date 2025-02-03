import React, { Children, useState } from 'react';
import { Drawer } from 'antd';

const DrawerComponent = ({title = "basic drawer",placement = "right" , isOpen = false, Children, ...rests}) => {
  return (
    <>
        <Drawer title={title} open={isOpen} placement={placement} {...rests}>
            {/* {Children} */}
        </Drawer>
    </>
  )
}

export default DrawerComponent