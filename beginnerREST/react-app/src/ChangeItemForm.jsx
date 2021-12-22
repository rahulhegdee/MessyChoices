import React from 'react';
import Cookies from 'universal-cookie';
function ChangeItemForm(props){
    const cookies = new Cookies();
    function updateItem(event){
        event.preventDefault();

        let name = document.getElementById('newItemName' + props.item._id).value;
        if(name === ""){name = props.name;}

        fetch(`http://localhost:8080/item/${props.item._id}`, {
            'method': 'PATCH',
            'headers':{
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization':cookies.get('token').token
            },
            'body':JSON.stringify({'name':name})
        })
        .then(response => response.json())
        .then(() => {props.change(name)})
        .then(props.submit())
        .catch(err => {console.log(err);})
    }
    return(
        <form onSubmit={updateItem}>
            <label htmlFor={'newItemName' + props.item._id}>New Item Name: (Optional)</label><br/>
            <input type='text' id={'newItemName' + props.item._id} defaultValue={props.name}></input>
            <br/>
            <input type='submit'></input>
        </form>
    )
}
export default ChangeItemForm;