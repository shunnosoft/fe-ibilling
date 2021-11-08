import React, { Component } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import './scss/style.scss'
import './app.css'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Landing = React.lazy(() => import('./views/pages/landing/Landing'))
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))
const Success = React.lazy(() => import('./views/pages/success/Success'))

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <React.Suspense fallback={loading}>
          <Switch>
            <Route exact path="/" name="Landing" render={(props) => <Landing {...props} />} />
            <Route exact path="/login" name="Login Page" render={(props) => <Login {...props} />} />
            <Route
              exact
              path="/register"
              name="Register Page"
              render={(props) => <Register {...props} />}
            />

            <Route
              exact
              path="/register/success"
              name="SuccessPage"
              render={(props) => <Success {...props} />}
            />

            <Route exact path="/500" name="Page 500" render={(props) => <Page500 {...props} />} />
            <Route
              exact
              path="/dashboard"
              name="Home"
              render={(props) => <DefaultLayout {...props} />}
            />
            <Route name="Page 404" render={(props) => <Page404 {...props} />} />
          </Switch>
        </React.Suspense>
      </BrowserRouter>
    )
  }
}

export default App
