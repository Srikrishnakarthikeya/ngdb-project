import React, { createContext, useContext, useEffect, useState } from 'react';
const AuthContext=createContext(null);
export const AuthProvider=({children})=>{
 const [currentUser,setCurrentUser]=useState(()=>{try{return JSON.parse(localStorage.getItem('nitt_ca_auth_user'))||null}catch{return null}});
 useEffect(()=>{if(currentUser)localStorage.setItem('nitt_ca_auth_user',JSON.stringify(currentUser));else localStorage.removeItem('nitt_ca_auth_user')},[currentUser]);
 const api=async(path,body)=>{let response;try{response=await fetch(`/api/auth${path}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})}catch{throw new Error('Backend unavailable. Start the backend on http://localhost:5000.')};const data=await response.json().catch(()=>({}));if(!response.ok)throw new Error(data.error||'Authentication failed');if(data.token)localStorage.setItem('nitt_ca_auth_token',data.token);return data;};
 const loginStudent=async(idOrEmail,password)=>{try{const data=await api('/student/login',{identifier:idOrEmail,password});setCurrentUser(data.user);return{success:true,user:data.user}}catch(error){return{success:false,error:error.message}}};
 const registerStudent=async(details)=>{try{const data=await api('/student/register',details);setCurrentUser(data.user);return{success:true,user:data.user}}catch(error){return{success:false,error:error.message}}};
 const loginAdmin=async(email,password,role='ADMIN')=>{try{const data=await api('/staff/login',{email,password,role});setCurrentUser(data.user);return{success:true,user:data.user}}catch(error){return{success:false,error:error.message}}};
 const switchRole=(role)=>{if(role==='GUEST'){setCurrentUser(null);return} if(role==='STUDENT')setCurrentUser({id:'PART-001',name:'Prasad',email:'prasad45@gmail.com',role:'STUDENT'});else if(role==='ADMIN')setCurrentUser({id:'ADM-001',name:'Admin',email:'admin@gmail.com',role:'ADMIN'});else setCurrentUser({id:'COORD-01',name:'Coordinator',email:'coordinator@example.com',role:'COORDINATOR',assignedEvents:['EVT-101','EVT-104']})};
 const changePassword=async(currentPassword,newPassword)=>{try{const data=await api('/change-password',{userId:currentUser?.id,currentPassword,newPassword});setCurrentUser(data.user);return{success:true,user:data.user,message:data.message}}catch(error){return{success:false,error:error.message}}};
 const logout=()=>{localStorage.removeItem('nitt_ca_auth_token');setCurrentUser(null)};
 const value={currentUser,isAuthenticated:!!currentUser,isStudent:currentUser?.role==='STUDENT',isAdmin:currentUser?.role==='ADMIN',isCoordinator:currentUser?.role==='COORDINATOR',isStaffOrAdmin:currentUser?.role==='ADMIN'||currentUser?.role==='COORDINATOR',loginStudent,registerStudent,loginAdmin,changePassword,switchRole,logout};
 return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export const useAuth=()=>{const context=useContext(AuthContext);if(!context)throw new Error('useAuth must be used within an AuthProvider');return context};
