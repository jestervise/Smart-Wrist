import React from 'react'
import {TouchableWithoutFeedback,Keyboard } from 'react-native';

export default ({children})=>(<TouchableWithoutFeedback style={{zIndex:100}}onPress={Keyboard.dismiss}  accessible={false}>
  {children}
</TouchableWithoutFeedback>);