import React, { useEffect, useState } from "react";
import "./App.css";
import { FaXmark } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";

function App() {
  const [isCompleteScreen, setIsCompleteScreen] = useState(false);
  const [allToDos, setToDos] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [completedToDos, setCompletedToDos] = useState([]);
  const [currentEdit, setCurrentEdit] = useState("");
  const [currentEditedItem, setCurrentEditedItem] = useState("");

  const handleAddToDo = () => {
    let newToDoItem = {
      title: newTitle,
      description: newDescription,
    };

    let updatedToDoArray = [...allToDos];
    updatedToDoArray.push(newToDoItem);
    setToDos(updatedToDoArray);
    localStorage.setItem("todolist", JSON.stringify(updatedToDoArray));
  };

  const handleDeleteToDo = (index) => {
    let reducedToDo = [...allToDos];
    reducedToDo.splice(index, 1);

    localStorage.setItem("todolist", JSON.stringify(reducedToDo));
    setToDos(reducedToDo);
  };

  const handleComplete = (index) => {
    let now = new Date();
    let dd = now.getDate();
    let mm = now.getMonth() + 1;
    let yyyy = now.getFullYear();
    let h = now.getHours();
    let m = now.getMinutes();
    let s = now.getSeconds();

    let completedOn =
      dd + "-" + mm + "-" + yyyy + " at " + h + ":" + m + ":" + s;

    let filteredItem = {
      ...allToDos[index],
      completedOn: completedOn,
    };

    let updatedCompletedArray = [...completedToDos];
    updatedCompletedArray.push(filteredItem);
    setCompletedToDos(updatedCompletedArray);
    handleDeleteToDo(index);
    localStorage.setItem(
      "completedToDos",
      JSON.stringify(updatedCompletedArray)
    );
  };

  const handleDeleteCompletedToDo = (index) => {
    let reducedToDo = [...completedToDos];
    reducedToDo.splice(index, 1);

    localStorage.setItem("completedToDos", JSON.stringify(reducedToDo));
    setCompletedToDos(reducedToDo);
  };

  useEffect(() => {
    let savedToDo = JSON.parse(localStorage.getItem("todolist"));
    let savedCompletedToDo = JSON.parse(localStorage.getItem("completedToDos"));
    if (savedToDo) {
      setToDos(savedToDo);
    }

    if (savedCompletedToDo) {
      setCompletedToDos(savedCompletedToDo);
    }
  }, []);

  const handleEdit = (index, item) => {
    setCurrentEdit(index);
    setCurrentEditedItem(item);
  };

  const handleUpdateTitle = (value) => {
    setCurrentEditedItem((prev) => {
      return { ...prev, title: value };
    });
  };

  const handleUpdateDescription = (value) => {
    setCurrentEditedItem((prev) => {
      return { ...prev, description: value };
    });
  };

  const handleUpdateToDo = () => {
    let newToDo = [...allToDos];
    newToDo[currentEdit] = currentEditedItem;
    setToDos(newToDo);
    setCurrentEdit("");
  };

  return (
    <div className="App">
      <h1>Daily Planner</h1>
      <div className="todo-wrapper">
        <div className="todo-input">
          <div className="todo-input-item">
            <label>Title</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="What's the task title"
            />
          </div>
          <div className="todo-input-item">
            <label>Description</label>
            <input
              type="text"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="What's the description"
            />
          </div>
          <div className="todo-input-item todo-input-btn">
            <button
              type="button"
              onClick={handleAddToDo}
              className="primaryBtn"
            >
              <FaPlus />
            </button>
          </div>
        </div>
        <div class="btn-area">
          <button
            className={`secondaryBtn ${isCompleteScreen === false && "active"}`}
            onClick={() => setIsCompleteScreen(false)}
          >
            To do
          </button>
          <button
            className={`secondaryBtn ${isCompleteScreen === true && "active"}`}
            onClick={() => setIsCompleteScreen(true)}
          >
            Completed
          </button>
        </div>
        <div className="todo-list">
          {isCompleteScreen === false &&
            allToDos.map((item, index) => {
              if (currentEdit === index) {
                return (
                  <div className="edit_wrapper" key={index}>
                    <input
                      placeholder="Updated Title"
                      onChange={(e) => handleUpdateTitle(e.target.value)}
                      value={currentEditedItem.title}
                    />
                    <textarea
                      placeholder="Updated Content"
                      rows={4}
                      onChange={(e) => handleUpdateDescription(e.target.value)}
                      value={currentEditedItem.description}
                    />
                    <button
                      type="button"
                      onClick={handleUpdateToDo}
                      className="primaryBtn"
                    >
                      Update
                    </button>
                  </div>
                );
              } else {
                return (
                  <div className="todo-list-item" key={index}>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>

                    <div>
                      <MdModeEdit
                        className="check-edit-icon"
                        onClick={() => handleEdit(index, item)}
                        title="Edit"
                      />
                      <FaCheck
                        className="check-icon"
                        onClick={() => handleComplete(index)}
                        title="Complete"
                      />
                      <FaXmark
                        className="icon"
                        onClick={() => handleDeleteToDo(index)}
                        title="Delete"
                      />
                    </div>
                  </div>
                );
              }
            })}
          {isCompleteScreen === true &&
            completedToDos.map((item, index) => {
              return (
                <div className="todo-list-item" key={index}>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <p>
                      <small className="small">
                        Completed on: {item.completedOn}
                      </small>
                    </p>
                  </div>

                  <div>
                    <FaXmark
                      className="icon"
                      onClick={() => handleDeleteCompletedToDo(index)}
                      title="Delete?"
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default App;
