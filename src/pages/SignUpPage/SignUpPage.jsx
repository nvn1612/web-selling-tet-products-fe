import React, {useEffect, useState} from 'react'
import {WrapperContainerRight,WrapperContainerLeft,WrapperTextLight} from './style'
import InputForm from '../../components/InputForm/InputForm'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import {Image} from 'antd'
import ImageLogo from '../../assets/images/logo-tet.png'
import { useNavigate } from "react-router-dom";
import * as UserService from '../../service/UserService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import Loading from '../../components/LoadingComponent/LoadingComponent'
import * as message from "../../components/Message/Message"

const SignUpPage = () => {
  const navigate = useNavigate()
  const handleNavigateSignIn = () => {
    navigate('/sign-in')
  }

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setconfirmPassword] = useState('');

  const handleOnchangeEmail = (value) => {
    setEmail(value)
  }
  const handleOnchangePassword= (value) => {
    setPassword(value)
  }
  const handleOnchangeConfirmPassword = (value) => {
    setconfirmPassword(value)
  }

  const mutation = useMutationHooks(
    data => UserService.signUpUser(data)
  )
  const handleSignUp = () => {
    mutation.mutate({
      email,
      password, 
      confirmPassword
    })
  }
  const {data, isPending, isSuccess, isError} = mutation
  

  return (
    <div style={{display: 'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.53)', height: '100vh'}}>
      <div style={{width: '800px', height:'445px', borderRadius:'6px', background:'#fff', display: 'flex'}}>
          <WrapperContainerLeft>
              <h1>Xin chào</h1>
              <p>Đăng kí tài khoản</p>
              <InputForm placeholder={'abc123@gmail.com'} value={email} onChange={handleOnchangeEmail}/>
              <InputForm placeholder={'password'} type="password" value={password} onChange={handleOnchangePassword}/>
              <InputForm placeholder={'Confirm password'} type="password" value={confirmPassword} onChange={handleOnchangeConfirmPassword}/>
              {data?.status ==='ERR' && <span style={{color: 'red'}}>{data?.message}</span>}
              <Loading isLoading={isPending}>
                <ButtonComponent disabled={!email.length || !password.length || !confirmPassword.length} textbutton={'Đăng kí'} styleButton={{background: 'red', color:'white', border: 'none', width:'100%', margin:'26px 0 10px'}}
                onClick={handleSignUp}
                />  
              </Loading>
              <p>Bạn đã có tài khoản ? <WrapperTextLight onClick={handleNavigateSignIn} >Đăng nhập</WrapperTextLight></p>
          </WrapperContainerLeft>
        <WrapperContainerRight>
            <Image src={ImageLogo} preview={false} alt='Image-logo' height='203px' width='203px'/>
            <h4>Mua sắm tại Nvam</h4>
        </WrapperContainerRight>
      </div>
    </div>
  )
}

export default SignUpPage