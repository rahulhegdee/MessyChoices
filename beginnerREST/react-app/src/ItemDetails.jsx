import React from 'react';
import Cookies from 'universal-cookie';
import ChangeItemForm from './ChangeItemForm';
function Item(props){
    const [updateForm, setUpdateForm] = React.useState(false);
    const cookies = new Cookies();
    function switchUpdateItem(){
        setUpdateForm(!updateForm);
    }
    function deleteItem(){
        fetch(`http://localhost:8080/item/${props.item._id}`, {
            'method':'DELETE',
            'headers':{
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization':cookies.get('token').token
            }
        })
        .then(response => response.json())
        .then(props.update())
        .catch(err=>console.log(err));
    }
    return(
        <div>
            <button onClick={() => switchUpdateItem()}>Update Item</button>
            <button onClick={() => deleteItem()}>Delete Item</button>
            {updateForm && <ChangeItemForm item={props.item} name={props.name} change={props.change} submit={switchUpdateItem}/>}
        </div>
    )
}
export default Item;