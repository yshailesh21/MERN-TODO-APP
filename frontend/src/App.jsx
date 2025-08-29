import { useEffect, useState } from "react";
import { MdOutlineDone } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { MdModeEditOutline } from "react-icons/md";
import { FaTrash } from "react-icons/fa6";
import { IoClipboardOutline } from "react-icons/io5";
import axios from 'axios';

function App() {
  const [newTodo, setNewTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [editingTodo, setEditingTodo] = useState(null);
  const [editedText, setEditedText] = useState("");

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    try {
      const response = await axios.post("/api/todos", { text: newTodo })
      setTodos([...todos, response.data]);
      setNewTodo('');
    } catch (error) {
      console.log("Error adding todo:", error);

    }
  };


  const fetchTodos = async () => {
    try {
      const response = await axios.get("/api/todos");
      console.log(response.data)
      setTodos(response.data)

    } catch (error) {
      console.log("Error fetching todos:", error)
    }
  }
  useEffect(() => {
    fetchTodos();
  }, []);

  const startEditing = (todo) => {
    setEditingTodo(todo._id);
    setEditedText(todo.text);
  };

  const saveEdit = async (id) => {
    try {
      const response = await axios.patch(`/api/todos/${id}`, {
        text: editedText,
      });
      setTodos(todos.map((todo) => (todo._id === id ? response.data : todo

      )));
      setEditingTodo(null);
    } catch (error) {
      console.log("Error updating todo:", error);

    }

  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`/api/todos/${id}`);
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.log("Error deleting todo:", error);

    }
  };

  const toggleTodo = async (id) => {
    try {
      const todo = todos.find((t) => t._id === id)
      const response = await axios.patch(`/api/todos/${id}`, {
        completed: !todo.completed
      })
      setTodos(todos.map((t) => t._id === id ?
        response.data : t));
    } catch (error) {
      console.log("Error toggline todo:", error)

    }
  };


  return (
    <div className="min-h-screen
    bg-gradient-to-br from gray-50 
    to-gray-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl
      shadow-xl w-full max-w-lg p-8">

        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Task Manager
        </h1>

        <form onSubmit={addTodo}
          className="flex items-center
        gap-2 shadow-sm border border-gray-200
        p-2 rounded-lg" >
          <input
            className=" flex-1 outline-none px-3 py-2
            text-gray-700 placeholder-gray-400"
            type="text" value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="What needs to be done?"
            required
          />
          <button type="submit" className="bg-blue-500
          hover:bg-blue-600 text-white px-4
          py-2 rounded-md font-medium
          cursor-pointer">Add Task

          </button>
        </form>
        <div className="mt-4">
          {todos.length === 0 ? (
            <div></div>
          ) : (
            <div className="flex flex-col gap-4">
              {todos.map((todo) => (
                <div key={todo._id}>
                  {editingTodo === todo._id ? (
                    <div className="flex items-center gap-x-3">
                      <input className=" flex-1 p-3 border rounded-lg 
                      border-gray-200 outline-none focus:ring-2
                      focus:ring-blue-400 text-gray-700 shadow-inner"
                        type="text" value={editedText} onChange={(e) => setEditedText(e.target.value)} />
                      <div className="flex gap-x-2">
                        <button onClick={() => saveEdit(todo._id)}
                          className="px-4 py-2 bg-green-400
                         text-white rounded-lg hover:bg-green-600
                         cursor-pointer">
                          <MdOutlineDone />
                        </button>
                        <button className="px-4 py-2 bg-gray-200
                        text-gray-700 rounded-lg hover:bg-gray-300
                        cursor-pointer"
                          onClick={() => setEditingTodo(null)}>
                          <IoClose />
                        </button>
                      </div>
                    </div>

                  ) : (
                    <div>
                      <div className="flex items-center
                      justify-between">
                        <div className="flex items-center gap-x-4 
                         overflow-hidden">
                          <button onClick={() => toggleTodo(todo._id)}
                            className={` flex-shrink-0 h-6 w-6 border rounded-full
                            flex items-center justify-center ${todo.completed ? "bg-green-500 border-green-500" : "border-gray-300 hover:border-blue-400"}`}
                          >
                            {todo.completed && <MdOutlineDone />}

                          </button>
                          <span className="text-gray-800 truncate 
                           font-medium">
                            {todo.text}

                          </span>
                        </div>

                        <div className="flex gap-x-2">
                          <button className="p-2 text-blue-500
                          hover:text-blue-700 rounded-lg 
                          hover:bg-blue-50 duration-200"
                            onClick={() => startEditing(todo)}>
                            <MdModeEditOutline />
                          </button>
                          <button onClick={() => deleteTodo(todo._id)}
                            className="p-2 text-red-500
                          hover:text-red-700 rounded-lg 
                          hover:bg-red-50 duration-200">
                            <FaTrash />
                          </button>
                        </div>

                      </div>
                    </div>
                  )}
                </div>

              ))}
            </div>
          )
          }
        </div>
      </div>
    </div >
  );
}

export default App
