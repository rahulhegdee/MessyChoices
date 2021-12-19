import React from 'react';
import Cookies from 'universal-cookie';
function CreateForm(props){
    const [passMatch, letPassMatch] = React.useState(true);
    const [userExists, letUserExists] = React.useState(false);
    const [verified, setVerified] = React.useState(false); 
    const [userMet, letUserMet] = React.useState(true);
    const [userLength, letUserLength] = React.useState(true); //true - good length, null - too short, false - too long
    const cookies = new Cookies();
    function passCheck(){
        let passOne = document.getElementById('initPassword').value;
        let passTwo = document.getElementById('retypePassword').value;
        if(passOne.length == 0 || passTwo.length == 0){letPassMatch(true); return;}
        if(passOne === passTwo){
            letPassMatch(true);
        }
        else{
            letPassMatch(false);
        }
    }
    function checkUsername(){
        let userName = document.getElementById('newUsername').value;
        if(userName.length == 0){letUserMet(true); letUserLength(true); letUserExists(false); return;}
        //we only want to return when there are errors with the username, if one condition is met we still need to check others
        if(userName.match(/^[0-9a-zA-Z]+$/)){
            letUserMet(true);
        }
        else{
            letUserMet(false);
            return;
        }

        if(userName.length < 3){letUserLength(null); return;}
        else if(userName.length >= 3 && userName.length < 64){letUserLength(true);}
        else{letUserLength(false); return;}

        letUserExists(false);
        fetch('http://localhost:8080/username',{
            'method': 'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({'username':userName})
        })
        .then(response => response.status)
        .then(response => {
            if(response === 200){
                letUserExists(false);
            }
            else {
                letUserExists(true);
            }
        })
        .catch(err => console.log(err));

    }
    async function createUser(){
        let username = document.getElementById('newUsername').value;
        let password = document.getElementById('initPassword').value;
        await fetch('http://localhost:8080/user',{
            'method':'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({'username':username, 'password':password})
        })
        .then(response => response.status)
        .then(response => {
            if(response === 201){
                loginUser(username, password);
            }
        })
        .catch(err => console.log(err));
    }
    async function loginUser(username, password){
        //setTimeout(function (){ //note: uncomment if you experience the submit button having to be pressed more than once
            fetch('http://localhost:8080/account',{
                'method':'POST',
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body:JSON.stringify({'username':username,'password':password})
            })
            .then(response => Promise.all([response.json(), response.status]))
            .then(([res, status]) => {
                if(status === 200){
                    cookies.set('token', res, {path:'/',expires:new Date(Date.now()+(1000*60*60))});
                    setVerified(true);
                }
                else{
                    setVerified(false);
                }
            })
            .catch(err => console.log(err))
            if(verified){
                props.submit();
            }
        //}, 100);
    }
    function handleSubmit(event){
        event.preventDefault();
        createUser();
    }
    function back(){
        props.back('title');
    }
    React.useEffect(() => {
        if(passMatch && !userExists && userMet && userLength){
            document.getElementById('createAccountSubmit').disabled = false;
        }
        else{
            document.getElementById('createAccountSubmit').disabled = true;
        }
        
        if(verified){
            props.submit();
        }
    });
    return(
        <form onSubmit={handleSubmit}>
            <label htmlFor='newUsername'>Username:</label><br/>
            <input type='text' id="newUsername" onChange={() => {checkUsername();}} required></input>
            {!userMet && <label style={{color:'red'}}> Username should only contain letters and numbers! </label>}
            {userMet && (userLength==null) && <label style={{color:'red'}}> Username too short! </label>}
            {userMet && (userLength==false) && <label style={{color:'red'}}> Username too long! </label>}
            {userMet && userLength && userExists && <label style={{color:'red'}}> Username already exists!</label>}<br/>
            <label htmlFor='initPassword'>Password:</label><br/>
            <input type='password' required id="initPassword" onChange={() => {passCheck();}}></input><br/>
            <label htmlFor='retypePassword'>Retype Password:</label><br/>
            <input type='password' id="retypePassword" required onChange={() => {passCheck();}}></input>
            {!passMatch && <label style={{color:'red'}}> Password does not match!</label>}
            <br/>
            <input type="button" value='Submit' id="createAccountSubmit" onClick={handleSubmit}></input>
            <input type="button" value='Back' onClick={back}></input>
        </form>
    )
}

export default CreateForm;