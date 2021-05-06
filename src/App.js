import "./styles.css";
import { InputTodo } from "./InputTodo";
import { ListTodos } from "./ListTodos";
import { Footer } from "./Footer";
import { ToggleTodos } from "./ToggleTodos";
import { useEffect, useState } from "react";


export default function App() {
  const [error, setError] = useState(null);
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sizeServerTodos, setSizeServerTodos] = useState(0);
  const [serverStatistic, setServerStatistic] = useState({
    length: 0,
    active: 0,
    complete: 0
  });
  
  const isCompletedAll = (serverStatistic.active === 0) && serverStatistic.length > 0;

  useEffect(() => {
    fetch('http://localhost:3000/todos')
      .then(response => {
        if (response.status === 200) {
          return response.json()
        } else {
          setError(response.status)
        }
      })
      .then(todos => setTodos(todos))
  }, []);
  
  useEffect(() => {
    fetch(`http://localhost:3000/todos?_limit=0`)
      .then(response => response.status === 200 ? setSizeServerTodos(+response.headers.get('X-Total-Count')) : setError(response.status))
  }, [todos, filter]);

  useEffect(() => {
    fetch('http://localhost:3000/todos')
      .then(response => {
        if (response.status === 200) {
          return response.json()
        } else {
          setError(response.status)
        }
      })
        .then(todos => {
          const newLength = todos.length;
          const newActive = todos.filter((todo) => !todo.completed).length;
          const newComplete = newLength - newActive;
          setServerStatistic({
            length: newLength,
            active: newActive,
            complete: newComplete
          });
        })
  }, [todos]);

  useEffect(() => {
    setError(null)
  },[todos])

  const addItem = ({ value }) => {
    const newTodos = {
      id: Date.now(),
      title: value,
      completed: false,
    };
    
    fetch('http://localhost:3000/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(newTodos)
    })
      .then(response => response.status === 201 ? filteredTodos(filter): setError(response.status))
  };

  const deleteItem = (id) => {
   
    fetch(`http://localhost:3000/todos/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      }
    })
      .then(response => response.status === 200 ? filteredTodos(filter) : setError(response.status))
  };

  const editItem = (id, newValue, completed) => {
    
    fetch(`http://localhost:3000/todos/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({
        'id': id,
        'title': `${newValue}`,
        'completed': completed
      })
    })
      .then(response => response.status === 200 ? filteredTodos(filter) : setError(response.status))
  };

  const filteredTodos = (filter) => {

    if (filter === 'all') {
      fetch('http://localhost:3000/todos')
        .then(response => response.json()
          .then(todos => setTodos(todos.reverse())))
    } else {
      fetch(`http://localhost:3000/todos?completed=${filter === 'completed' ? true : false}`)
        .then(response => {
          if (response.status === 200) {
            return response.json()
          } else {
            setError(response.status)
          }
        })
          .then(todos => setTodos(todos.reverse()))
    }
  };
  
  const toggleTodo = (id, title, completed) => {
   
    fetch(`http://localhost:3000/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({
        'id': id,
        'title': title,
        'completed': completed
      })
    })
      .then(response => response.status === 200 ? filteredTodos(filter) : setError(response.status))
  };
 
  const deleteCompletedTodos = () => {
    let countSuccessfulRequest = 0;
    
    todos.map(todo => {
      if (todo.completed === true) {
        fetch(`http://localhost:3000/todos/${todo.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          }
        })
          .then(response => {
            response.status === 200 ? countSuccessfulRequest++ : setError(response.status);
            if (countSuccessfulRequest === serverStatistic.complete) filteredTodos(filter)
          })
      }
    })
  };

  const toggleAll = (checked) => {
    let countSuccessfulRequest = 0;

    todos.map(todo => {

      fetch(`http://localhost:3000/todos/${todo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
          'id': todo.id,
          'title': todo.title,
          'completed': checked
        })
      })
        .then(response => {
          response.status === 200 ? countSuccessfulRequest++ : setError(response.status)
          if (countSuccessfulRequest === serverStatistic.length) filteredTodos(filter)
        })   
    })
  };
  
  return (
    <section className="todoapp">
      <header className="header">
        <h1>todos</h1>
        {error && <p>Ooops... Something went wrong. Error code {error}</p>}
        <InputTodo onAddItem={addItem} />
      </header>
      {!sizeServerTodos || (<section className="main">
        <ToggleTodos isCompletedAll={isCompletedAll} toggleAll={toggleAll}/>
        <ListTodos
          todos={todos}
          toggleTodo={toggleTodo}
          deleteItem={deleteItem}
          editItem={editItem}
          filteredTodos={filteredTodos}
        />
      </section>)}
      {!sizeServerTodos || (<Footer
        countActiveTodos={serverStatistic.active}
        countCompleteTodos={serverStatistic.complete}
        filter={filter}
        setFilter={setFilter}
        filteredTodos={filteredTodos}
        deleteCompletedTodos={deleteCompletedTodos}/>)}
    </section>
  );
}