import React, { useState, useEffect } from 'react'
import './login.css'
import { Link } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { useDispatch, useSelector } from 'react-redux'
import userInfo, { fetchUserInfo, getUserInfo } from 'src/featears/users/userInfo'
// react toast
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
// import apiLink from 'src/api/apiLink'
// import axios from 'axios'

const Login = () => {
  const [mobile, setMobile] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()
  const UserInfoIsHere = useSelector(getUserInfo)

  // handle error
  useEffect(() => {
    if (UserInfoIsHere === undefined) {
      toast.error('Server error !!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    } else {
      console.log('From login: ', UserInfoIsHere)
    }
  }, [UserInfoIsHere])

  const handleLogin = async () => {
    const loginData = {
      mobile: mobile,
      password: password,
    }

    if (mobile.length === 0 || password.length === 0) {
      toast.error('মোবাইল আর পাসওয়ার্ড দিন  !!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
      return
    }
    await dispatch(fetchUserInfo(loginData))
      .then((res) => localStorage.setItem('token', JSON.stringify(res.payload.access)))
      .then(() => (window.location.href = '/dashboard'))
      .catch((err) => console.log('There is an error for login: ', err))
  }

  return (
    <>
      <div className="Loader"></div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        colored
      />
      <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md={8}>
              <CCardGroup className="loginWidth">
                <CCard className="p-4">
                  <CCardBody>
                    <CForm>
                      <h1>লগইন </h1>
                      <p className="text-medium-emphasis">আপনার একাউন্ট এ প্রবেশ করুন </p>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilUser} />
                        </CInputGroupText>
                        <CFormInput
                          placeholder="মোবাইল"
                          autoComplete="username"
                          onChange={(e) => setMobile(e.target.value)}
                        />
                      </CInputGroup>
                      <CInputGroup className="mb-4">
                        <CInputGroupText>
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>
                        <CFormInput
                          type="password"
                          placeholder="পাসওয়ার্ড"
                          autoComplete="current-password"
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </CInputGroup>
                      <p className="loginErrorMessage"></p>
                      <CRow>
                        <CCol xs={7}>
                          <CButton color="primary" className="px-4" onClick={handleLogin}>
                            লগইন
                          </CButton>
                          <Link to="/">
                            <CButton color="secondary" className="px-4 margin-left">
                              বাতিল
                            </CButton>
                          </Link>
                        </CCol>

                        <CCol xs={5} className="text-right">
                          <CButton color="link" className="px-0">
                            পাসওয়ার্ড ভুলে গেছেন?
                          </CButton>
                        </CCol>
                      </CRow>
                    </CForm>
                  </CCardBody>
                </CCard>
              </CCardGroup>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    </>
  )
}

export default Login
