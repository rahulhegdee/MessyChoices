import React, { useState } from 'react';
import Cookies from 'universal-cookie';
function MakeListForm(props){
    const cookies = new Cookies();
    const [filters, setFilters] = useState([]);
    const [filterErr, setFilterErr] = useState([]);
    function addEmptyFilter(){
        setFilters([...filters, '']);
        setFilterErr([...filterErr, false]);
    }
    function removeFilter(index){
        let arr = [...filters];
        let err = [...filterErr];
        arr.splice(index, 1);
        err.splice(index, 1);
        setFilters(arr);
        setFilterErr(err);
    }
    function changeFilterName(index){
        let text = document.getElementById(`filterText ${index}`).value;
        let err = [...filterErr];
        if(text === "data" || text === "user" || text === "listID" || text === "listName" || text === "name"){
            err[index] = true;
            setFilterErr(err);
            return;
        }
        let arr = [...filters];
        arr[index] = text;
        err[index] = false;
        setFilterErr(err);
        setFilters(arr);
    }
    function back(){
        props.back(0);
    }
    async function createList(event){
        event.preventDefault();

        let name = document.getElementById('listName').value;
        let type = document.getElementById('listType').value;
        console.log("hello" + filters);
        await fetch('http://localhost:8080/list',{
                'method':'POST',
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'authorization':cookies.get('token').token
                },
                body:JSON.stringify({'name':name,'type':type, 'filters':filters})
        })
        .then(response => response.json())
        .then(props.back(2))
        .then(() => {props.update()})
        .catch(err => {console.log(err); props.back(3)})
    }
    return(
        <form onSubmit={createList}>
            <label htmlFor='listName'>List Name:</label><br/>
            <input type='text' id='listName' required></input>
            <br/>
            <label htmlFor='listType'>List Type:</label><br/>
            <input type='text' id='listType' required></input>
            <br/>
            <label htmlFor='filters'>Filters: </label>
            <input type='button' id='filters' onClick={addEmptyFilter} value='Add Filter (+)'></input>
            {filters.map((filter,index) => (
                <div key={`filter ${index}`}>
                    <input id={`filterText ${index}`} type='text' value={filters[index]} onChange={() => {changeFilterName(index)}} required></input>
                    <input type='button' onClick={() => {removeFilter(index)}} value='Remove'></input>
                    {filterErr[index] && <label style={{color:'red'}}>That filter name was not available!</label>}
                    <br/>
                </div>
            ))}
            <br/>
            <input type='submit'></input>
            <input type='button' value='Back' onClick={back}></input>
        </form>
    )
}
export default MakeListForm;