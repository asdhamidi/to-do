import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Project, Note } from "./components/constructors";

let testProject = new Project("Test");
let testNote = new Note("Test Name", "red", "Test Notes", "2022-10-28");
testProject.addNote(testNote);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App projects={testProject}/>
  </React.StrictMode>
);
