import { useEffect, useState } from "react";
import api, { getUser } from "../api";

function Shop() {
  const user = getUser();
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const fetchProducts = async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.get(`/products?page=${page}`);
      if (res.data?.data?.data && Array.isArray(res.data.data.data)) {
        setProducts(res.data.data.data);
        setCurrentPage(res.data.data.current_page);
        setLastPage(res.data.data.last_page);
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

  const fetchCart = async () => {
    if (!user) return;
    try {
      const res = await api.get("/cart");
      setCartItems(res.data.data || []);
    } catch (err) {
      console.error("Error fetching cart:", err);
      setCartItems([]);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
    fetchCart();
  }, [currentPage]);

  const isInCart = (productId) => {
    return cartItems.some((item) => item.product_id === productId);
  };

  const addToCart = async (product) => {
    if (!user) {
      alert("Please login to add items to cart.");
      return;
    }

    setAdding(product.id);
    try {
      const response = await api.post("/cart", {
        product_id: product.id,
        quantity: 1,
      });

      if (response.data.status === "success") {
        alert(response.data.message);
        setCartItems((prev) => [...prev, { product_id: product.id, quantity: 1 }]);
      } else {
        alert(response.data.message || "Failed to add to cart");
      }
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
                  <p className="card-text">
                    Price: ₹
                    {Number(product.price).toLocaleString("en-IN", {
                      maximumFractionDigits: 0,
                    })}
                  </p>
                  {product.categories && product.categories.length > 0 && (
                    <p className="card-text">
                      Categories: {product.categories.map((c) => c.name).join(", ")}
                    </p>
                  )}
                  <button
                    className="btn btn-primary"
                    onClick={() => addToCart(product)}
                    disabled={adding === product.id || isInCart(product.id)}
                  >
                    {adding === product.id
                      ? "Adding..."
                      : isInCart(product.id)
                      ? "Added to Cart"
                      : "Add to Cart"}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No products available.</p>
        )}
      </div>

      <div className="d-flex justify-content-center mt-3">
        <button
          className="btn btn-secondary me-2"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          Previous
        </button>
        <span className="align-self-center">
          Page {currentPage} of {lastPage}
        </span>
        <button
          className="btn btn-secondary ms-2"
          disabled={currentPage === lastPage}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Shop;
