import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const todosPerPage = 10;

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/todos")
      .then((res) => res.json())
      .then((data) => {
        setTodos(data);
        setFilteredTodos(data);
      });
  }, []);

  const handleSort = () => {
    const sorted = [...filteredTodos].sort((a, b) =>
      sortOrder === "asc" ? a.id - b.id : b.id - a.id
    );
    setFilteredTodos(sorted);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    if (!value) {
      setFilteredTodos(todos);
      return;
    }
    setFilteredTodos(
      todos.filter(
        (todo) =>
          todo.id.toString().includes(value) ||
          todo.title.toLowerCase().includes(value) ||
          (todo.completed ? "completed" : "pending").includes(value)
      )
    );
    setCurrentPage(1);
  };

  const handleViewUser = (userId, todo) => {
    fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
      .then((res) => res.json())
      .then((userData) => {
        setSelectedUser({
          todoId: todo.id,
          todoTitle: todo.title,
          userId: userData.id,
          name: userData.name,
          email: userData.email,
        });
      });
  };

  const indexOfLastTodo = currentPage * todosPerPage;
  const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
  const currentTodos = filteredTodos.slice(indexOfFirstTodo, indexOfLastTodo);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container">
      <div className="left-section">
        <h2>Todo List</h2>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
        <table>
          <thead>
            <tr>
              <th onClick={handleSort} className="sortable">ID {sortOrder === "asc" ? "▲" : "▼"}</th>
              <th>Title</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentTodos.map((todo) => (
              <tr key={todo.id}>
                <td>{todo.id}</td>
                <td>{todo.title}</td>
                <td>{todo.completed ? "Completed" : "Pending"}</td>
                <td>
                  <button onClick={() => handleViewUser(todo.userId, todo)} className="view-button">View User</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
            Previous
          </button>
          {Array.from({ length: Math.ceil(filteredTodos.length / todosPerPage) }, (_, i) => (
            <button key={i + 1} onClick={() => paginate(i + 1)} className={currentPage === i + 1 ? "active" : ""}>
              {i + 1}
            </button>
          ))}
          <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === Math.ceil(filteredTodos.length / todosPerPage)}>
            Next
          </button>
        </div>
      </div>

      <div className="right-section">
        <h2>User Detail</h2>
        {selectedUser ? (
          <table>
            <thead>
              <tr>
                <th>Todo ID</th>
                <th>Todo Title</th>
                <th>User ID</th>
                <th>User Name</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{selectedUser.todoId}</td>
                <td>{selectedUser.todoTitle}</td>
                <td>{selectedUser.userId}</td>
                <td>{selectedUser.name}</td>
                <td>{selectedUser.email}</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p>No user selected</p>
        )}
      </div>
    </div>
  );
};

export default App;
