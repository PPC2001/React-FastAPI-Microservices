# 🧩 Microservices App with FastAPI, RedisJSON, Redis Streams & React

This project demonstrates how to build a simple microservices-based application using **Python FastAPI** for backend services and **React** for the frontend. The system is composed of two microservices:

- **Inventory Service**
- **Payment Service**

It uses:
- **RedisJSON** as the NoSQL database (similar to MongoDB)
- **Redis Streams** as the Event Bus (similar to RabbitMQ or Apache Kafka)

## 🚀 Tech Stack

### Backend
- **FastAPI** - High-performance web framework for Python
- **RedisJSON** - JSON-based NoSQL database
- **Redis Streams** - Event-driven architecture support
- **Render** - Cloud platform for hosting microservices

### Frontend
- **React** - Modern JavaScript frontend library
- **Firebase Hosting** - Production-grade web hosting

---

## 📦 Microservices Overview

### 🧾 Inventory Service
- Manages product stock and availability.
- Stores product data in RedisJSON.
- Publishes stock update events to Redis Streams.

### 💳 Payment Service
- Handles payment processing logic.
- Listens to Redis Streams for inventory events.
- Updates payment status and business logic accordingly.

---

## 🧰 Features

- Microservices architecture
- Event-driven communication with Redis Streams
- NoSQL database with RedisJSON
- FastAPI for asynchronous, high-performance APIs
- React frontend to interact with backend services

---


## 🚀 Deployment Guide

### 🔥 Frontend Deployment (Firebase Hosting)
![image](https://github.com/user-attachments/assets/b1bbf8f1-0b76-41ff-9337-cc0f21a963c9)

### 🔥 Backend Deployment (Render)

![image](https://github.com/user-attachments/assets/8ffa81fc-c2b7-4c9a-8660-1486aa3582f7)


