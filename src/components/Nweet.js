import { dbService, storageService } from "fbase";
import { deleteDoc , doc, updateDoc } from "firebase/firestore";
import { deleteObject , ref } from "firebase/storage";
import React, { useState } from "react";

const Nweet = ({nweetObj, isOwner , attachmentUrl}) => {
    const [editing, setEditing] = useState(false);
    const [newNweet, setNewNweet] = useState(nweetObj.text);
    const onDeleteClick = async() => {
        const ok = window.confirm("Are you sure you want to delete this nweet?");
        const nweetTextRef = doc(dbService,`nweets/${nweetObj.id}`);
        if(ok){
            await deleteDoc(nweetTextRef);
            await deleteObject(ref(storageService,nweetObj.attachmentUrl));
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
                    {nweetObj.attachmentUrl && <img src={nweetObj.attachmentUrl} width="100px" height="100px" />}
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