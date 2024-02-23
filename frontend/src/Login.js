import React,{useState, useEffect} from 'react'
import {Button} from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import Header from './Header'; 
function Login() {
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const navigation = useNavigate();

  useEffect(()=>{
    if(localStorage.getItem('user-info'))
    {
      navigation('/customer')
    }
  },[]);
 function clear(){
  setEmail('');
  setPassword('');
 }
  async function logIn(){
    if (!email || !password) {
      console.error('Please fill in all fields');
      return;
  }
  const item = {email,password};
  try {
    let result =await fetch("http://localhost:8000/api/login",{

    method:"post",
    body:JSON.stringify(item),
    headers:{"Content-Type":"application/json"}
    }    );
    result = await result.json();
    localStorage.setItem('user-info', JSON.stringify(result));
    navigation('/customer');
  }catch (error) {
    console.error('Error logging in:', error.message);
}
  }

  return (
    <>
    <Header/>
    <div className='col-sm-4 offset-sm-4'>
      <h1>Login Page</h1><br/>
      
      <input type="email" className='form-control' placeholder='email' value={email} onChange={(e)=>setEmail(e.target.value)}/> <br/>
      <input type="password" className='form-control' placeholder='password' value={password} onChange={(e)=>setPassword(e.target.value)}/> <br/>
   
      <Button onClick={logIn}> submit</Button> 
      <Button onClick={clear} className='can'> cancel</Button>
    </div>
    </>
  )
}

export default Login
