import axios from 'axios';

import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_PROFILE
  } from './types';
import { setAlert } from './alertActions'
import AuthToken from '../utils/AuthToken';
import backendCall from '../utils/backendCall';

//* load user

export const loadUser = () => async dispatch => {
    if (localStorage.token) {
      AuthToken(localStorage.token)
    }
    
    try {
      const config = {headers: {"x-auth-token": `${localStorage.token}`}}
      const res = await backendCall('/api/auth', config)
    //   console.log(res.data.data.user)
      dispatch({
        type: USER_LOADED,
        payload: res.data
      })
    } catch (err) {
      dispatch({
        type: AUTH_ERROR
      })
    }
}



//* register user

export const register = ({ name, email, password }) => async dispatch => {
    const config = {
        headers: { 
            "Content-Type": "application/json"
        }
    }

    const body = JSON.stringify({ name, email, password })

    try {
      const res = await axios.post('/api/users', body, config)
      // console.log(res)
      dispatch({ 
        type: REGISTER_SUCCESS,
        payload: res.data
       })
       dispatch(loadUser())
    } catch (err) {
        // console.log(err.response.data.error)
        const error = err.response
        // console.log(err)
        if (error) {
          dispatch(setAlert(error.data.error, 'danger', 2000))
        }
        dispatch({ 
            type: REGISTER_FAIL
           })
    }
    
} 



//* login user

export const login = (email, password) => async dispatch => {
    const config = {
        headers: { 
            "Content-Type": "application/json"
        }
    }

    const body = JSON.stringify({ email, password })
    try {
      const res = await backendCall.post('/api/users/login', body, config)
        // console.log(res)
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data
       })

       dispatch(loadUser())
    } catch (err) {
        // console.log(err.message)
        const error = err.response
        if (error) {
          dispatch(setAlert("please make sure that you are Signed-Up", 'danger', 2000))
        }
        dispatch({ 
            type: LOGIN_FAIL
           })
    }

}

//* logout => profiles too !!

export const logout = () => dispatch => {
  dispatch({type: CLEAR_PROFILE})
  dispatch({type: LOGOUT})
}