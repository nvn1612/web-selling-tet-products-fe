import React, { Fragment, useEffect, useState } from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import {routes} from './routes'
import DefaultComponent from './components/DefaultComponent/DefaultComponent'
import { isJsonString } from './ultis';
import * as UserService from './service/UserService'
import { resetUser, updateUser } from './redux/slides/userSlide'
import { useDispatch, useSelector } from 'react-redux'
import { jwtDecode } from "jwt-decode";
import Loading from './components/LoadingComponent/LoadingComponent';

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user)
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    setIsLoading(true)
    const {storageData, decoded} = handleDecoded()
    if(decoded?.id)
      {
        handleGetDetailsUser(decoded?.id,storageData)
      }
      setIsLoading(false)
  },[])

  const handleDecoded = () =>{
    let storageData = localStorage.getItem('access_token')
    let decoded = {}
    if(storageData && isJsonString(storageData))
      {
        storageData =  JSON.parse(storageData)  
        decoded = jwtDecode(storageData) 
      }
      return {decoded, storageData: storageData || null }
  }

  UserService.axiosJWT.interceptors.request.use( async (config) => {
    const currentTime = new Date()
    const {decoded} = handleDecoded()
    let storageRefreshToken = localStorage.getItem('refresh_token')
    const refreshToken = JSON.parse(storageRefreshToken)  
    const decodedRefreshToken = jwtDecode(refreshToken)
    if(decoded?.exp < currentTime.getTime() / 1000){
      if(decodedRefreshToken?.exp > currentTime.getTime() / 1000)
        {
          const data = await UserService.refreshToken(refreshToken)
          config.headers['token'] = `Bearer ${data?.access_token}`
        } else {
          dispatch(resetUser())
        }
    }
    return config;
  },  (err) => {
    return Promise.reject(err)
  })

  const handleGetDetailsUser = async (id, token) => {
    try {
      let storageRefreshToken = localStorage.getItem('refresh_token')
      const refreshToken = JSON.parse(storageRefreshToken)
      const res = await UserService.getDetailUser(id, token);
      dispatch(updateUser({ ...res?.data, access_token: token, refreshToken: refreshToken}));
    } catch (err) {
      console.error('Failed to fetch user details:', err);
    }
  };
  return (
    <div>
      <Loading isLoading={isLoading}>
        <Router>
          <Routes>
              {routes.map((route)=>{
                const Page = route.page
                const isCheckAuth = !route.isPrivate || user.isAdmin
                const Layout =route.isShowHeader ? DefaultComponent : Fragment
                return (
                  <Route key={route.path} path={isCheckAuth ? route.path : undefined} element={
                  <Layout>
                      <Page/>
                  </Layout>
                  } />
                )
              })}
          </Routes>
        </Router>
      </Loading>
    </div>
  )
}
export default App;