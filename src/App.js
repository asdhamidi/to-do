import { useEffect, useState } from "react";
import ProjectPane from "./components/projectPane";
import TaskPane from "./components/taskPane";

function App(props) {
  const [projects] = useState([props.projects]);
  return <Manager projects={projects} />;
}

function Manager(props) {
  const [projects, setProjects] = useState(props.projects);
  const [currentProject, setCP] = useState(null);
  const [notes, setNotes] = useState([]);
  const [count, updateCount] = useState([]);

  useEffect(() => updateCounter());

  let addProject = (newProj) => {
    setProjects((prev) => [...prev, newProj]);
    setCP(newProj);
    setNotes(newProj.notes);
  };

  let deleteProject = (ID) => {
    if (ID === currentProject.ID) setCP(null);
    setProjects(projects.filter((pr) => pr.ID !== ID));
  };

  let loadProject = (ID) => {
    setCP(getProjectByID(ID));
    setNotes(getProjectByID(ID).notes);
  };

  let getProjectByID = (ID) => {
    for (let i = 0; i < projects.length; i++)
      if (projects[i].ID === ID) return projects[i];
  };

  let addNote = (note) => {
    currentProject.addNote(note);
    updateCounter();
  };

  let deleteNote = (ID) => {
    currentProject.deleteNote(ID);
    setNotes(currentProject.notes);
    updateCounter();
  };

  let updateCounter = () => {
    let total = 0,
      done = 0;
    projects.forEach((proj) => {
      proj.notes.forEach((n) => {
        total++;
        if (n.status) done++;
      });
    });

    updateCount([
      done,
      total,
      parseFloat((parseFloat(done) / parseFloat(total)) * 100),
    ]);
  };

  return (
    <div className="App">
      <ProjectPane
        projects={projects}
        submit={addProject}
        load={loadProject}
        delete={deleteProject}
        currentProject={currentProject}
        counter={count}
      />
      <TaskPane
        currentProject={currentProject}
        submit={addNote}
        delete={deleteNote}
        notes={notes}
        load={loadProject}
        counter={updateCounter}
      />
    </div>
  );
}

export default App;
