import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../api";

export default function AdminProductForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();
  const location = useLocation();

  const productFromState = location.state?.product || null;

  const [name, setName] = useState(productFromState?.name || "");
  const [price, setPrice] = useState(productFromState?.price || 0);
  const [stock, setStock] = useState(productFromState?.stock || 0);
  const [categories, setCategories] = useState([]);
  const [selectedCats, setSelectedCats] = useState(
    productFromState?.categories?.map((c) => c.id) || []
  );

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data.data || res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleCat = (catId) => {
    setSelectedCats((prev) =>
      prev.includes(catId) ? prev.filter((c) => c !== catId) : [...prev, catId]
    );
  };

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (price <= 0) newErrors.price = "Price must be greater than 0";
    if (stock < 0) newErrors.stock = "Stock must be >= 0";
    if (selectedCats.length === 0)
      newErrors.categories = "Select at least one category";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!validate()) return;

    const payload = { name, price, stock, categories: selectedCats };

    try {
      if (editing) {
        await api.put(`/products/${id}`, payload);
      } else {
        await api.post("/products", payload);
      }
      navigate("/admin/products");
    } catch (err) {
      setSubmitError(err?.response?.data?.message || "Save failed");
    }
  };

  return (
    <div>
      <h3>{editing ? "Edit" : "New"} Product</h3>

      {submitError && <div className="alert alert-danger">{submitError}</div>}

      <form onSubmit={submit}>
        <div className="mb-3">
          <label>Name</label>
          <input
            className={`form-control ${errors.name ? "is-invalid" : ""}`}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <div className="invalid-feedback">{errors.name}</div>}
        </div>

        <div className="mb-3">
          <label>Price</label>
          <input
            type="number"
            className={`form-control ${errors.price ? "is-invalid" : ""}`}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            min="0"
          />
          {errors.price && (
            <div className="invalid-feedback">{errors.price}</div>
          )}
        </div>

        <div className="mb-3">
          <label>Stock</label>
          <input
            type="number"
            className={`form-control ${errors.stock ? "is-invalid" : ""}`}
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
            min="0"
          />
          {errors.stock && (
            <div className="invalid-feedback">{errors.stock}</div>
          )}
        </div>

        <div className="mb-3">
          <label>Categories</label>
          <div>
            {categories.length > 0 ? (
              categories.map((c) => (
                <div className="form-check form-check-inline" key={c.id}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`cat-${c.id}`}
                    checked={selectedCats.includes(c.id)}
                    onChange={() => toggleCat(c.id)}
                  />
                  <label className="form-check-label" htmlFor={`cat-${c.id}`}>
                    {c.name}
                  </label>
                </div>
              ))
            ) : (
              <div className="text-muted">
                Please add category first.{" "}
                <a href="/admin/categories" className="text-primary">
                  Go to Categories
                </a>
              </div>
            )}
          </div>

          {errors.categories && (
            <div className="text-danger mt-1">{errors.categories}</div>
          )}
        </div>

        <button className="btn btn-primary" type="submit">
          Save
        </button>
        <button
          className="btn btn-secondary ms-2"
          type="button"
          onClick={() => navigate("/admin/products")}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
