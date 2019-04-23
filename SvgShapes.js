import {Svg,Circle,Text,Defs,TSpan,LinearGradient,Stop} from 'react-native-svg'
import React from 'react';

export const MiddleCircle=()=>{
    return <Svg height={150} width={150} style={{alignItems:'center',position:'relative',top:'30%'}}>
          
    <Circle
      cx={75}
      cy={75}
      r={75}
      strokeWidth={2}
      stroke="#fff"
      fill="url(#grad)"
    />
    <Text x="75"
      y="75"
      fill="white"
      fontSize="48"
      fontWeight="bold"
      textAnchor="middle" style={{}}>
      <TSpan  >253</TSpan>
      <TSpan x="75" dy="20" fontSize="14">Heart Rate/</TSpan>
      <TSpan x="75" dy="25" fontSize="14">Bpm</TSpan>
    </Text>
    <Defs>
        <LinearGradient id="grad" x1="0" y1="0" x2="75" y2="150">
            <Stop offset="0" stopColor="#FF4B23" stopOpacity="1" />
            <Stop offset="1" stopColor="#9A240A" stopOpacity="0" />
        </LinearGradient>
    </Defs>
  
    </Svg>
  }