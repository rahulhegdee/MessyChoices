import React, {useState} from 'react';
import CreateAccountForm from './CreateForm';
import WelcomePage from './WelcomePage';
import TitlePage from './TitlePage';
import LoginForm from './LoginForm';
import Cookies from 'universal-cookie';
function MainPage(){
    const [currentView, setCurrentView] = useState('');
    const [currAccount, setCurrAccount] = useState('');
    const cookies = new Cookies();
    /*function addUser(){
        let userName = document.getElementById('username');
        let passWord = document.getElementById('initPassword');
        let user = {username: userName.value, password: passWord.value}
        setUserData(userData => [...userData, user]);
    }*/
    function changeView(newView){
        setCurrentView(newView);
    }
    function changeAccount(newAccount){
        setCurrAccount(newAccount);
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
        .then(response => setCurrAccount(response.authorizedData))
        .catch(err => console.log(err));
    }
    async function savedLogin(){
        if(cookies.get('token') != undefined){
            await getUsers();
            setCurrentView('welcome');
        }
        else{
            setCurrentView('title');
        }
    }
    React.useEffect(()=>{
        savedLogin();
    },[])//the [] means this useEffect will only happen once

    switch (currentView) {
        case 'create':
            return <CreateAccountForm back={changeView} submit={savedLogin}/>;
        case 'login':
            return <LoginForm submit={savedLogin} back={changeView} user={getUsers}/>;
        case 'welcome':
            return <WelcomePage current={currAccount} back={changeView}/>
        case 'title':
            return <TitlePage view={changeView} account={changeAccount}/>
        default:
            return <></>
            //this should be loading page
    }
}

export default MainPage;