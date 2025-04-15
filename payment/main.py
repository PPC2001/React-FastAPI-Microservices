from typing import Union
from fastapi import FastAPI, HTTPException
from redis_om import get_redis_connection , HashModel
from fastapi.middleware.cors import CORSMiddleware
from starlette.requests import Request
import requests , time
from fastapi.background import BackgroundTasks
from models.order import Order
from core.redis import redis
import os
from dotenv import load_dotenv
import logging
from core.log_config import setup_logging  

setup_logging()
logger = logging.getLogger(__name__)

load_dotenv()

app = FastAPI()

# Allow CORS for frontend 
FRONTEND_URL = os.getenv("FRONTEND_URL")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],  # Adjust for production
    allow_methods=["*"],
    allow_headers=["*"],
)


# ------------------------------------------------------------------------------
# 🩺 Health Check
# ------------------------------------------------------------------------------

@app.get("/health")
def health():
    logger.info("Health check passed ✅")
    return {"status": "ok"}

# ------------------------------------------------------------------------------
# 🔎 Get Order by ID
# ------------------------------------------------------------------------------
@app.get("/orders/{pk}")
def get(pk: str):
    logger.info(f"Fetching order with ID: {pk}")
    try:
        return Order.get(pk)
    except Exception as e:
        logger.error(f"Error fetching order {pk}: {str(e)}")
        raise HTTPException(status_code=404, detail="Order not found")


# ------------------------------------------------------------------------------
# 📝 Create an Order
# ------------------------------------------------------------------------------
@app.post("/orders")
async def create(request : Request , background_tasks : BackgroundTasks):  #id , quantity
    logger.info(f"Received order request: {request}")
    body = await request.json()

    PRODUCT_SERVICE_URL = os.getenv("PRODUCT_SERVICE_URL")
    try:
        res = requests.get(f"{PRODUCT_SERVICE_URL}/products/{body['id']}")
        res.raise_for_status()
        product = res.json()
    except requests.exceptions.RequestException as e:
        logger.error(f"Error calling product service: {str(e)}")
        raise HTTPException(status_code=502, detail="Product service unavailable")


    # Create Order with calculated fee and total
    order = Order(
        product_id=body['id'],
        price=product['price'],
        fee=0.2 * product['price'],
        total=1.2 * product['price'],
        quantity=body['quantity'],
        status='pending'
    )
    order.save()
    logger.info(f"Order created with ID: {order.pk}")

    # Run background task to simulate order completion
    background_tasks.add_task(order_completed , order)
    return order



# ------------------------------------------------------------------------------
# ⏳ Background Task: Simulate Order Completion
# ------------------------------------------------------------------------------

def order_completed(order: Order):
    logger.info(f"Processing order completion in background for ID: {order.pk}")
    time.sleep(5)  # Simulate processing delay
    order.status = "completed"
    order.save()

    # Publish event to Redis stream
    redis.xadd('order_completed', order.model_dump(), '*')
    logger.info(f"Order marked as completed and event published: {order.pk}")









