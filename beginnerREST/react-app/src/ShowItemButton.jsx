import React from 'react';
import ItemDetails from './ItemDetails';
function ShowItemButton(props){
    const [showDetails, setShowDetails] = React.useState(false);
    const [itemName, setItemName] = React.useState(props.item.name);
    function switchShowDetails(){
        setShowDetails(!showDetails);
    }
    function changeItemDetails(name){
        setItemName(name);
    }
    return(
        <div>
            <button onClick={switchShowDetails}>{itemName}</button>
            {showDetails && <ItemDetails item={props.item} update={props.update} change={changeItemDetails} name={itemName}/>}
        </div>
    )
}
export default ShowItemButton;