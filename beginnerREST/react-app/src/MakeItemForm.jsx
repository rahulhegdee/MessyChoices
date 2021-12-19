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
        let keyword = document.getElementById("itemKeyword"+props.list._id).value;
        let rank = document.getElementById("itemRank"+props.list._id).value;
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
                keyword,
                rank
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
            <label htmlFor={"itemKeyword"+props.list._id}>Keyword: (Optional)</label>
            <br />
            <input type="text" id={"itemKeyword"+props.list._id}/>
            <br />
            <label htmlFor={"itemRank"+props.list._id}>Rank: (Optional)</label>
            <br />
            <input type="text" id={"itemRank"+props.list._id}/>
            <br />
            <input type="submit"></input>
            <input type='button' value='Back' onClick={back}></input>
        </form>
    )
}
export default MakeItemForm;