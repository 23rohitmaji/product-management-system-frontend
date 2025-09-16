
import { useEffect, useState } from "react";
import api from "../api";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editCategory, setEditCategory] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get("/categories");
      setCategories(res.data.data || res.data);
    } catch (err) {
      console.error("Error loading categories", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post("/categories", { name: newCategory });
      setNewCategory("");
      loadCategories();
    } catch (err) {
      alert("Failed to add category");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/categories/${editCategory.id}`, { name: editCategory.name });
      setEditCategory(null);
      loadCategories();
    } catch (err) {
      alert("Failed to update category");
    }
  };

  return (
    <div className="container mt-4">
      <h3>Manage Categories</h3>

      {/* Add Category */}
      <form className="d-flex mb-3" onSubmit={handleAdd}>
        <input
          type="text"
          className="form-control me-2"
          placeholder="New Category Name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-success">Add</button>
      </form>

      {/* Edit Category */}
      {editCategory && (
        <form className="d-flex mb-3" onSubmit={handleUpdate}>
          <input
            type="text"
            className="form-control me-2"
            value={editCategory.name}
            onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value })}
            required
          />
          <button type="submit" className="btn btn-primary me-2">Update</button>
          <button type="button" className="btn btn-secondary" onClick={() => setEditCategory(null)}>Cancel</button>
        </form>
      )}

      {/* Category Table */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr><th>ID</th><th>Name</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td>{cat.id}</td>
                <td>{cat.name}</td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => setEditCategory(cat)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
