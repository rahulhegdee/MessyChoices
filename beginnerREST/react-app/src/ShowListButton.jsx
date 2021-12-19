import React from 'react';
import ListDetails from './ListDetails';
function ShowListButton(props){
    const [showDetails, setShowDetails] = React.useState(false);
    const [listName, setListName] = React.useState(props.list.name);
    const [listType, setListType] = React.useState(props.list.type);
    function changeListDetails(name, type){
        setListName(name);
        setListType(type);
    }
    function switchShowDetails(){
        setShowDetails(!showDetails);
    }
    return(
        <div>
            <button onClick={switchShowDetails}>{listName}</button>
            {showDetails && <ListDetails list={props.list} name={listName} type={listType} change={changeListDetails} update={props.updateLists}></ListDetails>}
        </div>
    )
}
export default ShowListButton;