import React from 'react';
import LoginButton from './LoginButton';
import LoginForm from './LoginForm';
import CreateButton from './CreateAccount';
import Cookies from 'universal-cookie';
import './TitlePage.css';

function TitlePage(props){
    const cookies = new Cookies();
    async function savedLogin(){
        if(cookies.get('token') != undefined){
            await getUsers();
            props.view('welcome');
        }
        else{
            props.view('title');
        }
    }
    async function getUsers(){
        await fetch('http://localhost:8080/account',{
            'method': 'GET',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization':cookies.get('token').token
            }
        })
        .then(response => response.json())
        .then(response => props.account(response.authorizedData))
        .catch(err => console.log(err));
    }
    return(
        <div class="title-wrapper">
            <div class="title-text">
                <h1>MessyChoices</h1>
                <p>Life is full of messy choices that need to be made.</p>
            </div>
            <div className="title-column">
                <div class="title-input">
                    {/*<LoginButton view={props.view}/>*/}
                    <LoginForm submit={savedLogin} user={getUsers}/>
                    <br/>
                    <hr />
                    <CreateButton view={props.view}/>
                </div>
            </div>
        </div>
    )
}

export default TitlePage;