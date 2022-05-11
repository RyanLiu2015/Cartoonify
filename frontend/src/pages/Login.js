import { useState } from 'react';
import sty from './login.module.css';
import {
    useNavigate,
} from "react-router-dom";
import logo from '../images/logo.svg';

export default function Login() {
    const [username, setUsername] = useState('');
    const [pwd, setPwd] = useState('');
    const [cPwd, setCPwd] = useState('');
    const [email, setEmail] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    let navigate = useNavigate();

    const handleSubmit = () => {

        if (!username) {
            alert('username must be required!')
            return;
        }
        if (!pwd) {
            alert('pwd must be required!')
            return;
        }
        if (isLogin) {
            // to login
            if (username && pwd) {
                // alert(pwd);
                const xhttp = new XMLHttpRequest();
                const url = "";
                xhttp.open('GET', url);
                xhttp.send();
                xhttp.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        alert(xhttp.responseText);
                    }
                }
            }
            
        } else {
            // to register
            if (!cPwd) {
                alert('confirm password must be required!')
                return;
            }
            if (!email) {
                alert('email must be required!')
                return;
            }
            if (cPwd !== pwd) {
                alert('password and confirm password must be equal!')
                return;
            }
            const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
            if (!regEmail.test(email)) {
                alert('invaild email!')
                return;
            }
            if (username && pwd && cPwd && email && regEmail.test(email)) {
                const xhttp = new XMLHttpRequest();
                const url = "";
                xhttp.open('GET', url);
                xhttp.send();
                xhttp.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        alert(xhttp.responseText);
                    }
                }
            }

        }
        navigate("/")
    }

    
    return (
        <div className={sty.box}>
            <div className={sty.loginBox}>
                <h1 className={sty.h1}>{isLogin ? 'Login' : 'Register'}</h1>

                <input 
                    value={username}
                    onChange={(e) => {
                        setUsername(e.target.value)
                    }} 
                    type="text" 
                    placeholder='The user name' 
                    className={sty.iputItem}
                />
                <input
                    value={pwd} 
                    onChange={(e) => {
                        setPwd(e.target.value)
                    }}
                    type="text"
                    placeholder='Password'
                    className={sty.iputItem} 
                />

                {!isLogin && (
                    <input
                        value={cPwd}
                        onChange={(e) => {
                            setCPwd(e.target.value)
                        }}
                        type="text"
                        placeholder='Confirm Password'
                        className={sty.iputItem}
                    />
                )}

                {!isLogin && (
                    <input
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value)
                        }}
                        type="text"
                        placeholder='Email'
                        className={sty.iputItem}
                    />
                )}

                <div onClick={handleSubmit} className={sty.loginBtn}>
                    {isLogin ? 'Login' : 'Register'}
                </div>
                <div 
                    onClick={() => {
                        setIsLogin(!isLogin)
                    }} 
                    className={sty.tip}>
                    {isLogin ? 'click register' : 'click login for existing account'}
                </div>

                <img src={logo} className={sty.logo} />
            </div>


        </div>
    );

}