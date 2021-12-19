import React from 'react';
import Cookies from 'universal-cookie';
function RandomForm(props){
    const cookies = new Cookies();
    function getRandom(event){
        event.preventDefault();
        let listid = props.list._id;
        let keyword = document.getElementById("keywordFilter" + props.list._id).value;
        let rank = document.getElementById("rankFilter" + props.list._id).value;
        fetch(`http://localhost:8080/random/${listid}`,{
            'method':'POST',
            'headers':{
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization':cookies.get('token').token
            },
            'body':JSON.stringify({
                'keyword':keyword,
                'rank':rank
            })
        })
        .then(response => response.json())
        .then(response => {alert(response.item.name)})
        .catch(err => {console.log(err)})
    }
    return(
        <form onSubmit={getRandom}>
            <p>Type in any optional parameters for the random item: </p>
            <label htmlFor={"keywordFilter" + props.list._id}>Keyword: (Optional)</label>
            <br />
            <input type="text" id={"keywordFilter" + props.list._id}/>
            <br />
            <label htmlFor={"rankFilter" + props.list._id}>Rank: (Optional)</label>
            <br />
            <input type="text" id={"rankFilter" + props.list._id}/>
            <br />
            <input type="submit"></input>
        </form>
    )
}
export default RandomForm;