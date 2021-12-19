import React from 'react';
import Cookies from 'universal-cookie';
function ChangeListForm(props){
    const cookies = new Cookies();
    async function changeList(event){
        event.preventDefault();

        let name = document.getElementById('newListName'+props.list._id).value;
        let type = document.getElementById('newListType'+props.list._id).value;
        if(name == ""){name = props.name;}
        if(type == ""){type = props.type;}
        await fetch(`http://localhost:8080/list/${props.list._id}`,{
                'method':'PATCH',
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'authorization':cookies.get('token').token
                },
                body:JSON.stringify({'name':name,'type':type})
        })
        .then(response => response.json())
        .then(() => {
            props.change(name, type);
        })
        .then(props.submit())
        .catch(err => {console.log(err);})
    }
    return(
        <form onSubmit={changeList}>
            <label htmlFor={'newListName' + props.list._id}>New List Name: (Optional)</label><br/>
            <input type='text' id={'newListName' + props.list._id} defaultValue={props.name}></input>
            <br/>
            <label htmlFor={'newListType' + props.list._id}>New List Type: (Optional)</label><br/>
            <input type='text' id={'newListType' + props.list._id} defaultValue={props.type}></input>
            <br/>
            <input type='submit'></input>
        </form>
    )
}
export default ChangeListForm;