import {TOGGLE_LIST_ON,TOGGLE_LIST_OFF} from "../actionTypes";

const initialState={
    isHidden:false
}

export default function(state = initialState, action) {
    switch (action.type) {
      case TOGGLE_LIST_ON: {
        console.log(action.type);
        return {isHidden:true}
      }
     
      case TOGGLE_LIST_OFF:
      console.log(action.type);
        return {isHidden:false}
    
      default:
        return state;
    }
  }