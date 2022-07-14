import axios from 'axios'
import { useRef } from 'react'
import { useState } from 'react'
import './register.css'
import CancelIcon from '@mui/icons-material/Cancel';

export default function Register(props) {
    const [success, setSuccess] = useState(null)
    const userRef=useRef()
    const emailRef=useRef()
    const passRef=useRef()

    const handleSubmit =async (e) => {
        e.preventDefault();
        const newUser = {
            username:userRef.current.value,
            email:emailRef.current.value,
            password:passRef.current.value,
        }
        try {
            await axios.post('/user/register',newUser)
            setSuccess(true)
        } catch (err) {
            setSuccess(false)
            console.log(err)
        }
    }

    return (
        <div className='register-container'>
            <h4 className='heading'>Create a new account</h4>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Enter Username:" ref={userRef}/>
                <input type="email" placeholder="Enter Email:"  ref={emailRef}/>
                <input type="password" placeholder="Enter Password:" ref={passRef}/>
                <button className='button register'>Register</button>
            </form>
            {success!=null && (
                <>
                    {success === true 
                        ? 
                        <span className='success'>✅ You can login now.</span>
                        :
                        <span className='fail'>❌ Try again.</span>
                    }
                </>
            )}
        <CancelIcon className='cancel' onClick={()=>props.setShowRegister(false)}/>
        </div>
    )
}
