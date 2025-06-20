from fastapi import FastAPI
from routers import chat_router2

app = FastAPI()
app.include_router(chat_router2)