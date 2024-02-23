import { useNavigate } from 'react-router-dom'
import React,{ useEffect} from 'react'


function Protected(props) {
    const navigation = useNavigate();
    useEffect(()=>{
      if(localStorage.getItem('user-info'))
      {
      //  navigation('/')
      }
    },[])
    let Cmp = props.cmp
 

  return (
    <div>
  
      <Cmp/>
    </div>
  )
}

export default Protected
