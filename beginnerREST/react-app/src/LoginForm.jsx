import React from 'react';
import Cookies from 'universal-cookie';
import './LoginForm.css';
function LoginForm(props){
    const [verified, setVerified] = React.useState(null); //three states: null - Submit hasn't been pressed yet, false - Submit pressed and username not found, true - Username found
    const cookies = new Cookies();
    async function verifyAccount(){
        let userName = document.getElementById('loginUsername').value;
        let passWord = document.getElementById('loginPassword').value;
        await fetch('http://localhost:8080/account',{
            'method':'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({'username':userName, 'password':passWord})
        })
        .then(response => response.json())
        .then(response => {
            if(response.message === 'unverified'){
                setVerified(false);
            }
            else{
                cookies.set('token',response, {path:'/',expires:new Date(Date.now()+(1000*60*60))});
                setVerified(true);
            }
        })
        //.then(props.user)
        .catch(err => console.log(err))
    }
    function handleSubmit(event){
        event.preventDefault();
        verifyAccount(); 
    }
    function back(){
        props.back('title');
    }
    React.useEffect(()=>{
        if(verified){
            props.submit();
        }
    })
    return(
        <form className="login-form" onSubmit={handleSubmit}>
            {/*<label htmlFor='loginUsername'>Username:</label><br/>*/}
            <input type='text' id='loginUsername' placeholder="Username" autocomplete="off" spellcheck="false" required></input>
            <br/>
            {/*<label htmlFor='loginPassword'>Password:</label><br/>*/}
            <input type='password' id='loginPassword' placeholder="Password" required></input>
            <br/>
            {verified === false && <label style={{color:'red'}}>Incorrect Username or Password.</label>}
            <input type='submit' value="Log In"></input>
            {/*<input type='button' value='Back' onClick={back}></input>*/}
        </form>
    )
}

export default LoginForm;