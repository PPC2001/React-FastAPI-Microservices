from typing import Union
from fastapi import FastAPI, HTTPException
from redis_om import get_redis_connection 
from fastapi.middleware.cors import CORSMiddleware
from models.product import Product
import os
import logging
from core.log_config import setup_logging  

# ------------------------------------------------------------------------------
# ⚙️ Setup Logging
# ------------------------------------------------------------------------------
setup_logging()
logger = logging.getLogger(__name__)

# ------------------------------------------------------------------------------
# 🚀 FastAPI App Setup
# ------------------------------------------------------------------------------
app = FastAPI()

# Allow CORS for frontend (read from .env)
FRONTEND_URL = os.getenv("FRONTEND_URL")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],  # Adjust for production
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------------------------------------------------------------
# 🟢 Health Check Endpoint
# ------------------------------------------------------------------------------
@app.get("/health")
def health_check():
    logger.info("Health check called.")
    return {"status": "ok"}

# ------------------------------------------------------------------------------
# 📦 Get All Products
# ------------------------------------------------------------------------------
@app.get("/products")
def all():
    try:
        return [format_product(pk) for pk in Product.all_pks()]
    except Exception as e:
        logger.error(f"Error fetching products: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch products")


# ------------------------------------------------------------------------------
# 📄 Format Product Data for Response
# ------------------------------------------------------------------------------
def format_product(pk: str):
    try:
        product = Product.get(pk)
        return {
            "id": product.pk,
            "name": product.name,
            "price": product.price,
            "quantity": product.quantity,
        }
    except Exception as e:
        logger.error(f"Error formatting product {pk}: {e}")
        raise HTTPException(status_code=404, detail=f"Product with ID {pk} not found")


# ------------------------------------------------------------------------------
# ➕ Create New Product
# ------------------------------------------------------------------------------
@app.post("/products")
def create(product: Product):
    try:
        product.save()
        logger.info(f"Product created: {product.name} | Price: {product.price}")
        return product
    except Exception as e:
        logger.error(f"Error creating product: {e}")
        raise HTTPException(status_code=500, detail="Failed to create product")


# ------------------------------------------------------------------------------
# 🔍 Get Product by ID
# ------------------------------------------------------------------------------
@app.get("/products/{pk}")
def get(pk: str):
    try:
        product = Product.get(pk)
        logger.info(f"Fetched product: {product.name} (ID: {pk})")
        return product
    except Exception as e:
        logger.error(f"Product not found: {pk} | Error: {e}")
        raise HTTPException(status_code=404, detail="Product not found")


# ------------------------------------------------------------------------------
# ❌ Delete Product by ID
# ------------------------------------------------------------------------------
@app.delete("/products/{pk}")
def delete(pk: str):
    try:
        product = Product.get(pk)
        if not product:
            logger.warning(f"Tried to delete non-existent product (ID: {pk})")
            raise HTTPException(status_code=404, detail="Product not found")

        Product.delete(pk)
        logger.info(f"Product deleted (ID: {pk})")
        return {"message": "Product deleted successfully"}
    
    except Exception as e:
        logger.error(f"Product not found during deletion (ID: {pk})")
        raise HTTPException(status_code=404, detail="Product not found")

