import {LOGIN_SUCCESS,LOGIN_FAILED} from "../actionTypes";

const initialState={
    loginSucess:false,
    loginType:"placeholder"
}

export default function(state = initialState, action) {
    switch (action.type) {
      case LOGIN_SUCCESS: {
        console.log(LOGIN_SUCCESS);
        return {loginSucess:true,loginType:action.payload.loginType}
      }
     
      case LOGIN_FAILED:
      console.log(LOGIN_FAILED);
        return {loginSucess:false,loginType:action.payload.loginType}
    
      default:
        return state;
    }
  }