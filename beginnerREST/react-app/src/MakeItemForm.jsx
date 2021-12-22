import React from 'react';
import Cookies from 'universal-cookie';
function MakeItemForm(props){
    const cookies = new Cookies();
    function back(){
        props.back(0);
    }
    function createItem(event){
        event.preventDefault();

        let name = document.getElementById("itemName"+props.list._id).value;
        let listid = props.list._id;
        let listName = props.list.name;
        let filterObj = {}; 
        props.list.filters.forEach(filter => { 
            let currFilterElement = document.getElementById(`${filter}`+props.list._id).value;
            if(currFilterElement !== ''){
                filterObj[filter] = currFilterElement;
            }
        });
        fetch(`http://localhost:8080/list/item/${listid}`, {
            'method':'POST',
            'headers': {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization':cookies.get('token').token
            },
            'body':JSON.stringify({
                listName,
                name,
                filterObj
            })
        })
        .then(response=>response.json())
        .then(props.back(2))
        .then(() => {props.update()})
        .catch(err => {console.log(err); props.back(3);})
    }
    return(
        <form onSubmit={createItem}>
            <label htmlFor={"itemName"+props.list._id}>Item Name:</label>
            <br />
            <input type="text" id={"itemName"+props.list._id} required />
            <br />
            {props.list.filters.map(filter => 
                <div>
                    <label htmlFor={`${filter}`+props.list._id}>{filter}: </label>
                    <br />
                    <input type="text" id={`${filter}`+props.list._id}/>
                    <br />
                </div>
            )}
            <input type="submit"></input>
            <input type='button' value='Back' onClick={back}></input>
        </form>
    )
}
export default MakeItemForm;