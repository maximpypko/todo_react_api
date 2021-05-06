import { TodoItem } from "./TodoItem";

export function ListTodos({ todos, toggleTodo, deleteItem, editItem, filteredTodos} ) {
  
  return (
    <ul className="todo-list">
      {
        todos.map((todo) => {
        return (
          <TodoItem
            key={todo.id}
            id={todo.id}
            title={todo.title}
            completed={todo.completed}
            toggleTodo={toggleTodo}
            deleteItem={deleteItem}
            editItem={editItem}
            filteredTodos={filteredTodos}
            />
        )
      })}
    </ul>
  );
}
