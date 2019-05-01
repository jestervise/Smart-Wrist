import { LOGIN_SUCCESS,LOGIN_FAILED,TOGGLE_LIST_ON,TOGGLE_LIST_OFF } from "./actionTypes";

export const accountLoginSuccess =(provider)=>{
  return {type:LOGIN_SUCCESS,payload:{loginType:provider}};
}

export const accountLoginFailed =(provider)=>{
  return {type:LOGIN_FAILED,payload:{loginType:provider}};
}

export const toggleContactListOn =()=>{
  return {type:TOGGLE_LIST_ON};
}

export const toggleContactListOff =()=>{
  return {type:TOGGLE_LIST_OFF};
}
