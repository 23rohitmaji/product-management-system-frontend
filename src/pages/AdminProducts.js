import { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);

  useEffect(() => {
    loadProducts();
  }, [showDeleted]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const url = showDeleted ? "/products/deleted" : "/products";
      const res = await api.get(url);

      const productsArray = showDeleted
        ? res.data.data
        : res.data.data.data;

      setProducts(productsArray || []);
    } catch (err) {
      console.error(err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete product?")) return;
    try {
      await api.delete(`/products/${id}`);
      loadProducts();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const restoreProduct = async (id) => {
    try {
      await api.post(`/products/${id}/restore`);
      loadProducts();
    } catch (err) {
      alert("Restore failed");
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Products (Admin)</h3>
        <div>
          <Link className="btn btn-success me-2" to="/admin/products/new">
            New Product
          </Link>

          <div className="form-check form-switch d-inline">
            <input
              className="form-check-input"
              type="checkbox"
              checked={showDeleted}
              onChange={(e) => setShowDeleted(e.target.checked)}
            />
            <label className="form-check-label ms-2">
              {showDeleted ? "Showing Deleted" : "Show Deleted"}
            </label>
          </div>
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Categories</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>
                    ₹
                    {Number(p.price).toLocaleString("en-IN", {
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td>{p.stock}</td>
                  <td>{p.categories?.map((c) => c.name).join(", ")}</td>
                  <td>
                    {!showDeleted ? (
                      <>
                        <Link
                          to={`/admin/products/${p.id}/edit`}
                          state={{ product: p }}
                          className="me-2"
                        >
                          Edit
                        </Link>

                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => deleteProduct(p.id)}
                        >
                          Delete
                        </button>
                      </>
                    ) : (
                      <button
                        className="btn btn-sm btn-warning"
                        onClick={() => restoreProduct(p.id)}
                      >
                        Restore
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  {showDeleted
                    ? "No deleted products found"
                    : "No products found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
