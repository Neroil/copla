import './index.css';
import App from './App.tsx';
import { BrowserRouter, Route, Routes } from "react-router";
import ReactDOM from 'react-dom/client';
import React from 'react';
import TestButton from "./pages/TestButton.tsx";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter basename="/">
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="test" element={<TestButton />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>,
);