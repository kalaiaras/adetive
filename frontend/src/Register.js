import React,{useState, useEffect} from 'react'
import {Button} from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import Header from './Header';

function Register() {
  const [username,setUserName]= useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const navigation = useNavigate();
  useEffect(()=>{
    if(localStorage.getItem('user-info'))
    {
      navigation('/customer')
    }
  },[])
  function clear(){
    setEmail('');
    setPassword('');
    setUserName('');
   }
 
  async function signup(){

  
    if (!username || !email || !password) {
      alert('Please fill in all fields');
      return;
  }

 
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
      alert('Please enter a valid email address');
      return;
  }


   if (password.length < 6) {
    alert('Password must be at least 6 characters long');
    return;
}
try {
  const item ={username,  email, password};
   let result = await fetch("http://localhost:8000/api/register",{
      method:"post",
      body: JSON.stringify(item),
      headers:{"Content-Type":"applications/json"}
    });
      result = await result.json();
      console.log(result)
      if(result.id){
    localStorage.setItem("user-info",JSON.stringify(result))
    navigation('/customer');
      }

  }
  catch (error) {
    alert('Error signing up:', error.message);
}
  }
  return (
    <>
    <Header/>
    <div className='col-sm-4 offset-sm-4'>
      <h1>Register Page</h1><br/>
      <input type="text" className='form-control' value={username} placeholder='user Name' onChange ={(e)=> setUserName(e.target.value)}/> <br/>
      <input type="email" className='form-control' placeholder='email' value={email} onChange={(e)=>setEmail(e.target.value)}/> <br/>
      <input type="password" className='form-control' placeholder='password' value={password} onChange={(e)=>setPassword(e.target.value)}/> <br/>
   
      <Button onClick={signup}> submit</Button>
      <Button onClick={clear} className='can'> cancel</Button>
    </div>
    </>
  )
}

export default Register
