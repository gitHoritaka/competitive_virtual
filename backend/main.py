'''
Local Activate

. venv/bin/activate
uvicorn main:app --reload
'''
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from firebase import connect_to_db,collect_all_data,docs2data
from api import recommend_problems

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

@app.get('/delete')
async def delte_problem(user_id,problem_id):
    db.collection(user_id).document(problem_id).delete()
    print(user_id)
    return None

@app.get('/create_problems')
async def create_problems(user_name,flag):
    if flag == "sample":
        problem_lst = [{
            "name":"sample1","url":"url1" },
            {"name":"sample2","url":"url2"},
            ]
        return jsonify(problem_lst) 
    problem_lst = jsonify(recommend_problems(user_name,n_step=1))
    return problem_lst





    