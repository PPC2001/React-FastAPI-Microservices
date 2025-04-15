import { Wrapper } from "./Wrapper";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const PRODUCT_SERVICE_URL = process.env.REACT_APP_PRODUCT_SERVICE_URL;

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${PRODUCT_SERVICE_URL}/products`);
                if (!response.ok) throw new Error("Failed to fetch products");
                const content = await response.json();
                setProducts(content);
            } catch (e) {
                setError("Error fetching products.");
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const del = async id => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const response = await fetch(`${PRODUCT_SERVICE_URL}/products/${id}`, {
                    method: 'DELETE'
                });
                if (!response.ok) throw new Error("Delete failed");
                setProducts(products.filter(p => p.id !== id));
            } catch (e) {
                alert("Error deleting product.");
                console.error(e);
            }
        }
    };

    return (
        <Wrapper>
            <div className="pt-3 pb-2 mb-3 border-bottom d-flex justify-content-between">
                <h4>Products</h4>
                <Link to={`/create`} className="btn btn-sm btn-outline-primary">Add</Link>
            </div>

            {loading ? (
                <p>Loading products...</p>
            ) : error ? (
                <p className="text-danger">{error}</p>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped table-sm">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product.id}>
                                    <td>{product.id}</td>
                                    <td>{product.name}</td>
                                    <td>{product.price}</td>
                                    <td>{product.quantity}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => del(product.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </Wrapper>
    );
};
