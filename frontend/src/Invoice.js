import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Table, Button } from 'react-bootstrap';
import Header from './Header';
import { useParams } from 'react-router-dom';
import axios from 'axios';
let user = JSON.parse(localStorage.getItem('user-info'));
const Invoice = () => {
    const params = useParams(); 
   
   
    const [customerdata, setCustomerData] = useState('');
    const [invoicedata, setInvoiceData] = useState('');
    const [servicedata, setServiceData] = useState([]);
    const [newDateStr, setNewDateStr] = useState('');
    
    const [isAdmin, setIsAdmin] = useState(false);
    const [discount, setDiscount] = useState('');
    const [tax, setTax] = useState('');

    useEffect(() => {
        checkUserRole();
        getInvoice();
    }, []);

    const checkUserRole = () => {
        const user = JSON.parse(localStorage.getItem('user-info'));
        setIsAdmin(user.role === 'admin');
    }

    const updatePaymentStatus = async () => {
        try {
            await axios.put(`http://localhost:8000/api/invoices/${params.id}`, { status: 'paid' });
            getInvoice();
        } catch (error) {
            console.error('Error updating payment status:', error.message);
        }
    }

    const updateInvoice = async () => {
        try {
            const data = { discount, tax };
            await axios.put(`http://localhost:8000/api/invoices/${params.id}`, data);
            getInvoice();
        } catch (error) {
            console.error('Error updating invoice:', error.message);
        }
    }
    const getInvoice = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/invoices/${params.id}`);

            
           
            setCustomerData( response.data.customer)
             setInvoiceData(response.data.invoice);
             setServiceData(response.data.services);
             setDiscount(response.data.invoice.discount);
             setTax(response.data.invoice.tax)
           

            const currentDate = new Date();
            const formattedDate = currentDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
            setNewDateStr(formattedDate);
        } catch (error) {
            console.error('Error fetching invoice data:', error.message);
        }
    }

    return (
        <>
            <Header />

            <Container className='outer'>
                <Row>
                    <Col>
                        <h1>Invoice</h1>
                        <hr />
                        <Row>
                            <Col>
                                <h5>Customer Information:</h5>
                                <p><b>Name:</b> {customerdata.customer_name}</p>
                                <p><b>Address:</b> {customerdata.address}</p>
                                <p><b>Phone Number:</b> {customerdata.phone_number}</p>

                            </Col>
                            <Col>
                                <h5>Invoice Details:</h5>
                                <p><b>Date:</b> {newDateStr} </p>
                                <p><b>Invoice Number:</b> {invoicedata && invoicedata.id}</p>
                                <p><b>Payment Status:</b> {invoicedata.status}</p>
                                {isAdmin && (
                                    <Button variant="primary" onClick={updatePaymentStatus}>
                                        Update Payment Status
                                    </Button>
                                )}
                            </Col>
                        </Row>
                        <hr />
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Service</th>
                                    <th>Description</th>
                                    <th>Price</th>

                                </tr>
                            </thead>
                            <tbody>
                                {servicedata && servicedata.map((service, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{service.name}</td>
                                        <td>{service.description}</td>
                                        <td>{service.rate}</td>

                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <Row>
                        <Col className="text-end">
                              
                            </Col>
                            <Col className="text-end">
                             <h6>Discounts:  <input type="text" placeholder="Discount" value={discount} onChange={(e) => setDiscount(e.target.value)} /></h6>
                               <h6>Tax rate(%):  <input type="text" placeholder="Tax" value={tax} onChange={(e) => setTax(e.target.value)} /></h6>
                                <h5>Total: {invoicedata && invoicedata.amount}</h5>
                                <Button variant="primary" onClick={updateInvoice}>Update Invoice</Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default Invoice;
