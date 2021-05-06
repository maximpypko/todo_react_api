import {useState, useRef, useEffect} from "react";

export function TodoItem({ id, title, completed, toggleTodo, deleteItem, editItem}) {
  const editRef = useRef();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(title);
  const classNameCompleted = completed ? 'completed' : '';
  const className = editing ? 'editing' : '';

  useEffect(() => {
    if(editing) editRef.current.focus()
  }, [editing])
  
  return (
    <li className={`${classNameCompleted} ${className}`}>
      <div className="view">
        <input
          className="toggle"
          onChange={(e) => toggleTodo(id, title, e.target.checked)}
          checked = {completed}
          type="checkbox"
        />
        <label
          onDoubleClick={() => setEditing(true)}>
          {title}
        </label>
        <button className="destroy" onClick={()=>deleteItem(id)}></button>
      </div>
      <input
        type="text"
        className="edit"
        defaultValue={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        onBlur={(e) => {
          editItem(id, e.target.value, completed);
          setEditing(false);
        }}
        onKeyDown={(e) => {
          if (e.key == 'Enter') editItem(id, e.target.value, completed);
         setEditing(() => e.key === "Enter" ? false : true)
        }}
        ref={editRef}/>
    </li>
  );
}
