import React, { useState, useEffect } from 'react';
import Header from './Header';
import { Table, Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import Axios

function Home() {
  const [invoices, setInvoices] = useState([]);
  const [payment, setPayment] = useState(false);
  const navigation = useNavigate();
 
  useEffect(() => {
    let userdata = JSON.parse(localStorage.getItem('user-info'));
    if (!userdata) {
      navigation('/login');
    } else {
      fetchInvoices(userdata.id);
    }
  }, []);

  async function fetchInvoices(id) {
    try {
      const response = await axios.get(`http://localhost:8000/api/invoices/user/${id}`);
      const result = response.data;
      
      if (result.invoices.length > 0) {
        setInvoices(result.invoices);
      }
    } catch (error) {
      console.error('Error fetching invoices:', error.message);
    }
  }
  let userdata = JSON.parse(localStorage.getItem('user-info'));
  async function updatePayment(id) {
    try {
      // Check if user has admin role
      const userData = JSON.parse(localStorage.getItem('user-info'));
      if (userData && userData.role === 'admin') {
        const data = { status: payment ? 'pending' : 'paid' };
        setPayment(!payment);
        await axios.put(`http://localhost:8000/api/invoices/${id}`, data);
        fetchInvoices(userData.id);
      } else {
        console.log('User does not have admin role. Update payment status denied.');
      }
    } catch (error) {
      console.error('Error updating invoice:', error.message);
    }
  }

  async function deleteInvoice(id) {
    try {
      await axios.delete(`http://localhost:8000/api/invoices/${id}`);
      fetchInvoices(userdata.id);
    } catch (error) {
      console.error('Error deleting invoice:', error.message);
    }
  }

  return (
    <>
      <Header />
      <hr />
      <div className='inv'>
        <h1>Invoice Table</h1>
        <Container className="d-flex justify-content-center align-items-center ">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Invoice Number</th>
                <th>Customer Name</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Update</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {invoices && invoices.length > 0 ? (
                invoices.map((invoice, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{invoice.id}</td>
                    <td>{invoice.customer.customer_name}</td>
                    <td>{invoice.amount}</td>
                    <td>{invoice.status}</td>
                    <td>
                      <Button variant="primary" onClick={() => updatePayment(invoice.id)}>Update</Button>
                    </td>
                    <td>
                      <Button variant="danger" onClick={() => deleteInvoice(invoice.id)}>Delete</Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No invoices found</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Container>
      </div>
    </>
  );
}

export default Home;
