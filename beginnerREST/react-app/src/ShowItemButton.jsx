import React from 'react';
import ItemDetails from './ItemDetails';
function ShowItemButton(props){
    const [showDetails, setShowDetails] = React.useState(false);
    const [itemName, setItemName] = React.useState(props.item.name);
    const [itemKeyword, setItemKeyword] = React.useState(props.item.keyword);
    const [itemRank, setItemRank] = React.useState(props.item.rank);
    function switchShowDetails(){
        setShowDetails(!showDetails);
    }
    function changeItemDetails(name, keyword, rank){
        setItemName(name);
        setItemKeyword(keyword);
        setItemRank(rank);
    }
    return(
        <div>
            <button onClick={switchShowDetails}>{itemName}</button>
            {showDetails && <ItemDetails item={props.item} update={props.update} change={changeItemDetails} name={itemName} keyword={itemKeyword} rank={itemRank}/>}
        </div>
    )
}
export default ShowItemButton;