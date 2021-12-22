import React from 'react';
import Cookies from 'universal-cookie';
function RandomForm(props){
    const cookies = new Cookies();
    function getRandom(event){
        event.preventDefault();
        let listid = props.list._id;
        fetch(`http://localhost:8080/random/${listid}`,{
            'method':'POST',
            'headers':{
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization':cookies.get('token').token
            },
            'body':JSON.stringify({
            })
        })
        .then(response => response.json())
        .then(response => {alert(response.item.name)})
        .catch(err => {console.log(err)})
    }
    return(
        <form onSubmit={getRandom}>
            <p>Type in any optional parameters for the random item: </p>
            <input type="submit"></input>
        </form>
    )
}
export default RandomForm;