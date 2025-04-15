import { Wrapper } from "./Wrapper";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';

export const ProductsCreate = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const PRODUCT_SERVICE_URL = process.env.REACT_APP_PRODUCT_SERVICE_URL;

    const submit = async e => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`${PRODUCT_SERVICE_URL}/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, price, quantity })
            });

            if (!response.ok) throw new Error('Failed to create product');

            navigate(-1);
        } catch (e) {
            alert("Error creating product. Please try again.");
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Wrapper>
            <form className="mt-3" onSubmit={submit}>
                <div className="form-floating pb-3">
                    <input
                        className="form-control"
                        placeholder="Name"
                        onChange={e => setName(e.target.value)}
                        required
                    />
                    <label>Name</label>
                </div>

                <div className="form-floating pb-3">
                    <input
                        type="number"
                        className="form-control"
                        placeholder="Price"
                        onChange={e => setPrice(e.target.value)}
                        required
                        min="0"
                        step="0.01"
                    />
                    <label>Price</label>
                </div>

                <div className="form-floating pb-3">
                    <input
                        type="number"
                        className="form-control"
                        placeholder="Quantity"
                        onChange={e => setQuantity(e.target.value)}
                        required
                        min="1"
                        step="1"
                    />
                    <label>Quantity</label>
                </div>

                <button
                    className="w-100 btn btn-lg btn-primary"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? 'Submitting...' : 'Submit'}
                </button>
            </form>
        </Wrapper>
    );
};
