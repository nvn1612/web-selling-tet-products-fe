import React from "react";
import { Button } from "antd";
const ButtonComponent = ({textbutton, styleButton,disabled,onClick}) => {
  return <div>
     <Button style={styleButton} disabled={disabled} onClick={onClick}>{textbutton}</Button>
  </div>;
};

export default ButtonComponent;
