from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.transaction import router as transaction_router

app = FastAPI(title="Trusta AI Backend", version="1.0.0")

# Allow frontend (Vercel) to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update to your Vercel URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 🔥 allow all (for now)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(transaction_router, prefix="/api")

@app.get("/")
def home():
    return {"message": "Trusta AI Backend Running"}