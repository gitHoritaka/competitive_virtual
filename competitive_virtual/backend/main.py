'''
Rocal Activate

. venv/bin/activate
uvicorn main:app --reload
'''
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:3000",
]

'''セキュリティ設定'''
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/')
def Sample():
    return {"Sample":"HelloWorld!"}
    