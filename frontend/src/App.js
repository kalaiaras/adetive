
import './App.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Home from './Home';
import Protected from './Protected';
import Services from './Services';
import Invoice from './Invoice';
import Customer from './Customer';
function App() {
  return (
    <div className="App">
      

      
      <Router>
        <Routes>
         <Route path="/" element={<Protected cmp={Home} />}></Route>
         <Route path="/customer" element={<Protected cmp={Customer} />}></Route>
         <Route path="/service" element={<Protected cmp={Services} />}></Route>
         <Route path="/invoice/:id?" element={<Protected cmp={Invoice} />}></Route>
          <Route path="/login" element={<Login/>}></Route>
          <Route path="/register" element={<Register/>}></Route>
          <Route path='/*' element={<h1> 404 page not found</h1>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
