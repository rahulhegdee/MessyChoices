import React, {useState} from 'react';
import Cookies from 'universal-cookie';
import LogoutButton from './LogoutButton';
import DeleteButton from './DeleteButton';
import ConfirmButton from './ConfirmDelete';
import DenyButton from './DenyDelete';
import MakeListButton from './MakeListButton';
import MakeListForm from './MakeListForm';
import ShowListButton from './ShowListButton';
function Welcome(props){
    const cookies = new Cookies();
    const [affirmDelete, setAffirmDelete] = useState(false);
    const [createList, setCreateList] = useState(0); //0:Hide createListForm, 1:Show createListForm, 2:List Created Success, 3: List Created Failed
    const [lists, setLists] = useState([]);
    function changeAffirmDelete(affirmation){
        setAffirmDelete(affirmation);
    }
    function showCreateList(affirmation){
        setCreateList(affirmation);
        /*
        if(affirmation == 2){
            setTimeout(
                function(){showLists()}, 
                100);     
        }
        */
    }
    function showLists(){
        fetch(`http://localhost:8080/lists/${props.current.username}`,{
            'method':'GET',
            'headers':{
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization':cookies.get('token').token
            }
        })
        .then(response => response.json())
        .then(response => {
            setLists(response.lists);
        })
        .catch(err => console.log(err));
    }
    function displayLists(listArr){
        for(let i = 0; i < listArr.length; i++){
            console.log(listArr[i])
        }
    }
    React.useEffect(()=>{
        showLists();
    },[])//the [] means this useEffect will only happen once
    return(
        <div>
            <h1>Hello, {props.current.username}!</h1>
            
            <MakeListButton create={showCreateList}/>
            {(createList == 1) && <MakeListForm update={showLists} back={showCreateList}/>}
            {(createList == 2) && <label style={{color:'green'}}> List Created Successfully!</label>}
            {(createList == 3) && <label style={{color:'red'}}> Unable to Create List</label>}
            <br />
            <LogoutButton back={props.back}/>
            <>  </>
            {(!affirmDelete) ? <DeleteButton initiate={changeAffirmDelete}/> :
                <div>
                    <p>Are you sure? </p>
                    <ConfirmButton userID={props.current.id} user={props.current.username} back={props.back}/>
                    <> </>
                    <DenyButton initiate={changeAffirmDelete}/>
                </div>
            }
            <br />
            <h5>Lists:</h5>
            {lists.map(list => ( //goes through the lists array and for each list in it, maps a new ShowListButton with that list in its props
                <ShowListButton list={list} updateLists={showLists} key={list._id}/> //key is needed to identify each unique element as different
            ))}
        </div>
    )
}

export default Welcome;