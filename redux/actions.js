import { LOGIN_SUCCESS,LOGIN_FAILED } from "./actionTypes";

export const accountLoginSuccess =(provider)=>{
  return {type:LOGIN_SUCCESS,payload:{loginType:provider}};
}

export const accountLoginFailed =(provider)=>{
  return {type:LOGIN_FAILED,payload:{loginType:provider}};
}