'''
Local Activate

. venv/bin/activate
uvicorn main:app --reload
'''
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from firebase import connect_to_db,collect_all_data,docs2data

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
def jsonify(json_list):
    res = {}
    for idx,data in enumerate(json_list):
        res[idx] = data
    return res


db = connect_to_db()
@app.get('/')
async def user_data(id):
    docs = collect_all_data(db,id)
    res = jsonify(docs2data(docs))
    return res


    