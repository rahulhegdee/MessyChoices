import React from 'react';
import Cookies from 'universal-cookie';
function ChangeItemForm(props){
    const cookies = new Cookies();
    function updateItem(event){
        event.preventDefault();

        let name = document.getElementById('newItemName' + props.item._id).value;
        let keyword = document.getElementById('newItemKeyword' + props.item._id).value;
        let rank = document.getElementById('newItemRank' + props.item._id).value;
        if(name === ""){name = props.name;}
        if(keyword === ""){keyword = props.keyword;}
        if(rank === ""){rank = props.rank;}

        fetch(`http://localhost:8080/item/${props.item._id}`, {
            'method': 'PATCH',
            'headers':{
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization':cookies.get('token').token
            },
            'body':JSON.stringify({'name':name,'keyword':keyword,'rank':rank})
        })
        .then(response => response.json())
        .then(() => {props.change(name,keyword,rank)})
        .then(props.submit())
        .catch(err => {console.log(err);})
    }
    return(
        <form onSubmit={updateItem}>
            <label htmlFor={'newItemName' + props.item._id}>New Item Name: (Optional)</label><br/>
            <input type='text' id={'newItemName' + props.item._id} defaultValue={props.name}></input>
            <br/>
            <label htmlFor={'newItemKeyword' + props.item._id}>New Item Keyword: (Optional)</label><br/>
            <input type='text' id={'newItemKeyword' + props.item._id} defaultValue={props.keyword}></input>
            <br/>
            <label htmlFor={'newItemRank' + props.item._id}>New Item Rank: (Optional)</label><br/>
            <input type='text' id={'newItemRank' + props.item._id} defaultValue={props.rank}></input>
            <br/>
            <input type='submit'></input>
        </form>
    )
}
export default ChangeItemForm;