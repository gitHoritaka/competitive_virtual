import pandas as pd
import numpy as np
import pandas as pd
from os.path import join
from collections import defaultdict
data_path = "competitive_virtual/backend/data/submissions.csv"
data = pd.read_csv(data_path)
col2index = {}
for index,key in enumerate(data.columns):
    col2index[key] = index
problems = set()
users = set()
user_point = defaultdict(int)
v = data.values
print(col2index)
update_data = []
for i in range(len(data)):
    tmp = v[i]
    problem_id = str(tmp[col2index["problem_id"]])
    user = str(tmp[col2index["user_id"]])
    result = tmp[col2index["result"]]
    if result == "AC" and problem_id[:3]=="abc":
        problems.add(problem_id)
        users.add(user)
        update_data.append((user,problem_id))
        user_point[user] += tmp[col2index["point"]]
problems = list(problems)
users = list(users)
user_data = []
p2index = {}
for index,key in enumerate(problems):
    p2index[key] = index
u2index = {}
for index,key in enumerate(users):
    u2index[key] = index
    user_data.append((key,user_point[key]))
board = np.zeros((len(users),len(problems)))
for user,problem_id in update_data:
    board[u2index[user]][p2index[problem_id]] = 1
save_path = "competitive_virtual/backend/data"
pd.DataFrame(user_data).to_csv(join(save_path,"user_data.csv"),mode= "w")
pd.DataFrame(problems).to_csv(join(save_path,"problem_data.csv"),mode='w')
np.save(join(save_path,"board") ,board)
    