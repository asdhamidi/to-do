import { React, useEffect, useState } from "react";
import { TbEdit } from "react-icons/tb";
import { AiOutlineDelete, AiOutlineCalendar } from "react-icons/ai";
import { MdOutlineDone } from "react-icons/md";
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";
import { format } from "date-fns";

export default function TaskPane(props) {
  const [taskModalOpen, setTMO] = useState(false);
  const [notes, setNotes] = useState(props.notes);

  return (
    <div>
      {props.currentProject != null && (
        <div className="taskPane">
          <TaskFilter />
          <div className="tools">
            <TaskSearchBar updateNotes={setNotes} notes={props.notes} />
            <button
              onClick={() => setTMO(!taskModalOpen)}
              className="addTaskBtn"
            >
              {" "}
              + Add New Task
            </button>
          </div>
          <div className="tasks">
            {notes.map((t) => {
              return (
                <TaskDiv
                  task={t}
                  key={t.ID}
                  ID={t.ID}
                  project={props.currentProject}
                  delete={props.delete}
                  counter={props.counter}
                />
              );
            })}
          </div>

          {taskModalOpen && <TaskModal submit={props.submit} close={setTMO} />}
        </div>
      )}
    </div>
  );
}

function TaskDiv(props) {
  const [state, setState] = useState({
    name: props.task.name,
    notes: props.task.notes,
    priority: props.task.priority,
    date: props.task.date,
    status: props.task.status,
  });

  const [editMode, setEditMode] = useState(false);
  const [expand, setExpand] = useState(false);

  let edit = (name, notes, priority, date, status) => {
    props.project.editNote(name, notes, priority, date, props.task.ID);
    setState({
      name: name,
      notes: notes,
      priority: priority,
      date: date,
      status: status
    });
  };

  let done = (e) => {
    e.stopPropagation();
    props.task.changeStatus();
    setState((prev) => ({ ...prev, status: !state.status }));
    props.counter();
  };

  return (
    <div className="task" onClick={() => setExpand(!expand)}>
      {!editMode && (
        <>
          <div className="taskDetails">
            <h3 className="task-name">{state.name}</h3>
            <div className="status">
              <div
                className="priority"
                style={{
                  border: "1px solid",
                  borderColor: state.priority,
                  backgroundColor: state.priority,
                  color: "white",
                }}
              >
                {state.priority === "red" && "High"}
                {state.priority === "yellow" && "Medium"}
                {state.priority === "green" && "Low"}
              </div>
              {state.status && (
                <div
                  className="status"
                  style={{
                    border: "1px solid greenyellow",
                    backgroundColor: "greenyellow",
                    color: "#fff",
                    padding: "0.25rem",
                    fontSize: "0.75rem",
                    borderRadius: "0.25rem",
                  }}
                >
                  Done
                </div>
              )}
            </div>
          </div>

          <span className="task-finish-date">
            {state.date !== "" && <AiOutlineCalendar />}
            {state.date !== "" &&
              " " +
                format(
                  new Date(
                    state.date.split("-")[0],
                    state.date.split("-")[1],
                    state.date.split("-")[2]
                  ),
                  "d MMM, R"
                )}
          </span>

          {expand && <h4 className="task-note">{state.notes}</h4>}
          <div className="taskButtons">
            <TbEdit
              className="editBtn"
              onClick={() => setEditMode(!editMode)}
            />
            <AiOutlineDelete
              className="deleteBtn"
              onClick={() => props.delete(props.task.ID)}
            />
            {!state.status && (
              <MdOutlineDone className="doneBtn" onClick={done} />
            )}
            {state.status && (
              <IoCheckmarkDoneCircleSharp className="doneBtn" onClick={done} />
            )}
          </div>
        </>
      )}
      {editMode && (
        <TaskEditModal details={props.task} submit={edit} close={setEditMode} />
      )}
    </div>
  );
}

