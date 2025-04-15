import { useEffect, useState } from "react";

export const Orders = () => {
    const [id, setId] = useState('');
    const [quantity, setQuantity] = useState('');
    const [message, setMessage] = useState('Buy your favorite product');
    const [loading, setLoading] = useState(false);

    const PRODUCT_SERVICE_URL = process.env.REACT_APP_PRODUCT_SERVICE_URL;
    const ORDER_SERVICE_URL = process.env.REACT_APP_ORDER_SERVICE_URL;


    useEffect(() => {
        (async () => {
            try {
                if (id) {
                    const response = await fetch(`${PRODUCT_SERVICE_URL}/products/${id}`);
                    const content = await response.json();
                    const price = parseFloat(content.price) * 1.2;
                    setMessage(`Your product price is $${price}`);
                }
            } catch (e) {
                setMessage('Buy your favorite product');
            }
        })();
    }, [id]);

    const submit = async e => {
        e.preventDefault();
        setLoading(true);
        setMessage("Placing your order...");

        try {
            await fetch(`${ORDER_SERVICE_URL}/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, quantity })
            });

            setMessage('✅ Thank you for your order!');
        } catch (err) {
            console.error(err);
            setMessage('❌ Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <main>
                <div className="py-5 text-center">
                    <h2>Checkout Form</h2>
                    <p className="lead">{message}</p>
                    {loading && <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>}
                </div>

                <form onSubmit={submit}>
                    <div className="row g-3">
                        <div className="col-sm-6">
                            <label className="form-label">Product</label>
                            <input
                                className="form-control"
                                value={id}
                                onChange={e => setId(e.target.value)}
                                required
                            />
                        </div>

                        <div className="col-sm-6">
                            <label className="form-label">Quantity</label>
                            <input
                                type="number"
                                className="form-control"
                                value={quantity}
                                onChange={e => setQuantity(e.target.value)}
                                min="1"
                                required
                            />
                        </div>
                    </div>

                    <hr className="my-4" />
                    <button
                        className="w-100 btn btn-primary btn-lg"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : 'Buy'}
                    </button>
                </form>
            </main>
        </div>
    );
};
