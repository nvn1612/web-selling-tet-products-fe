import React from 'react'
import { Steps } from 'antd'
const StepComponent = ({current = 0, items = []}) => {
    const {Step} = Steps
  return (
    <Steps
        current={1}
    >
      {items.map((item) => {
        return (
          <Step key={item.title} title={item.title} description={item.description}/>
        )
      })}
    </Steps>
  )
}

export default StepComponent