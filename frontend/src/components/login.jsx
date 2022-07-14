import axios from 'axios'
import { useRef } from 'react'
import { useState } from 'react'
import './login.css'
import CancelIcon from '@mui/icons-material/Cancel';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function Login(props) {
    const [success, setSuccess] = useState(null)
    const userRef=useRef()
    const passRef=useRef()

    const handleSubmit =async (e) => {
        e.preventDefault();
        const user = {
            username:userRef.current.value,
            password:passRef.current.value,
        }
        try {
            const res=await axios.post('/user/login',user)
            props.storage.setItem("user",res.data)
            props.setCurrentUser(res.data)
            props.setShowLogin(false)
            setSuccess(true)
        } catch (err) {
            setSuccess(false)
            console.log(err)
        }
    }

    return (
        <div className='login-container'>
            <div><AccountCircleIcon></AccountCircleIcon></div>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Enter Username:" ref={userRef}/>
                <input type="password" placeholder="Enter Password:" ref={passRef}/>
                <button className='button register'>Login</button>
            </form>
            {success!=null && (
                <>
                    {success === true 
                        ? 
                        <span className='success'>✅</span>
                        :
                        <span className='fail'>❌ Try again.</span>
                    }
                </>
            )}
        <CancelIcon className='cancel' onClick={()=>props.setShowLogin(false)}/>
        </div>
    )
}
