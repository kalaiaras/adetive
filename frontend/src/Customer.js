import React, { useState, useEffect } from 'react';
import Header from './Header';
import { Button } from 'react-bootstrap';
import axios from 'axios';
let user = JSON.parse(localStorage.getItem('user-info'));
function Services() {
    const [customer_name, setCustomer_Name] = useState('');
    const [address, setAddress] = useState('');
    const [phone_number, setPhoneNumber] = useState('');
    const [records, setRecords] = useState([]);
    const [user_id, setUser_Id] = useState('');
    const [id, setId] = useState(null);

    useEffect(() => {
        

        if (user && user.id) {
            setUser_Id(user.id);
            customerrec();
        }
    }, []);

    async function updatecustomer(cid) {
        try {
            const response = await axios.get(`http://localhost:8000/api/customers/${cid}/edit`);
            const data = response.data;
            setCustomer_Name(data.customer_name);
            setAddress(data.address);
            setPhoneNumber(data.phone_number);
            setId(data.id);
        } catch (error) {
            console.error('Error fetching service details:', error.message);
        }
    }

    async function deleteService(Id) {
        try {
            await axios.delete(`http://localhost:8000/api/customers/${Id}`);
            customerrec(); 
        } catch (error) {
            console.error('Error deleting service:', error.message);
        }
    }

    async function clear() {
        setCustomer_Name('');
        setAddress('');
        setPhoneNumber('');
        setId(null);
    }

    async function customerrec() {
        try {
            const response = await axios.get(`http://localhost:8000/api/customers/${user.id}`);
            const data = response.data;
            setRecords(data);
        } catch (error) {
            console.error('Error fetching customer records:', error.message);
        }
    }

    async function addcustomer() {
        const data = {
            user_id: user_id,
            phone_number:phone_number,
            address:address,
            customer_name: customer_name 
        };
        try {
            let url = `http://localhost:8000/api/customers/`;
            let method = "POST";
            if (id) {
                url = `http://localhost:8000/api/customers/${id}`;
                method = "PUT";
            }
            await axios({
                method,
                url,
                headers: { "Content-Type": "application/json" },
                data: JSON.stringify(data)
            });
            clear();
            customerrec();
        } catch (error) {
            console.error('Error adding/updating customer:', error.message);
        }
    }

    return (
        <>
            <Header />
            <div className='col-sm-4 offset-sm-4'>
                <h1>Add Customer</h1><br />
                <input type="text" className='form-control' value={customer_name} placeholder='Customer name' onChange={(e) => setCustomer_Name(e.target.value)} /> <br />
                <input type="text" className='form-control' placeholder='Address' value={address} onChange={(e) => setAddress(e.target.value)} /> <br />
                <input type="text" className='form-control' placeholder='phone number' value={phone_number} onChange={(e) => setPhoneNumber(e.target.value)} /> <br />

                <Button onClick={addcustomer}>Submit</Button>&nbsp;&nbsp;&nbsp;
                <Button onClick={clear}>Cancel</Button>
                <br /><br />
            </div>

            <div>
                <h1>Customer List</h1>
                {records.length === 0 ? (
                    <p>No records found</p>
                ) : (
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Customer Name</th>
                                <th>Address</th>
                                <th>phone Number</th>
                                <th>Update</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.map(data => (
                                <tr key={data.id}>
                                    <td>{data.id}</td>
                                    <td>{data.customer_name}</td>
                                    <td>{data.address}</td>
                                    <td>{data.phone_number}</td>
                                    <td>
                                        <Button variant="info" onClick={() => updatecustomer(data.id)}>Update</Button>
                                    </td>
                                    <td>
                                        <Button variant="danger" onClick={() => deleteService(data.id)}>Delete</Button>
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
