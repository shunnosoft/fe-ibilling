import React, { Component } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './scss/style.scss'
import './app.css'
import { Redirect } from 'react-router'
import apiLink from './api/apiLink'

// import axios from 'axios'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)
// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Landing = React.lazy(() => import('./views/pages/landing/Landing'))
const Login = React.lazy(() => import('./views/pages/auth/login/Login'))
const Register = React.lazy(() => import('./views/pages/auth/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))
const Success = React.lazy(() => import('./views/pages/success/Success'))

// class App extends Component {
function App() {
  const checkTOken = JSON.parse(localStorage.getItem('token'))
  const [ploading, setpLoading] = useState(true)
  const history = useHistory()

  // update access token
  let updateToken = async () => {
    const response = await apiLink({
      url: '/v1/auth/refresh-tokens',
      method: 'POST',
      withCredentials: true,
    })
    const data = await response.data

    console.log('Latest access Token: ', data)

    if (data) {
      localStorage.setItem('token', JSON.stringify(data))
    } else {
      localStorage.removeItem('token')
      history.push('/')
    }
    if (ploading) {
      setpLoading(false)
    }
  }

  // refresh the access token
  useEffect(() => {
    if (checkTOken != undefined && ploading === true) {
      updateToken()
    }

    let reloadTime = 1000 * 60 * 9
    let interval = setInterval(() => {
      if (checkTOken) {
        // updateToken()
      }
    }, reloadTime)

    return () => clearInterval(interval)
  }, [ploading])

  return (
    <BrowserRouter>
      <React.Suspense fallback={loading}>
        <Switch>
          <Route
            exact
            path="/"
            name="Landing"
            render={(props) => (checkTOken ? <Redirect to="/dashboard" /> : <Landing {...props} />)}
          />
          <Route
            exact
            path="/login"
            name="Login Page"
            render={(props) => (checkTOken ? <Redirect to="/dashboard" /> : <Login {...props} />)}
          />
          <Route
            exact
            path="/register"
            name="Register Page"
            render={(props) =>
              checkTOken ? <Redirect to="/dashboard" /> : <Register {...props} />
            }
          />

          <Route
            exact
            path="/register/success"
            name="SuccessPage"
            render={(props) => (checkTOken ? <Redirect to="/dashboard" /> : <Success {...props} />)}
          />

          <Route exact path="/500" name="Page 500" render={(props) => <Page500 {...props} />} />

          <Route
            path="/dashboard"
            name="Home"
            render={(props) => (checkTOken ? <DefaultLayout {...props} /> : <Redirect to="/" />)}
          />

          {/* <ProtectedRoute
            auth={auth}
            path="/dashboard"
            name="Home"
            render={(props) => <DefaultLayout {...props} />}
            component={DefaultLayout}
          /> */}

          <Route name="Page 404" render={(props) => <Page404 {...props} />} />
        </Switch>
      </React.Suspense>
    </BrowserRouter>
  )
  // }
}

export default App
