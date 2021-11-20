import React, { useState } from 'react'
import { CCard, CCardBody, CCol, CContainer, CRow } from '@coreui/react'
import './register.css'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAsyncUserData, getRegisterResponse } from '../../../../featears/users/userRegister'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { inputs } from './formData/Inputs'
import FormInput from './formData/FormInput'
import { Link, useHistory } from 'react-router-dom'
import { Redirect } from 'react-router'

const Register = () => {
  const history = useHistory()
  // const [redirectToPayment, setRedirectToPayment] = useState(false);
  const [values, setValues] = useState({
    company: '',
    name: '',
    mobile: '',
    email: '',
    // reference: '',
    pack: '',
  })
  const dispatch = useDispatch()
  // const usersData = useSelector(getRegisterResponse)

  const handleForm = async (e) => {
    e.preventDefault()
    const loader = document.querySelector('.Loader')
    loader.style.display = 'block'
    const response = await dispatch(fetchAsyncUserData(values))

    // show error message
    if (response.payload === undefined) {
      loader.style.display = 'none'
      // call toast
      toast.error('Server error!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    } else {
      // go to payment url
      window.location.href = response.payload.paymentUrl
    }
  }

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
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
            <CCol md={9} lg={7} xl={6}>
              <CCard className="mx-4">
                <CCardBody className="p-4">
                  <form id="registerForm" className="fromStyle" onSubmit={handleForm}>
                    <h1>রেজিস্ট্রেশন </h1>
                    <p className="text-medium-emphasis">নতুন অ্যাকাউন্ট তৈরি করুন</p>
                    {inputs.map((input) => (
                      <FormInput
                        key={input.id}
                        {...input}
                        value={values[input.name]}
                        onChange={onChange}
                      />
                    ))}
                    <div className="submit">
                      <button className="submitBtn">অ্যাকাউন্ট তৈরি করুন</button>
                      <Link to="/" className="RegisterToHomeButton">
                        বাতিল
                      </Link>
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
