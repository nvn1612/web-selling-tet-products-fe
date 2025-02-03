import React, { useEffect, useState } from 'react'
import { WrapperHeader,WrapperContentProfile,WrapperLable,WrapperInput,WrapperUploadFile } from './style'
import InputForm from '../../components/InputForm/InputForm'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import { useDispatch, useSelector } from 'react-redux'
import * as UserService from '../../service/UserService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import Loading from '../../components/LoadingComponent/LoadingComponent'
import * as message from "../../components/Message/Message"
import { updateUser } from '../../redux/slides/userSlide'
import { Button } from 'antd'
import { UploadOutlined } from '@ant-design/icons';
import { getBase64 } from '../../ultis'



const ProfilePage = () => {
  const user = useSelector((state) => state.user)
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  
  const [avatar, setAvatar] = useState('');
  const dispatch = useDispatch()
  
  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
      setName(user.name || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
      setAvatar(user.avatar || '');
    }
  }, [user]);
  
  
  
  const mutation = useMutationHooks(
    (data) => {
      const {id, access_token, ...rest} = data
      UserService.updateUser(id, rest, access_token)
    }
  )
  const handleGetDetailUser = async (id, token) => {
    const res = await UserService.getDetailUser(id,token)
    dispatch(updateUser({...res?.data, access_token: token}))
  }
  
  const {data, isPending, isSuccess, isError} = mutation
  
  useEffect(() => {
    if(isSuccess) {
      message.success()
      handleGetDetailUser(user?.id,user?.access_token)
    }else if (isError) {
      message.error()
    }

  }, [isSuccess, isError])
  const handleOnchangeEmail = (value) =>{
    setEmail(value)
  }
  const handleOnchangeName = (value) =>{
    setName(value) 
  }
  const handleOnchangePhone = (value) =>{
    setPhone(value) 
  }
  const handleOnchangeAddress = (value) =>{
    setAddress(value) 
  }
  const handleOnchangeAvatar = async({fileList}) =>{
    const file = fileList[0]
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setAvatar(file.preview)
  }
  const handleUpdate = () =>{
    mutation.mutate({id : user?.id, email, name,phone, address, avatar,access_token: user?.access_token})
   
  }
  return (
    <div style={{width: '1270px', margin:'0 auto', height:'500px'}} >
        <WrapperHeader >THÔNG TIN NGƯỜI DÙNG</WrapperHeader>
        <Loading isLoading={isPending}>
          <WrapperContentProfile>
            <WrapperInput>
              <WrapperLable htmlFor='name'>Name</WrapperLable>
              <InputForm placeholder={'nambnbn'} style={{width:'300px'}}  value={name} onChange={handleOnchangeName} id="name"/>
              <ButtonComponent textbutton={'Cập nhập'} styleButton={{background: 'white' }} onClick={handleUpdate}/>
            </WrapperInput>
            <WrapperInput>
              <WrapperLable htmlFor='email'>Email</WrapperLable>
              <InputForm placeholder={'abc123@gmail.com'} style={{width:'300px'}}  value={email} onChange={handleOnchangeEmail} id="email"/>
              <ButtonComponent textbutton={'Cập nhập'} styleButton={{background: 'white' }} onClick={handleUpdate}/>
            </WrapperInput>
            <WrapperInput>
              <WrapperLable htmlFor='phone'>Phone</WrapperLable>
              <InputForm placeholder={'0927384372'} style={{width:'300px'}}  value={phone} onChange={handleOnchangePhone} id="phone"/>
              <ButtonComponent textbutton={'Cập nhập'} styleButton={{background: 'white' }} onClick={handleUpdate}/>
            </WrapperInput>
            <WrapperInput>
              <WrapperLable htmlFor='address'>Address</WrapperLable>
              <InputForm placeholder={'thanh xuan ha noi'} style={{width:'300px'}}  value={address} onChange={handleOnchangeAddress} id="address"/>
              <ButtonComponent textbutton={'Cập nhập'} styleButton={{background: 'white' }} onClick={handleUpdate}/>
            </WrapperInput>
            <WrapperInput>
              <WrapperLable htmlFor='avatar'>Avatar</WrapperLable>
              <WrapperUploadFile onChange={handleOnchangeAvatar} maxCount={1}>
                <Button icon={<UploadOutlined/>}>
                </Button>
              </WrapperUploadFile>
              {avatar &&(
                <img src={avatar} 
                style={{height: '60px',
                  width: '60px',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }} alt="avatar"/>
              )}
              {/* <InputForm placeholder={''} style={{width:'300px'}}  value={avatar} onChange={handleOnchangeAvatar} id="avatar"/> */}
              <ButtonComponent textbutton={'Cập nhập'} styleButton={{background: 'white' }} onClick={handleUpdate}/>
            </WrapperInput>
          </WrapperContentProfile>
        </Loading>
    </div>
  )
}

export default ProfilePage