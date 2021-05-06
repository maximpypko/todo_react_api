export const Footer = ({
  countActiveTodos,
  countCompleteTodos,
  filter,
  setFilter,
  filteredTodos,
  deleteCompletedTodos }) => {
  const handleFilter = (e, filter) => {
    setFilter(filter);
    e.preventDefault();
    filteredTodos(filter);
  };
  const changeClassName = className => filter === className ? "selected" : "";

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{countActiveTodos} </strong>
      items left
    </span>
      <ul className="filters">
        <li>
          <a
            href="/"
            className={changeClassName("all")}
            onClick={(e) => handleFilter(e, "all")}
          >
            All
          </a>
        </li>
        <li>
          <a
            href="/active"
            className={changeClassName("active")}
            onClick={(e) => handleFilter(e, "active")}
          >
            Active
          </a>
        </li>
        <li>
          <a
            href="/completed"
            className={changeClassName("completed")}
            onClick={(e) => handleFilter(e, "completed")}
          >
            Completed
          </a>
        </li>
      </ul>
      {countCompleteTodos === 0 || (<button className="clear-completed"
      onClick={deleteCompletedTodos}>Clear completed</button>)}
    </footer>
  );
};
