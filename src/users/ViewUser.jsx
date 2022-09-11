import React, { useEffect, useState } from 'react'
import axios from "axios";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactPaginate from "react-paginate";

const ViewUser = (props) => {
    const [user, setUser] = useState([])
    const [singleUser, setSingleUser] = useState([])
    const [search, setSearch] = useState([])
    const [filtered, setFiltered] = useState([])

    const [pageCount, setPageCount] = useState(0);
    let limit = 8;
    useEffect(() => {
        props.setProgress(10)
        const options = {
            method: 'GET',
            url: `https://dummyapi.io/data/v1/user?page=0&limit=${limit}`,
            headers: { 'app-id': '631d7c48465c910652c292c1' }
        };
        props.setProgress(60)
        axios.request(options).then(function (response) {
            const totalRecords = response.data.total;
            setPageCount(Math.ceil(totalRecords / limit))
            // console.log(response.data.data);
            setUser(response.data.data)
            setFiltered(response.data.data)
        }).catch(function (error) {
            console.error(error);
        });
        props.setProgress(100)
    }, [])

    const fetchByPagination = async (currentPage) => {
        props.setProgress(30)
        const options = {
            method: 'GET',
            url: `https://dummyapi.io/data/v1/user?page=${currentPage}&limit=${limit}`,
            headers: { 'app-id': '631d7c48465c910652c292c1' }
        };

        const res = await axios.request(options);
        return res.data
    }

    const handlePageClick = async (data) => {
        props.setProgress(10)
        console.log(data.selected);

        let currentPage = data.selected + 1;

        const fetch = await fetchByPagination(currentPage);
        // console.log(fetch.data)

        setUser(fetch.data)
        setFiltered(fetch.data)
        props.setProgress(100)
        // scroll to the top
        //window.scrollTo(0, 0)
    };

    const handleSingleUser = (e) => {
        // console.log(e.target.id)
        const options = {
            method: 'GET',
            url: `https://dummyapi.io/data/v1/user/${e.target.id}`,
            headers: { 'app-id': '631d7c48465c910652c292c1' }
        };

        axios.request(options).then(function (response) {
            console.log(response.data);
            setSingleUser(response.data)
        }).catch(function (error) {
            console.error(error);
        });

    }

    const handleDelete = (e) => {
        const ans = window.confirm("Are you want to delete this?");
        if (ans === true) {
            const options = {
                method: 'DELETE',
                url: `https://dummyapi.io/data/v1/user/${e.target.id}`,
                headers: { 'app-id': '631d7c48465c910652c292c1' }
            };

            axios.request(options).then(function (response) {
                console.log(response.data);
                if (response.data.id) {
                    toast.success('User deleted successfully');
                    const options = {
                        method: 'GET',
                        url: 'https://dummyapi.io/data/v1/user',
                        headers: { 'app-id': '631d7c48465c910652c292c1' }
                    };

                    axios.request(options).then(function (response) {
                        // console.log(response.data.data);
                        setUser(response.data.data)
                    }).catch(function (error) {
                        console.error(error);
                    });
                }
                else {
                    toast.error(`Failed! ${response.data.error}`);
                }
            }).catch(function (error) {
                console.error(error);
            });
        }
    }

    useEffect(() => {
        const result = user.filter((use) => {
            return use.firstName.toLowerCase().match(search.toLowerCase()) || use.lastName.toLowerCase().match(search.toLowerCase())
        })
        setFiltered(result)
    }, [search])


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
                    <h3>View Users</h3>
                </div>
                <form role="search">
                    <input onChange={(e) => { setSearch(e.target.value) }} className="form-control" type="search" placeholder="Search" aria-label="Search" style={{ "width": "49rem" }} />
                </form>
                <div>
                    <Link to="addUser"><button className="btn btn-primary">Add User</button></Link>
                </div>
            </div>
            <div className="row my-4">
                {
                    filtered.map((item) => {
                        return <div className="col-md-3 mt-3" key={item.id}>
                            <div className="card" style={{ "width": "18rem" }}>
                                <img src={item.picture} className="card-img-top" alt="..." />
                                <div className="card-body">
                                    <h5 className="card-title">{item.firstName} {item.lastName}</h5>
                                    <div className="d-flex">
                                        <button id={item.id} onClick={handleSingleUser} type='button' className="btn btn-secondary btn-sm mx-2" data-bs-toggle="modal" data-bs-target="#exampleModal">View</button>
                                        <Link to={`editUser/${item.id}`}><button type='button' className="btn btn-warning btn-sm mx-2">Edit</button></Link>
                                        <button id={item.id} onClick={handleDelete} type='button' className="btn btn-danger btn-sm">Delete</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    })
                }

            </div>
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">User Details</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <table className="table">
                                <tbody>
                                    <tr>
                                        <th scope="row">Email</th>
                                        <td>{singleUser.email}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">First Name</th>
                                        <td>{singleUser.firstName}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Last Name</th>
                                        <td>{singleUser.lastName}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Gender</th>
                                        <td>{singleUser.gender}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
            <ReactPaginate
                previousLabel={"previous"}
                nextLabel={"next"}
                breakLabel={"..."}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={3}
                onPageChange={handlePageClick}
                containerClassName={"pagination justify-content-center"}
                pageClassName={"page-item"}
                pageLinkClassName={"page-link"}
                previousClassName={"page-item"}
                previousLinkClassName={"page-link"}
                nextClassName={"page-item"}
                nextLinkClassName={"page-link"}
                breakClassName={"page-item"}
                breakLinkClassName={"page-link"}
                activeClassName={"active"}
            />
        </div>
    )
}

export default ViewUser