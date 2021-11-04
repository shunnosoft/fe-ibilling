import React from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import './register.css'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'

const Register = () => {
  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <form action="" className="fromStyle">
                  <h1>রেজিস্ট্রেশন </h1>
                  <p className="text-medium-emphasis">নতুন অ্যাকাউন্ট তৈরি করুন</p>
                  <div className="company inputClass">
                    <label htmlFor="company">Company *</label>
                    <input required type="text" name="company" />
                  </div>
                  <div className="name inputClass">
                    <label htmlFor="name">Name *</label>
                    <input required type="text" name="name" />
                  </div>
                  <div className="mobile inputClass">
                    <label htmlFor="mobile">Mobile *</label>
                    <input required type="text" name="mobile" />
                  </div>
                  <div className="email inputClass">
                    <label htmlFor="email">Email *</label>
                    <input required type="email" name="email" />
                  </div>
                  <div className="reference inputClass">
                    <label htmlFor="reference">Reference</label>
                    <input type="text" name="reference" />
                  </div>
                  <div className="company inputClass">
                    <label htmlFor="company">Package *</label>
                    <select className="form-select" aria-label="Default select example">
                      <option selected>Basic</option>
                      <option value="1">Bronze</option>
                      <option value="2">Silver</option>
                      <option value="3">Gold</option>
                      <option value="3">Platinum</option>
                      <option value="3">Diamond</option>
                      <option value="3">Gold</option>
                      <option value="3">Old</option>
                      <option value="3">P1</option>
                      <option value="3">P1</option>
                      <option value="3">P2</option>
                      <option value="3">P3</option>
                      <option value="3">P4</option>
                    </select>
                  </div>

                  <div className="submit">
                    <input
                      required
                      type="submit"
                      name="submit"
                      className="submitBtn"
                      value="অ্যাকাউন্ট তৈরি করুন"
                    />
                  </div>
                </form>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
