import React, { useState, useEffect } from 'react';
import Header from './Header';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import axios from 'axios';
let user = JSON.parse(localStorage.getItem('user-info'));
function Services() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [rate, setRate] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [customerOptions, setCustomerOptions] = useState([]);
  const [services, setServices] = useState([]);
  const [id, setId] = useState('');
  const [strid, setStrId]= useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.id) {
      fetchCustomers();
    }
  }, []);
 
  async function choosecustomer(e) {
    setCustomerId(e.target.value);
    servicerec(e.target.value);
    localStorage.setItem("customer_id",JSON.stringify(e.target.value));
  }

  async function updateService(serviceId) {
    try {
      const response = await axios.get(`http://localhost:8000/api/services/spec/${serviceId}`);
      const serviceData = response.data;
      setDescription(serviceData.description);
      setName(serviceData.name);
      setRate(serviceData.rate);
      setCustomerId(serviceData.customer_id);
      setId(serviceData.id);
    } catch (error) {
      console.error('Error fetching service details:', error.message);
    }
  }

  async function deleteService(serviceId) {
    try {
      await axios.delete(`http://localhost:8000/api/services/${serviceId}`);
      let custid = JSON.parse(localStorage.getItem('customer_id'));
     
     servicerec(custid);
    } catch (error) {
      console.error('Error deleting service:', error.message);
    }
  }

  async function storeinvoice() {
    let custid = JSON.parse(localStorage.getItem('customer_id'));
    const data = {
      tax: "00",
      discount: "00",
      customer_id: custid
    };
    
    try {
      const response =  await axios.post(`http://localhost:8000/api/invoices/`, data);
      const result = response.data;
      console.log(result.invoice.id)
      navigate(`/invoice/${result.invoice.id}`);
    } catch (error) {
      console.error('Error updating invoice:', error.message);
    }
  }

  async function servicerec(cid) {
    try {
      const response = await axios.get(`http://localhost:8000/api/services/${cid}`);
      const result = response.data;
      setServices(result);
    } catch (error) {
      console.error('Error fetching services:', error.message);
    }
  }

  async function fetchCustomers() {
    try {
      const response = await axios.get(`http://localhost:8000/api/customers/${user.id}`);
      const customerData = response.data;
      setCustomerOptions(customerData.map(customer => ({ value: customer.id, label: customer.customer_name })));
    } catch (error) {
      console.error('Error fetching customers:', error.message);
    }
  }

  async function addservice() {
    const serviceData = { name, description, rate, customer_id: customerId };
    try {
      if (id === '') {
        await axios.post(`http://localhost:8000/api/services/`, serviceData);
      } else {
        await axios.put(`http://localhost:8000/api/services/${id}`, serviceData);
      }
      setDescription('');
      setName('');
      setRate('');
      setCustomerId('');
      setId('');
      servicerec(customerId);
      setStrId(customerId);
      
    } catch (error) {
      console.error('Error adding service:', error.message);
    }
  }

  return (
    <>
      <Header />
      <div className='col-sm-4 offset-sm-4'>
        <h1>Add Service</h1><br />
        <select className='form-control' value={customerId} onChange={choosecustomer}>
          <option value="">Select Customer</option>
          {customerOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <br />
        <input type="text" className='form-control' value={name} placeholder='Service name' onChange={(e) => setName(e.target.value)} /> <br />
        <input type="text" className='form-control' placeholder='Description' value={description} onChange={(e) => setDescription(e.target.value)} /> <br />
        <input type="text" className='form-control' placeholder='Rate' value={rate} onChange={(e) => setRate(e.target.value)} /> <br />
        
        <br />
        <Button onClick={addservice}>Submit</Button>&nbsp;&nbsp;&nbsp;
        <Button onClick={storeinvoice}>Print Invoice</Button>
        <br /><br />
      </div>

      <div>
        <h1>Service List</h1>
        {services.length === 0 ? (
          <p>No records found</p>
        ) : (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>No</th>
                <th>Name</th>
                <th>Description</th>
                <th>Rate</th>
                <th>Update</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {services.map(service => (
                <tr key={service.id}>
                  <td>{service.id}</td>
                  <td>{service.name}</td>
                  <td>{service.description}</td>
                  <td>{service.rate}</td>
                  <td>
                    <Button variant="info" onClick={() => updateService(service.id)}>Update</Button>
                  </td>
                  <td>
                    <Button variant="danger" onClick={() => deleteService(service.id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}

export default Services;
