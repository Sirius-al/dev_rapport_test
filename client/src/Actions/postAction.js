import backendCall from '../utils/backendCall'
import { setAlert } from './alertActions'

import { setHeader } from '../utils/setter'
import { GET_POSTS, POST_ERROR, LIKE_POST, UNLIKE_POST, DELETE_POST, ADD_POST, GET_POST, ADD_COMMENT, REMOVE_COMMENT } from './types';




//******************************************************* get POSTS

export const getAllPosts = () => async dispatch => {
    
    try {
      const res = await backendCall.get('/api/posts/')
      // console.log(res.data)
      dispatch({type: GET_POSTS, payload: res.data})

    } catch (err) {
      // console.log(err)
      dispatch({type: POST_ERROR, payload: err.response})
    }
}


//******************************************************* LIKE

export const like = (postId, token) => async dispatch => {
    
    try {
      const res = await backendCall.patch(`/api/posts/like/${postId}`, null, setHeader(token))
      // console.log(res.data.data)
      dispatch({type: LIKE_POST, payload: { id: postId, likes: res.data.data }})

    } catch (err) {
      // console.log(err.data.data)
      if (err.response) {
        const error = err.response
        // console.log(err.response.data)
        return dispatch({type: POST_ERROR, payload: error.data})
      }
    }
}


//******************************************************* UNLIKE

export const unlike = (postId, token) => async dispatch => {
    
    try {
      const res = await backendCall.patch(`/api/posts/unlike/${postId}`, null, setHeader(token))
      // console.log(res.data.data)
      dispatch({type: UNLIKE_POST, payload: { id: postId, unlikes: res.data.data }})

    } catch (err) {
      if (err.response) {
        const error = err.response
        // console.log(err.response.data)
        return dispatch({type: POST_ERROR, payload: error.data})
      }
      // console.log(err.data.data)
    }
}


//******************************************************* Delete Post


export const deletePost = (id, token) => async dispatch => {
  

    try {
      await backendCall.delete(`/api/posts/del/${id}`, setHeader(token, 2))
      // console.log(res)
      dispatch({type: DELETE_POST, payload: id })
      dispatch(setAlert('Post Deleted !', 'success', 3000))

    } catch (err) {
      const error = err.response
        // console.log(err.response.data)

       dispatch({type: POST_ERROR, payload: error.data})
    }
}


//******************************************************* Add Post


export const createPost = (formData, token) => async dispatch => {
    
    try {
      const res = await backendCall.post(`/api/posts/`, formData, setHeader(token, 2))
      // console.log(res.data)
      dispatch({type: ADD_POST, payload: res.data.data })
      dispatch(setAlert('Post Created !', 'success', 3000))

    } catch (err) {
      const error = err.response
        // console.log(err.response)

       dispatch({type: POST_ERROR, payload: error.data})
      // console.log(err.data.data)
    }
}


//******************************************************* Get Single Post


export const getPost = (id) => async dispatch => {
    
    try {
      const res = await backendCall.get(`/api/posts/${id}`)
      // console.log(res.data)
      dispatch({type: GET_POST, payload: res.data })

    } catch (err) {
      const error = err.response
        // console.log(err.response)

       dispatch({type: POST_ERROR, payload: error.data})
      // console.log(err.data.data)
    }
}

//******************************************************* Add Comment


export const addComment = (postId, formData, token) => async dispatch => {
    
  try {
    const res = await backendCall.patch(`/api/posts/comment/${postId}`, formData, setHeader(token, 2))
    
    // console.log(res.data)
    dispatch({type: ADD_COMMENT, payload: res.data.data })
    dispatch(setAlert('Comment Added !', 'success', 3000))

  } catch (err) {
    const error = err.response
      // console.log(err.response)

     dispatch({type: POST_ERROR, payload: error.data})
    // console.log(err.data.data)
  }
}


//******************************************************* Delete Comment


export const removeComment = (postId, commentId, token) => async dispatch => {
    
  try {
    const res = await backendCall.delete(`/api/posts/comment/${postId}/${commentId}`, setHeader(token, 2))
    // console.log(res.data)
    dispatch({type: REMOVE_COMMENT, payload: commentId })
    dispatch(setAlert('Comment Deleted !', 'danger', 3000))

  } catch (err) {
    const error = err.response
      // console.log(err.response)

     dispatch({type: POST_ERROR, payload: error.data})
     dispatch(setAlert(`${error.data.message}`, 'danger', 3000))
    // console.log(err.data.data)
  }
}