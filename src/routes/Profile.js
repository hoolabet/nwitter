import { authService, dbService } from "fbase";
import { updateProfile } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default ({userObj, refreshUser}) => {
    const navigate = useNavigate();
    const [newDisplayName,setNewDisplayName] = useState(userObj.displayName);
    const onLogOutClick = () => {
        authService.signOut();
        navigate("/");
    };
    const getMyNweets = async() => {
        const q = query(collection(dbService,"nweets"),
            where("creatorId","==",userObj.uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            console.log(doc.id,"==>",doc.data());
        });
    };
    useEffect(() => {
        getMyNweets();
    },[]);
    const onChange = (event) => {
        const {
            target:{value},
        } = event;
        setNewDisplayName(value);
    };
    const onSubmit = async(event) => {
        event.preventDefault();
        if(userObj.displayName !== newDisplayName){
            await updateProfile(authService.currentUser, { 
                displayName: newDisplayName 
            });
            refreshUser();
            }
    };
    return (
        <>
        <form onSubmit={onSubmit}>
            <input 
                onChange={onChange}
                type="text"
                placeholder="Display name"
                value={newDisplayName}
            />
            <input 
                type="submit"
                value="Update Profile"
            />
        </form>
            <button onClick={onLogOutClick}>
                Log Out
            </button>
        </>
    )
};