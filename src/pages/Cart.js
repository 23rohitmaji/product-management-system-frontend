import { useEffect, useState } from "react";
import api from "../api";

export default function Cart() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [backendTotal, setBackendTotal] = useState(0);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    setLoading(true);
    try {
      const res = await api.get("/cart");
      const serverItems = res.data.data || [];
      setItems(Array.isArray(serverItems) ? serverItems : []);
      setBackendTotal(res.data.total ?? 0);
    } catch (err) {
      console.error("Error loading cart:", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (product_id, qty) => {
    if (qty < 1) return;
    try {
      await api.put(`/cart/${product_id}`, { quantity: qty });
      await loadCart();
    } catch (err) {
      alert(err?.response?.data?.message || "Update failed");
    }
  };

  const removeItem = async (product_id) => {
    try {
      await api.delete(`/cart/${product_id}`);
      loadCart();
    } catch (err) {
      alert("Remove failed");
    }
  };

  const subtotal = (it) => {
    const price = it.product?.price ?? it.price ?? 0;
    return price * it.quantity;
  };

  return (
    <div>
      <h3>Cart</h3>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {items.length === 0 && (
            <div className="alert alert-light">Cart is empty</div>
          )}

          <div className="list-group">
            {items.map((it) => (
              <div
                className="list-group-item d-flex justify-content-between align-items-center"
                key={it.product_id}
              >
                <div>
                  <strong>
                    {it.product?.name ?? `Product ${it.product_id}`}
                  </strong>
                  <div>Price: ₹{it.product?.price ?? it.price ?? "-"}</div>
                </div>
                <div className="d-flex align-items-center">
                  <input
                    type="number"
                    className="form-control me-2"
                    style={{ width: 90 }}
                    value={it.quantity}
                    onChange={(e) =>
                      updateQuantity(it.product_id, Number(e.target.value))
                    }
                    min={1}
                  />
                  <div className="me-3">
                    Subtotal: ₹{subtotal(it).toLocaleString("en-IN", {maximumFractionDigits: 2,})}
                  </div>
                  
                  <button
                    className="btn btn-danger"
                    onClick={() => removeItem(it.product_id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 d-flex justify-content-end">
              <h5> Total: ₹{backendTotal.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</h5>
          </div>
        </>
      )}
    </div>
  );
}
