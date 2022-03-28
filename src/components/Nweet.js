import { async } from "@firebase/util";
import { dbService } from "fbase";
import { deleteDoc , doc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";

const Nweet = ({nweetObj, isOwner}) => {
    const [editing, setEditing] = useState(false);
    const [newNweet, setNewNweet] = useState(nweetObj.text);
    const onDeleteClick = async() => {
        const ok = window.confirm("Are you sure you want to delete this nweet?");
        const nweetTextRef = doc(dbService,`nweets/${nweetObj.id}`);
        if(ok){
            await deleteDoc(nweetTextRef);
        }
    };
    const toggleEditing = () => setEditing((prev) => !prev);
    const onSubmit = async(event) => {
        event.preventDefault();
        const nweetTextRef = doc(dbService,`nweets/${nweetObj.id}`);
        await updateDoc(nweetTextRef,{
            text: newNweet
        });
        setEditing(false);
    };
    const onChange = async(event) => {
        const { target: {value},} = event;
        setNewNweet(value);
    };
    return (
        <div>
            {editing ? (
                <>
                <form onSubmit={onSubmit}>
                    <input 
                        onChange={onChange}
                        type="text" 
                        value={newNweet} 
                        placeholder="Edit your nweet"
                        required 
                    />
                    <input 
                        type="submit" 
                        value="Update Nweet" 
                    />
                </form>
                <button onClick={toggleEditing}>Cancel</button>
                </>
            ) : (
                <>
                    <h4>{nweetObj.text}</h4>
                    {isOwner && (
                        <>
                            <button onClick={onDeleteClick}>Delete</button>
                            <button onClick={toggleEditing}>Update</button>
                        </>    
                    )}    
                </>
            )}
        </div>
    );
};



export default Nweet;