import React,{useState} from 'react'
import Navbar from './components/Navbar'
import ViewUser from './users/ViewUser'
import AddUser from './users/AddUser';
import EditUser from './users/EditUser'
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import LoadingBar from 'react-top-loading-bar'

const App = () => {
  const [progress, setProgress] = useState(0)
  return (
    <>
      <BrowserRouter>
      <LoadingBar color='#f11946' progress={progress} onLoaderFinished={() => setProgress(0)}/>
        <Navbar />
        <Routes>
          <Route path="/" element={<ViewUser setProgress={setProgress}/>} />
          <Route path="addUser" element={<AddUser setProgress={setProgress}/>} />
          <Route path="editUser/:id" element={<EditUser setProgress={setProgress}/>} />
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App