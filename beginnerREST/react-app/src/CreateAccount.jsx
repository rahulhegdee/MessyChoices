import React from 'react';
import './CreateButton.css';

function CreateAccount(props){
    return(
        <button className="create-button" onClick={()=>{props.view('create')}}>Create Account</button>
    )
}

export default CreateAccount;