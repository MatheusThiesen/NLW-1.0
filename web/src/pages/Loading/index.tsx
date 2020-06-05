import React from 'react';
import { FiCheckCircle } from 'react-icons/fi';

function Loading() {
  return(
    <div style={{
      position: 'absolute',
      zIndex: 500000000000,
      backgroundColor:"#000",
      width: '100%',
      height: '100%',
      display:'flex',
      justifyContent: 'center',
      alignItems: 'center',
      opacity: 0.9 ,
      flexDirection: 'column',
      top: '151%'    
    }}>
    <FiCheckCircle style={{opacity: 1}} size='10vh' color='#2FB84f' />
    <strong style={{color: '#fff', fontSize: '3vh', marginTop: 30}}>Cadastro concluido !</strong>
    
    </div>
  )
}

export default Loading;