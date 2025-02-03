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
import { jwtDecode } from "jwt-decode";
import { useDispatch } from 'react-redux'
import { updateUser } from '../../redux/slides/userSlide'
import { useLocation } from 'react-router-dom'


const SignInPage = () => {
  const location = useLocation()

  const navigate = useNavigate()
  const handleNavigateSignUp = () => {
    navigate('/sign-up')
  }

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const handleOnchangeEmail = (value) => {
    setEmail(value)
  }
  const handleOnchangePassword= (value) => {
    setPassword(value)
  }

  const mutation = useMutationHooks(
    data => UserService.loginUser(data)
  )
  const handleSignIn = () => {
    mutation.mutate({
      email,
      password 
    })
  }

  const {data, isPending, isSuccess, isError} = mutation
  useEffect(() => {
    if(isSuccess && data?.status != 'ERR') {
      message.success()
      if(location?.state)
      {
        navigate(location?.state)
      }else{
        navigate('/')
      }
      localStorage.setItem('access_token', JSON.stringify(data?.access_token))
      localStorage.setItem('refresh_token', JSON.stringify(data?.refresh_token))
      if(data?.access_token)
        {
          const decoded = jwtDecode(data?.access_token)
          if(decoded?.id)
            {
              handleGetDetailsUser(decoded?.id, data?.access_token)
            }
        }
    }else if (isError) {
      message.error()
    }
  },[isSuccess, isError])

  const handleGetDetailsUser = async (id, token) => {
    const storage = localStorage.getItem('refresh_token')
    const refreshToken = JSON.parse(storage)  

    const res = await UserService.getDetailUser(id, token)
    dispatch(updateUser({...res?.data, access_token: token, refreshToken}))
  }
  return (
    <div style={{display: 'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.53)', height: '100vh'}}>
      <div style={{width: '800px', height:'445px', borderRadius:'6px', background:'#fff', display: 'flex'}}>
          <WrapperContainerLeft>
              <h1>Xin chào</h1>
              <p>Đăng nhập vào tài khoản</p>
              <InputForm placeholder={'abc123@gmail.com'}  value={email} onChange={handleOnchangeEmail}/>
              <InputForm placeholder={'password'} type="password" value={password} onChange={handleOnchangePassword}/>
              {data?.status ==='ERR' && <span style={{color: 'red'}}>{data?.message}</span>}
              <Loading isLoading={isPending}><ButtonComponent textbutton={'Đăng nhập'} styleButton={{background: 'red', color:'white', border: 'none', width:'100%', margin:'26px 0 10px'}} onClick={handleSignIn}/></Loading>
              <p><WrapperTextLight>Quên mật khẩu</WrapperTextLight></p> 
              <p onClick={handleNavigateSignUp} style={{cursor: 'pointer'}} disabled={!email.length || !password.length}>Chưa có tài khoản ? <WrapperTextLight>Tạo tài khoản</WrapperTextLight></p>
          </WrapperContainerLeft>
        <WrapperContainerRight>
            <Image src={ImageLogo} preview={false} alt='Image-logo' height='203px' width='203px'/>
            <h4>Mua sắm tại Nvam</h4>
        </WrapperContainerRight>
      </div>
    </div>
  )
}

export default SignInPage