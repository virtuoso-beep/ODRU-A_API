const Express = require("express");
const Cors = require("cors");

const App = Express();

// Middleware
App.use(Cors());
App.use(Express.json());

// Test route
App.get("/", (req, res) => {
  res.send("API is running");
});

/* App.get("/students", (req, res) => {
res.json([
{ id: 1, name: "Juan Dela Cruz", course: "BSIT", year: 2 },
{ id: 2, name: "Maria Clara", course: "BSCS", year: 1 }
]);
});
*/

// Start server
App.listen(3000, () => {
  console.log("Server running on port 3000");
});

const Mysql = require("mysql2");

const Db = Mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Admin123!",
  database: "school_db",
});

Db.connect((Err) => {
  if (Err) {
    console.error("MySQL connection failed:", Err);
  } else {
    console.log("Connected to MySQL database");
  }
});

module.exports = Db;

// Get all students who are not soft deleted
App.get("/students", (req, res) => {
  Db.query("SELECT * FROM students WHERE is_deleted = 0", (Err, Results) => {
    if (Err) {
      res.status(500).json(Err);
    } else {
      res.json(Results);
    }
  });
});

App.post("/students", (req, res) => {
  const { name, course, year } = req.body;

  Db.query(
    "INSERT INTO students (name, course, year, is_deleted) VALUES (?, ?, ?, 0)",
    [name, course, year],
    (Err, Result) => {
      if (Err) {
        res.status(500).json(Err);
      } else {
        res.json({ id: Result.insertId });
      }
    }
  );
});

App.put("/students/:id", (req, res) => {
  const { id } = req.params;
  const { name, course, year } = req.body;

  Db.query(
    "UPDATE students SET name=?, course=?, year=? WHERE id=?",
    [name, course, year, id],
    (Err) => {
      if (Err) {
        res.status(500).json(Err);
      } else {
        res.json({
          id,
          name,
          course,
          year,
        });
      }
    }
  );
});

// Soft delete student (set is_deleted = 1) with logging for debugging
App.delete("/students/:id", (req, res) => {
  const { id } = req.params;
  console.log("Attempting to soft delete student with id:", id);
  Db.query(
    "UPDATE students SET is_deleted = 1 WHERE id = ?",
    [id],
    (Err, result) => {
      if (Err) {
        console.error("Error updating is_deleted:", Err);
        res.status(500).json(Err);
      } else {
        console.log("Soft delete result:", result);
        res.json({ deleted: true });
      }
    }
  );
});
