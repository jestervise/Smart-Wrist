import { combineReducers } from "redux";
import loginAuthentication from "./loginAuthentication";
import toggleContactList from "./toggleContactList"

export default combineReducers({ loginAuthentication,toggleContactList});