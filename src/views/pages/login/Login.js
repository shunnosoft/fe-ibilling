import React, { useState } from 'react'
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

const Login = () => {
  const [mobile, setMobile] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    const loginData = JSON.stringify({
      mobile: mobile,
      password: password,
    })
    const loginErrorMessage = document.querySelector('.loginErrorMessage')
    try {
      const response = await fetch('http://137.184.69.182/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: loginData,
      })
      const data = await response.json()
      if (data.code === 401 || data.code === 400) {
        loginErrorMessage.textContent = data.message
      }
      if ((data.user.role = 'ispOwner')) {
        window.location.href = '/dashboard'
      }
    } catch (err) {
      console.log('I am here: ', err)
    }
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
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
                      <CCol xs={6}>
                        <CButton color="primary" className="px-4" onClick={handleLogin}>
                          লগইন
                        </CButton>
                      </CCol>
                      {/* <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol> */}
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>নতুন অ্যাকাউন্ট তৈরি করুন</h2>
                    <p>
                      আমার বাংলা নিয়ে প্রথম কাজ করবার সুযোগ তৈরি হয়েছিল অভ্র^ নামক এক যুগান্তকারী
                      বাংলা সফ্‌টওয়্যার হাতে পাবার মধ্য দিয়ে।
                    </p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        রেজিস্ট্রেশন করুন
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
