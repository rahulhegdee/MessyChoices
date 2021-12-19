import React from 'react';
import Cookies from 'universal-cookie';
function ConfirmDelete(props){
    const cookies = new Cookies();
    function deleteAccountUser(){
        let username = props.user;
        fetch('http://localhost:8080/userdelete',{
            'method': 'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization':cookies.get('token').token
            }
        })
        .then(response => {
            console.log(response)
        })
        .catch(err => console.log(err));

        cookies.remove('token',{path:'/'});
        props.back('title');
        //are you sure popup
    }
    function deleteAccount(){
        let id = props.userID;
        fetch(`http://localhost:8080/account/${id}`,{
            'method': 'DELETE',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization':cookies.get('token').token
            }
        })
        .then(response => {
            console.log(response)
        })
        .catch(err => console.log(err));

        cookies.remove('token',{path:'/'});
        props.back('title');
        //are you sure popup
    }
    return(
        <button onClick={deleteAccountUser}>yes</button>
    )
}

export default ConfirmDelete;