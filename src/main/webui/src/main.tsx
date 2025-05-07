import './index.css';
import App from './App.tsx';
import { BrowserRouter, Route, Routes } from "react-router";
import ReactDOM from 'react-dom/client';
import React from 'react';
import Login from "./pages/Login.tsx";
import {ThemeProvider} from "@material-tailwind/react";
import Register from "./pages/Register.tsx";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ThemeProvider>
            <BrowserRouter basename="/">
                <Routes>
                    <Route path="/" element={<App/>}/>
                    <Route path="login" element={<Login/>}/>
                    <Route path="register" element={<Register/>}/>
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    </React.StrictMode>,
);