import numpy as np
import pandas as pd
import random
from tqdm import tqdm
import os

def make_matrix(user_name):
    user_index = -1
    for index in range(len(sorted_user_data)):
        if sorted_user_data[index][0] == user_name:
            user_index = index
    if user_index == -1:
        return None,user_index
    randint = random.sample([i for i in range(max(user_index-500,0),min(user_index+500,len(user_data)))],k=100)
    randint.append(user_index)
    matrix = sorted_board[randint]
    return matrix,user_index

def get_rating_error(r, p, q):
    return r - np.dot(p, q)


def get_error(R, P, Q, beta):
    error = 0.0
    for i in range(len(R)):
        for j in range(len(R[i])):
            if R[i][j] == 0:
                continue
            error += pow(get_rating_error(R[i][j], P[:,i], Q[:,j]), 2)
    error += beta/2.0 * (np.linalg.norm(P) + np.linalg.norm(Q))
    return error


def matrix_factorization(R, K, steps=5000, alpha=0.0002, beta=0.02, threshold=0.001):
    P = np.random.rand(K, len(R))
    Q = np.random.rand(K, len(R[0]))
    for step in tqdm(range(steps)):
        for i in range(len(R)):
            for j in range(len(R[i])):
                if R[i][j] == 0:
                    continue
                err = get_rating_error(R[i][j], P[:, i], Q[:, j])
                for k in range(K):
                    P[k][i] += alpha * (2 * err * Q[k][j])
                    Q[k][j] += alpha * (2 * err * P[k][i])
        error = get_error(R, P, Q, beta)
        if error < threshold:
            break
    return P, Q

def recommend_problems(user_name,n_step = 10):
    board = np.load("competitive_virtual/backend/data/board.npy")
    user_data = pd.read_csv("competitive_virtual/backend/data/user_data.csv").values
    problem_data = pd.read_csv("competitive_virtual/backend/data/problem_data.csv").values[:,1:]
    points = list(map(int,list(user_data[:,2])))
    sorted_index = np.argsort(points)
    sorted_user_data = user_data[sorted_index][:,1:]
    sorted_board = board[sorted_index]
    matrix,user_index = make_matrix("horitaka")
    if user_index == -1:
        return []
    P,Q = matrix_factorization(matrix,K=32,steps= n_step)
    calc_matrix = np.dot(P.T,Q)
    save_path = "competitive_virtual/backend/data"
    np.save(os.path.join(save_path,user_name),calc_matrix)
    problem_sorted_index = np.argsort(-calc_matrix[-1])#userの予測値を降順に並べた時のindexを返す
    recommended_problems = problem_data[problem_sorted_index]
    return recommended_problems
