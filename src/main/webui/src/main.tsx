import './index.css';
import App from './App.tsx';
import { BrowserRouter, Route, Routes } from "react-router";
import ReactDOM from 'react-dom/client';
import React from 'react';
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import UserProfile from "./pages/UserProfile.tsx";
import UserList from "./pages/UserList.tsx";
import {ThemeProvider} from "@material-tailwind/react";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
            <BrowserRouter basename="/">
                <Routes>
                    <Route path="/" element={<App/>}/>
                    <Route path="login" element={<Login/>}/>
                    <Route path="register" element={<Register/>}/>
                    <Route path="users/:userId" element={<UserProfile/>}/>
                    <Route path="users" element={<UserList/>}/>
                </Routes>
            </BrowserRouter>
    </React.StrictMode>,
);