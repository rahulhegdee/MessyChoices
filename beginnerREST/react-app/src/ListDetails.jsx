import React from 'react';
import MakeItemForm from './MakeItemForm';
import ItemButton from './ShowItemButton';
import Cookies from 'universal-cookie';
import RandomButton from './RandomButton';
import RandomForm from './RandomForm';
import ChangeListForm from './ChangeListForm';
function ListDetails(props){
    const cookies = new Cookies();
    const [showForm, setShowForm] = React.useState(0); //0:Hide MakeItemForm, 1:Show MakeItemForm, 2:Item Created Success, 3: Item Created Failed
    const [changeList, setChangeList] = React.useState(false);
    const [items, setItems] = React.useState([]);
    const [showRandom, setShowRandom] = React.useState(false);
    function changeShowForm(value){
        setShowForm(value);
        /*
        if(value == 2){
            setTimeout(
                function(){getItems()}, 
                100);
        }
        */
    }
    function switchShowRandom(){
        setShowRandom(!showRandom);
    }
    function switchChangeList(){
        setChangeList(!changeList);
    }
    function getItems(){
        fetch(`http://localhost:8080/list/items/${props.list._id}`, {
            'method':'GET',
            'headers':{
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization':cookies.get('token').token
            }
        })
        .then(response=>response.json())
        .then(response=>{
            setItems(response.items);
        })
        .catch(err=>console.log(err));
    }
    function deleteList(){
        fetch(`http://localhost:8080/list/${props.list._id}`, {
            'method': 'DELETE',
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
    React.useEffect(()=>{
        getItems();
    },[])
    return(
        <div>
            <p>name: {props.name}</p>
            <p>type: {props.type}</p>
            <h6>Items: </h6>
            {items.map(item => ( //goes through the lists array and for each list in it, maps a new ShowListButton with that list in its props
                <ItemButton item={item} update={getItems} key={item._id}/>//key is needed to identify each unique element as different
            ))}
            <br />
            <button onClick={() => changeShowForm(1)}>Add Item</button>
            {(showForm == 1) && <MakeItemForm back={changeShowForm} list={props.list} update={getItems}/>}
            {(showForm == 2) && <label style={{color:'green'}}> Item Created Successfully!</label>}
            {(showForm == 3) && <label style={{color:'red'}}> Unable to Create Item</label>}
            <RandomButton rand={() => switchShowRandom()}/>
            {showRandom && <RandomForm list={props.list}/>}
            <br/>
            <button onClick={() => switchChangeList()}>Update List</button>
            <button onClick={() => deleteList()}>Delete List</button>
            {changeList && <ChangeListForm list={props.list} name={props.name} type={props.type} change={props.change} submit={switchChangeList}/>}
            <br /><br />
        </div>
    )
}

export default ListDetails;