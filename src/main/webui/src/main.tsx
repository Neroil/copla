import './index.css';
import App from './App.tsx';
import { BrowserRouter, Route, Routes } from "react-router";
import ReactDOM from 'react-dom/client';
import React from 'react';
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import UserProfile from "./pages/UserProfile.tsx";
import UserList from "./pages/UserList.tsx";
import BlueskyCallback from "./pages/BlueskyCallback.tsx";
import ArtistDirectory from "./pages/ArtistDirectory.tsx";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
            <BrowserRouter basename="/">
                <Routes>
                    <Route path="/" element={<App/>}/>
                    <Route path="login" element={<Login/>}/>
                    <Route path="register" element={<Register/>}/>
                    <Route path="users/:userId" element={<UserProfile/>}/>
                    <Route path="users" element={<UserList/>}/>
                    <Route path="callback" element={<BlueskyCallback />}/>
                    <Route path="commissions" element={<ArtistDirectory />}/>
                </Routes>
            </BrowserRouter>
    </React.StrictMode>,
);