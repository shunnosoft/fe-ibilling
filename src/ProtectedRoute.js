import React from 'react'
import { Route, Redirect } from 'react-router-dom'

const ProtectedRoute = (props) => {
  let allData = props
  let { auth, component: Component, ...rest } = allData
  return (
    <Route
      {...rest}
      render={(props) => {
        if (auth) return <Component {...props} />
        if (!auth) return <Redirect to={{ path: '/', state: { from: rest.location } }} />
      }}
    />
  )
}

export default ProtectedRoute
