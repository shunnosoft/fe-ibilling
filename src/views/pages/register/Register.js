import React from 'react'
import { CCard, CCardBody, CCol, CContainer, CRow } from '@coreui/react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import './register.css'

/*
reference: {
  name: {
    type: String,
  },
  mobile: {
    type: String,
  },
  type: {
    type: String,
    enum: ['staff', 'distributor', 'other', 'client'],
    default: 'other',
  },
  objId: {
    type: String,
  },
},
*/

const Register = () => {
  const [company, setcompany] = useState('')
  const [name, setname] = useState('')
  const [mobile, setmobile] = useState('')
  const [email, setemail] = useState('')
  const [reference, setreference] = useState('')
  const [pack, setpack] = useState('')

  const handleForm = async (e) => {
    e.preventDefault()

    const sendObjData = JSON.stringify({
      company: company,
      name: name,
      mobile: mobile,
      email: email,
      // reference: reference,
      pack: pack,
    })
    try {
      const response = await fetch(`http://137.184.69.182/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: sendObjData,
      })

      const data = await response.json()
      const errorBox = document.getElementById('redError')
      if (data.message) {
        console.log('There is an error!')
        errorBox.textContent = data.message
      } else {
        errorBox.textContent = ''
      }
      if (data.paymentUrl) {
        // link open in same tab
        window.location.href = data.paymentUrl

        // if want to open in new tab
        // window.open(data.paymentUrl, '_blank')
      }
    } catch (err) {
      console.log('There is an error: ', err)
    }
  }

  return (
    <>
      <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md={9} lg={7} xl={6}>
              <CCard className="mx-4">
                <CCardBody className="p-4">
                  <form action="" id="registerForm" className="fromStyle" onSubmit={handleForm}>
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
                        required
                        className="form-select"
                        onChange={(e) => setpack(e.target.value)}
                        name="packages"
                      >
                        <option defaultValue>Select a Packege</option>
                        <option value="Basic">Basic</option>
                        <option value="Bronze">Bronze</option>
                        <option value="Silver">Silver</option>
                        <option value="Gold">Gold</option>
                        <option value="Platinum">Platinum</option>
                        <option value="Diamond">Diamond</option>
                        <option value="Old">Old</option>
                        <option value="P1">P1</option>
                        <option value="P2">P2</option>
                        <option value="P3">P3</option>
                        <option value="P4">P4</option>
                      </select>
                    </div>

                    <div className="ShouErrorMessage">
                      <p id="redError"></p>
                    </div>

                    <div className="submit">
                      <button required type="submit" name="submit" className="submitBtn">
                        অ্যাকাউন্ট তৈরি করুন
                      </button>
                    </div>
                  </form>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    </>
  )
}

export default Register
