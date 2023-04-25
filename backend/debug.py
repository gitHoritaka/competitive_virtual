from api import recommend_problems
users = ["horitaka","maxyzfj","milkcoffee","BCO"]
problem_lst = [recommend_problems(user) for user in users]
for index,user in enumerate(users):
    print("user: {}".format(user))
    print(*problem_lst[index][:10])
