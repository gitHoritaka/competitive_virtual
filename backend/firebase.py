from firebase_admin import firestore
import firebase_admin
from firebase_admin import credentials

def connect_to_db():
    JSON_PATH = './config.json'

    # Firebase初期化
    cred = None
    try:
        cred = credentials.Certificate(JSON_PATH)
    except FileNotFoundError as e:
        print(e,"json config file not found")
    if cred == None:
        return None
    firebase_admin.initialize_app(cred)
    db = firestore.client()
    return db

def collect_all_data(db,collection_name):
    doc_ref = db.collection(collection_name)
    docs = doc_ref.stream()
    return docs

def docs2data(docs):
    res = []
    for doc in docs:
        dic = {
            'title':doc.get('title'),
            'dificulty':doc.get('dificulty'),
            'url':doc.get('url'),
            'description':doc.get('description'),
            'id':doc.id,
            "author":doc.get("author"),
        }
        res.append(dic)
    return res
    
