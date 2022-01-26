import React, { useState, useEffect, useReducer, useContext } from 'react'

import Card from '../UI/Card/Card'
import classes from './Login.module.css'
import Button from '../UI/Button/Button'
import AuthContext from '../../store/auth-context'

const emailReducer = (state, action) => {
  if (action.type === 'USER_INPUT') {
    return { value: action.val, isValid: action.val.includes('@') }
  }
  if (action.type === 'INPUT_BLUR') {
    return { value: state.value, isValid: state.value.includes('@') }
  }
  return { value: '', isValid: false }
}

const passwordReducer = (state, action) => {
  if (action.type === 'USER_INPUT') {
    return { value: action.val, isValid: action.val.trim().length > 6 }
  }
  if (action.type === 'INPUT_BLUR') {
    return { value: state.value, isValid: state.value.trim().length > 6 }
  }
  return { value: '', isValid: false }
}

const Login = (props) => {
  // const [enteredEmail, setEnteredEmail] = useState('')
  // const [emailIsValid, setEmailIsValid] = useState()
  // const [enteredPassword, setEnteredPassword] = useState('')
  // const [passwordIsValid, setPasswordIsValid] = useState()
  const [formIsValid, setFormIsValid] = useState(false)

  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: '',
    isValid: null,
  })

  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: '',
    isValid: null,
  })

  const authCtx = useContext(AuthContext)

  const {isValid: emailIsValid} = emailState
  const {isValid: passwordIsValid} = passwordState

  useEffect(() => {
    const identifier = setTimeout(() => {
      console.log('checking 500')
      setFormIsValid(
        emailIsValid && passwordIsValid
      )
    }, 500)

    return () => {
      console.log('CLEANUP')
      clearTimeout(identifier)
    }
  }, [emailIsValid, passwordIsValid])

  // setTimeout executes as many times as keystrokes (because of the dependencies), but after the specified
  // interval. So clearTimeout is used to clear the old timeouts (CLEANUP function)and execute only the last
  // timeout, because cleanup function runs before every new sideEffect function execution and when the
  // component is removed from DOM, and does not run before the first sideEffect function execution.

  const emailChangeHandler = (event) => {
    dispatchEmail({ type: 'USER_INPUT', val: event.target.value })
    // setEnteredEmail(event.target.value)
    // setFormIsValid(event.target.value.includes('@') && passwordState.isValid)
  }

  const passwordChangeHandler = (event) => {
    dispatchPassword({ type: 'USER_INPUT', val: event.target.value })
    // setEnteredPassword(event.target.value)
    // setFormIsValid(emailState.isValid && event.target.value.trim().length > 6)
  }

  const validateEmailHandler = () => {
    dispatchEmail({ type: 'INPUT_BLUR' })
    // setEmailIsValid(emailState.isValid)
  }

  const validatePasswordHandler = () => {
    dispatchPassword({ type: 'INPUT_BLUR' })

    // setPasswordIsValid(enteredPassword.trim().length > 6)
  }

  const submitHandler = (event) => {
    event.preventDefault()
    authCtx.onLogin(emailState.value, passwordState.value)
  }

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <div
          className={`${classes.control} ${
            emailState.isValid === false ? classes.invalid : ''
          }`}
        >
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            value={emailState.value}
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
          />
        </div>
        <div
          className={`${classes.control} ${
            passwordState.isValid === false ? classes.invalid : ''
          }`}
        >
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={passwordState.value}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
          />
        </div>
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  )
}

export default Login
