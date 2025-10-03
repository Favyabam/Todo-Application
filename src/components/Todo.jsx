import React, { useEffect, useRef, useState } from 'react'
import { assets } from '../assets/assets'
import TodoItems from './TodoItems'

const Todo = () => {

  const [todoList, setTodoList] = useState(localStorage.getItem("todos")? JSON.parse(localStorage.getItem("todos")) : []); 
  const [darkMode, setDarkMode] = useState(false);
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editError, setEditError] = useState("");
  const inputRef = useRef();

  const add = ()=>{
    const inputText = inputRef.current.value.trim();
    if (inputText === "") {
      return null;
    }
    const newTodo = {
      id: Date.now(),
      text: inputText,
      isComplete:false,
    }
    setTodoList((prev)=> [...prev, newTodo]);
    inputRef.current.value = "";
  }

  const deleteTodo = (id) => {
    setTodoList((prevTodos) => {
      return prevTodos.filter((todo) => todo.id !== id)
    })
  }

  const toggle = (id) => {
    setTodoList((prevTodos)=>{
      return prevTodos.map((todo) =>{
        if(todo.id === id) {
          return {...todo, isComplete: !todo.isComplete}
        }
        return todo;
      })
    })
  }

  const startEdit = (id, text) => {
    setEditId(id);
    setEditText(text);
    setEditError("");
  }

  const handleEditChange = (e) => {
    setEditText(e.target.value);
    if (e.target.value.trim() !== "") setEditError("");
  }

  const saveEdit = (id) => {
    if (editText.trim() === "") {
      setEditError("Text cannot be empty.");
      return;
    }
    setTodoList((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, text: editText } : todo
      )
    );
    setEditId(null);
    setEditText("");
    setEditError("");
  }

  useEffect(()=>{
    localStorage.setItem("todos", JSON.stringify(todoList))
  },[todoList])

  return (
    <div className={`place-self-center w-11/12 max-w-md flex flex-col p-7 min-h-[500px] rounded-xl transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-white'} ${darkMode ? 'text-white' : 'text-black'}`}> 
      <button onClick={toggleDarkMode} className={`self-end mb-2 px-3 py-1 rounded-full text-sm font-medium border ${darkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-200 text-gray-800 border-gray-300'}`}>{darkMode ? 'Light Mode' : 'Dark Mode'}</button>

        {/* --- title ---- */}

      <div className='flex items-center mt-7 gap-2'>
        <div className='flex flex-col'>
          <div className='flex items-center gap-2'>
            <img src={assets.todo_icon} alt="" className='w-8' />
            <h1 className='text-3xl font-semibold'>My Tasks</h1>
          </div>
          <p className={`text-lg mt-1 font-medium italic ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Stay Productive Today!!!!!!</p>
        </div>
      </div>

        {/* --- input box ---- */}

    <div className={`flex items-center my-7 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-gray-400'}`}>
      <input ref={inputRef} type="text" placeholder='Add your task' className={`bg-transparent border-0 outline-none flex-1 h-14 pl-6 pr-2 ${darkMode ? 'placeholder:text-gray-400 text-white' : 'placeholder:text-slate-600 text-black'}`} />
      <button onClick={add} className='border-none rounded-full bg-blue-700 w-32 h-14 text-white text-lg font-medium cursor-pointer'>ADD +</button>
    </div>

        {/* --- todo list ---- */}

        <div>
          {todoList.map((item)=>{
            if (editId === item.id) {
              return (
                <div key={item.id} className="flex flex-col gap-1 my-3">
                  <div className="flex items-center gap-6">
                    <div className="flex flex-1 items-center">
                      <input type="text" value={editText} onChange={handleEditChange} className={`border rounded-full px-7 py-3 w-full ${darkMode ? 'bg-gray-900 text-white border-gray-700' : 'bg-gray-400'}`} />
                    </div>
                    <button onClick={()=>saveEdit(item.id)} className="bg-blue-600 text-white px-4 py-2 rounded-full">Save</button>
                    <button onClick={()=>{setEditId(null); setEditText(""); setEditError("");}} className="bg-gray-400 text-white px-4 py-2 rounded-full">Cancel</button>
                  </div>
                  {editError && <span className="text-red-500 text-sm ml-2">{editError}</span>}
                </div>
              );
            }
            return <TodoItems key={item.id} text={item.text} id={item.id} isComplete={item.isComplete} deleteTodo={deleteTodo} toggle={toggle} startEdit={startEdit} />
          })}
        </div>

    </div>
  )
}

export default Todo
