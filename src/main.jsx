import ReactDOM from "react-dom/client";

import App from './App'
import "./style.css";

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'



const entryPoint = document.getElementById("root");
ReactDOM.createRoot(entryPoint).render(<App />);

