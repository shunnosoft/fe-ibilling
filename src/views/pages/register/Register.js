import React from 'react'
import { CCard, CCardBody, CCol, CContainer, CRow } from '@coreui/react'
import { useState } from 'react'
import './register.css'
// import CIcon from '@coreui/icons-react'
// import { cilLockLocked, cilUser } from '@coreui/icons'

const Register = () => {
  const [company, setcompany] = useState('')
  const [name, setname] = useState('')
  const [mobile, setmobile] = useState('')
  const [email, setemail] = useState('')
  const [reference, setreference] = useState('')
  const [pack, setpack] = useState('')

  const handleForm = async () => {
    // send Objecet
    const sendObjData = {
      company: company,
      name: name,
      mobile: mobile,
      email: email,
      reference: reference,
      pack: pack,
    }
    console.log(sendObjData)
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <form action="" id="registerForm" className="fromStyle">
                  <h1>রেজিস্ট্রেশন </h1>
                  <p className="text-medium-emphasis">নতুন অ্যাকাউন্ট তৈরি করুন</p>
                  <div className="company inputClass">
                    <label htmlFor="company">Company *</label>
                    <input
                      required
                      type="text"
                      onChange={(e) => setcompany(e.target.value)}
                      name="company"
                    />
                  </div>
                  <div className="name inputClass">
                    <label htmlFor="name">Name *</label>
                    <input
                      required
                      type="text"
                      onChange={(e) => setname(e.target.value)}
                      name="name"
                    />
                  </div>
                  <div className="mobile inputClass">
                    <label htmlFor="mobile">Mobile *</label>
                    <input
                      required
                      type="text"
                      onChange={(e) => setmobile(e.target.value)}
                      name="mobile"
                    />
                  </div>
                  <div className="email inputClass">
                    <label htmlFor="email">Email *</label>
                    <input
                      required
                      type="email"
                      onChange={(e) => setemail(e.target.value)}
                      name="email"
                    />
                  </div>
                  <div className="reference inputClass">
                    <label htmlFor="reference">Reference</label>
                    <input
                      type="text"
                      onChange={(e) => setreference(e.target.value)}
                      name="reference"
                    />
                  </div>
                  <div className="company inputClass">
                    <label htmlFor="company">Package *</label>
                    <select
                      className="form-select"
                      onChange={(e) => setpack(e.target.value)}
                      name="packages"
                    >
                      <option defaultValue>Basic</option>
                      <option value="bronze">Bronze</option>
                      <option value="silver">Silver</option>
                      <option value="gold">Gold</option>
                      <option value="platinum">Platinum</option>
                      <option value="diamond">Diamond</option>
                      <option value="gold">Gold</option>
                      <option value="old">Old</option>
                      <option value="p1">P1</option>
                      <option value="p2">P2</option>
                      <option value="p3">P3</option>
                      <option value="p4">P4</option>
                    </select>
                  </div>

                  <div className="submit">
                    <input
                      required
                      type="button"
                      name="submit"
                      className="submitBtn"
                      value="অ্যাকাউন্ট তৈরি করুন"
                      onClick={handleForm}
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