function TaskEditModal(props) {
  const [state, setState] = useState({
    name: props.details.name,
    notes: props.details.notes,
    priority: props.details.priority,
    date: props.details.date,
    status: props.details.status
  });

  function submit(e) {
    e.preventDefault();
    props.submit(state.name, state.notes, state.priority, state.date, state.status);
    props.close(false);
  }

  return (
    <form className="task-edit-modal">
      <label htmlFor="name">
        Name:
        <input
          type="text"
          placeholder="Task Name"
          id="name"
          value={state.name}
          onChange={(e) =>
            setState((prev) => ({ ...prev, name: e.target.value }))
          }
          required
        />
      </label>
      <label htmlFor="notes">
        Notes:
        <input
          type="text"
          rows={2}
          placeholder="Notes"
          id="notes"
          value={state.notes}
          onChange={(e) =>
            setState((prev) => ({ ...prev, notes: e.target.value }))
          }
          required
        />
      </label>
      <label htmlFor="priority">
        Priority:
        <label
          style={{
            backgroundColor: "green",
            color: "white",
            border: "1px solid green",
            borderRadius: "0.25rem",
            padding: "0.25rem",
            textAlign: "center",
          }}
        >
          <input
            type="radio"
            value="green"
            name="priority"
            onClick={(e) =>
              setState((prev) => ({ ...prev, priority: "green" }))
            }
            defaultChecked={state.priority === "green"}
          />
          Low
        </label>
        <label
          style={{
            backgroundColor: "yellow",
            color: "white",
            border: "1px solid yellow",
            borderRadius: "0.25rem",
            padding: "0.25rem",
            textAlign: "center",
          }}
        >
          <input
            type="radio"
            value="yellow"
            name="priority"
            onClick={(e) =>
              setState((prev) => ({ ...prev, priority: "yellow" }))
            }
            defaultChecked={state.priority === "yellow"}
          />
          Medium
        </label>
        <label
          style={{
            backgroundColor: "red",
            color: "white",
            border: "1px solid red",
            borderRadius: "0.25rem",
            padding: "0.25rem",
            textAlign: "center",
          }}
        >
          <input
            type="radio"
            value="red"
            name="priority"
            onClick={(e) => setState((prev) => ({ ...prev, priority: "red" }))}
            defaultChecked={state.priority === "red"}
          />
          High
        </label>
      </label>
      <label htmlFor="finishDate">
        Date:
        <input
          type="date"
          name="finishDate"
          value={state.date}
          onChange={(e) =>
            setState((prev) => ({ ...prev, date: e.target.value }))
          }
          required
        />{" "}
      </label>
      <div>
        <button type="submit" className="submitBtn" onClick={submit}>
          Edit
        </button>
        <button
          type="reset"
          className="closeBtn"
          onClick={() => props.close(false)}
        >
          Close
        </button>
      </div>
    </form>
  );
}

function TaskModal(props) {
  const [state, setState] = useState({
    name: "",
    notes: "",
    priority: null,
    date: "",
  });

  function submit(e) {
    e.preventDefault();
    props.submit(state);
    props.close(false);
  }

  return (
    <>
      <div className="blur" onClick={() => props.close(false)} />
      <form className="taskModal">
        <label htmlFor="name">
          Name:
          <input
            type="text"
            placeholder="Task Name"
            id="name"
            onChange={(e) =>
              setState((prev) => ({ ...prev, name: e.target.value }))
            }
            required
          />
        </label>
        <label htmlFor="notes">
          Notes:
          <input
            type="text"
            rows={2}
            placeholder="Notes"
            id="notes"
            onChange={(e) =>
              setState((prev) => ({ ...prev, notes: e.target.value }))
            }
            required
          />
        </label>
        <label htmlFor="priority">
          Priority:
          <label
            style={{
              backgroundColor: "green",
              color: "white",
              border: "1px solid green",
              borderRadius: "0.25rem",
              padding: "0.25rem",
              textAlign: "center",
            }}
          >
            <input
              type="radio"
              value="green"
              name="priority"
              onClick={(e) =>
                setState((prev) => ({ ...prev, priority: "green" }))
              }
            />
            Low
          </label>
          <label
            style={{
              backgroundColor: "yellow",
              color: "white",
              border: "1px solid yellow",
              borderRadius: "0.25rem",
              padding: "0.25rem",
              textAlign: "center",
            }}
          >
            <input
              type="radio"
              value="yellow"
              name="priority"
              onClick={(e) =>
                setState((prev) => ({ ...prev, priority: "yellow" }))
              }
            />
            Medium
          </label>
          <label
            style={{
              backgroundColor: "red",
              color: "white",
              border: "1px solid red",
              borderRadius: "0.25rem",
              padding: "0.25rem",
              textAlign: "center",
            }}
          >
            <input
              type="radio"
              value="red"
              name="priority"
              onClick={(e) =>
                setState((prev) => ({ ...prev, priority: "red" }))
              }
            />
            High
          </label>
        </label>
        <label htmlFor="finishDate">
          Date:
          <input
            type="date"
            name="finishDate"
            onChange={(e) =>
              setState((prev) => ({ ...prev, date: e.target.value }))
            }
            required
          />{" "}
        </label>
        <div className="buttons">
          <button type="submit" className="submitBtn" onClick={submit}>
            Submit
          </button>
          <button
            type="reset"
            className="closeBtn"
            onClick={() => props.close(false)}
          >
            Close
          </button>
        </div>
      </form>
    </>
  );
}

function TaskFilter(props) {}
function TaskSearchBar(props) {
  useEffect(() => {
    props.updateNotes(props.notes);
  });

  return (
    <>
      <input
        type="text"
        placeholder="Search..."
        onChange={(e) => {
          e.preventDefault();
          props.updateNotes(
            props.notes.filter((n) => n.name.includes(e.target.value) || n.notes.includes(e.target.value))
          );
        }}
      />
    </>
  );
}
