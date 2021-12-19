import React from 'react';
function MakeListButton(props){
    function initiate(){
        props.create(1);
    }
    return(
        <button onClick={initiate}>Make a New List!</button>
    )
}

export default MakeListButton;