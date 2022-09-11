import React, { useState, useEffect } from 'react'
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from "react-router-dom";


const AddUser = (props) => {
    const [user, setUser] = useState([])
    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    }
    useEffect(() => {
        props.setProgress(100)
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()
        const options = {
            method: 'POST',
            url: 'https://dummyapi.io/data/v1/user/create',
            headers: { 'app-id': '631d7c48465c910652c292c1' },
            data: { firstName: user.firstName, lastName: user.lastName, email: user.email }
        };

        axios.request(options).then(function (response) {
            // console.log(response.data);
            if (response.data.id) {
                setUser({
                    firstName: "",
                    lastName: "",
                    email: ""
                });
                toast.success('User registration successfully')
            }
        }).catch(function (error) {
            console.error(error.response.data.data.email);
            toast.error(`Failed! ${error.response.data.data.email}`)
        });
    }
    return (
        <div className='container my-3'>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <div className="d-flex justify-content-between">
                <div>
                    <h3>Add User</h3>
                </div>
                <div>
                    <Link to="/"><button className="btn btn-primary">View Users</button></Link>
                </div>
            </div>
            <form method='POST' onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="firstName" className="form-label">First Name</label>
                    <input onChange={handleChange} value={user.firstName} type="text" className="form-control" id="firstName" name='firstName' />
                </div>
                <div className="mb-3">
                    <label htmlFor="lastName" className="form-label">Last Name</label>
                    <input onChange={handleChange} value={user.lastName} type="text" className="form-control" id="lastName" name='lastName' />
                </div>

                <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                    <input onChange={handleChange} value={user.email} type="email" name='email' className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default AddUser