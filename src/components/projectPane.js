import { React, useEffect, useState } from "react";
import { Project } from "./constructors";
import { TbEdit } from "react-icons/tb";
import { AiOutlineDelete } from "react-icons/ai";

export default function ProjectPane(props) {
  const [projectModalOpen, setPMO] = useState(false);

  return (
    <div className="projectPane">
      <h1 className="title">KaamDhaam</h1>
      <div className="projects">
        {props.projects.map((proj) => (
          <ProjectDiv
            project={proj}
            key={proj.ID}
            ID={proj.ID}
            load={props.load}
            delete={props.delete}
            CP={props.currentProject}
          />
        ))}
        <button onClick={() => setPMO(!projectModalOpen)} className="addBtn">
          {" "}
          + Add New Project{" "}
        </button>
        {projectModalOpen && (
          <ProjectModal submit={props.submit} close={setPMO} />
        )}
      </div>
      <CompletionBar projects={props.projects} progress={props.counter} />
    </div>
  );
}

function ProjectDiv(props) {
  const [editMode, setEditMode] = useState(false);
  let classes =
    props.CP != null
      ? props.CP.ID === props.project.ID
        ? "project activeProject"
        : "project"
      : "project";

  let activate = (e) => {
    document.querySelectorAll(".project").forEach((cls) => {
      cls.classList.remove("activeProject");
    });
    document.getElementById(props.project.ID).classList.add("activeProject");
    props.load(props.project.ID);
  };

  let edit = (newName) => {
    setEditMode(!editMode);
    props.project.edit(newName);
  };

  return (
    <div className={classes} onClick={activate} id={props.project.ID}>
      {editMode && (
        <ProjectEditModal
          submit={edit}
          details={props.project}
          close={setEditMode}
        />
      )}
      {!editMode && (
        <div className="projectName">
          {props.project.name}
          <div className="buttons">
            <TbEdit
              className="editBtn"
              onClick={() => setEditMode(!editMode)}
            />
            <AiOutlineDelete
              className="deleteBtn"
              onClick={() => props.delete(props.ID)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function ProjectEditModal(props) {
  const [state, setState] = useState(props.details.name);

  return (
    <form className="project-edit-modal ">
      <label htmlFor="name">
        Name:
        <input
          type="text"
          placeholder="Task Name"
          id="name"
          value={state}
          onChange={(e) => {
            setState(e.target.value);
          }}
        />
      </label>
      <button
        type="submit"
        className="submitBtn"
        onClick={(e) => {
          e.preventDefault();
          props.submit(state);
          props.close(false);
        }}
      >
        Edit
      </button>
    </form>
  );
}

function ProjectModal(props) {
  const [state, setState] = useState("");

  return (
    <form className="projectModal">
      <label htmlFor="name">Name:</label>
      <input
        type="text"
        placeholder="Task Name"
        id="name"
        onChange={(e) => {
          setState(e.target.value);
        }}
      />
      <button
        type="submit"
        className="submitBtn"
        onClick={(e) => {
          e.preventDefault();
          props.submit(Project(state));
          props.close(false);
        }}
      >
        Submit
      </button>
    </form>
  );
}

function CompletionBar(props) {
  let [done, total, percentage] = props.progress;
  
  return (
    <div className="tasksCompleted">
      <span>
        Tasks Completed: {done} / {total}{" "}
      </span>
      <div className="progressBar">
        <div
          style={{
            width: percentage + "%",
            height: "5px",
            backgroundColor: "green",
            borderRadius: "0.5rem",
          }}
        />
      </div>
    </div>
  );
}
