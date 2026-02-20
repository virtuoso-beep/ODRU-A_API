import React, { useEffect, useState } from "react";
import "./App.css";

const courses = ["BSIT", "BSCS", "BSIS"];
const years = [1, 2, 3, 4];

function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [year, setYear] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editCourse, setEditCourse] = useState("");
  const [editYear, setEditYear] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const res = await fetch("http://localhost:3000/students");
    const data = await res.json();
    setStudents(data);
  };

  const handleAdd = async () => {
    if (!name || !course || !year) return;
    await fetch("http://localhost:3000/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, course, year }),
    });
    setName("");
    setCourse("");
    setYear("");
    fetchStudents();
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:3000/students/${id}`, { method: "DELETE" });
    fetchStudents();
  };

  const handleEdit = (student) => {
    setEditId(student.id);
    setEditName(student.name);
    setEditCourse(student.course);
    setEditYear(student.year);
  };

  const handleUpdate = async () => {
    await fetch(`http://localhost:3000/students/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: editName,
        course: editCourse,
        year: editYear,
      }),
    });
    setEditId(null);
    fetchStudents();
  };

  const handleLogout = () => {
    // Placeholder for logout logic
    alert("Logged out!");
  };

  return (
    <div
      className="App"
      style={{
        background: "#222",
        color: "#fff",
        minHeight: "100vh",
        padding: 40,
      }}
    >
      <button
        onClick={handleLogout}
        style={{
          marginBottom: 30,
          background: "#111",
          color: "#fff",
          border: "none",
          padding: "10px 20px",
          borderRadius: 8,
          fontWeight: "bold",
          fontSize: 18,
        }}
      >
        Logout
      </button>
      <h1 style={{ fontWeight: 700 }}>Student Management</h1>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 30 }}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            marginRight: 10,
            padding: 6,
            borderRadius: 4,
            border: "1px solid #888",
            minWidth: 120,
          }}
        />
        <select
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          style={{ marginRight: 10, padding: 6, borderRadius: 4 }}
        >
          <option value="">Select Course</option>
          {courses.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          style={{ marginRight: 10, padding: 6, borderRadius: 4 }}
        >
          <option value="">Select Year</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
        <button
          onClick={handleAdd}
          style={{
            background: "#111",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: 8,
            fontWeight: "bold",
            fontSize: 16,
          }}
        >
          Add Student
        </button>
      </div>
      <ul style={{ listStyle: "disc", paddingLeft: 30 }}>
        {students.map((student) => (
          <li key={student.id} style={{ marginBottom: 15 }}>
            {editId === student.id ? (
              <>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  style={{ marginRight: 8 }}
                />
                <select
                  value={editCourse}
                  onChange={(e) => setEditCourse(e.target.value)}
                  style={{ marginRight: 8 }}
                >
                  {courses.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <select
                  value={editYear}
                  onChange={(e) => setEditYear(e.target.value)}
                  style={{ marginRight: 8 }}
                >
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleUpdate}
                  style={{
                    background: "#111",
                    color: "#fff",
                    border: "none",
                    padding: "6px 14px",
                    borderRadius: 6,
                    fontWeight: "bold",
                    marginRight: 6,
                  }}
                >
                  Save
                </button>
                <button
                  onClick={() => setEditId(null)}
                  style={{
                    background: "#444",
                    color: "#fff",
                    border: "none",
                    padding: "6px 14px",
                    borderRadius: 6,
                    fontWeight: "bold",
                  }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                {student.name} – {student.course} (Year {student.year})
                <button
                  onClick={() => handleEdit(student)}
                  style={{
                    marginLeft: 16,
                    background: "#111",
                    color: "#fff",
                    border: "none",
                    padding: "6px 14px",
                    borderRadius: 6,
                    fontWeight: "bold",
                    marginRight: 6,
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(student.id)}
                  style={{
                    background: "#111",
                    color: "#fff",
                    border: "none",
                    padding: "6px 14px",
                    borderRadius: 6,
                    fontWeight: "bold",
                  }}
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
