import { useEffect, useState } from "react";
import api, { getUser } from "../api";

function Shop() {
  const user = getUser();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");

        if (res.data?.data?.data && Array.isArray(res.data.data.data)) {
          setProducts(res.data.data.data);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = async (product) => {
    if (!user) {
      alert("Please login to add items to cart.");
      return;
    }

    setAdding(product.id);
    try {
      await api.post("/cart", {
        product_id: product.id,
        quantity: 1,
      });
      alert(`${product.name} added to cart!`);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to add to cart");
    } finally {
      setAdding(null);
    }
  };

  if (loading) return <p>Loading products...</p>;

  return (
    <div className="container mt-4">
      <h2>Shop</h2>
      <div className="row">
        {products.length > 0 ? (
          products.map((product) => (
            <div className="col-md-4 mb-3" key={product.id}>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">Price: ₹{product.price}</p>
                  <p className="card-text">Stock: {product.stock}</p>
                  {product.categories && product.categories.length > 0 && (
                    <p className="card-text">
                      Categories:{" "}
                      {product.categories.map((c) => c.name).join(", ")}
                    </p>
                  )}
                  <button
                    className="btn btn-primary"
                    onClick={() => addToCart(product)}
                    disabled={adding === product.id}
                  >
                    {adding === product.id ? "Adding..." : "Add to Cart"}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No products available.</p>
        )}
      </div>
    </div>
  );
}

export default Shop;
