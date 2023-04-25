### competitive_virtual
開発用レポジトリ

### How to start
terminal で　npm start 
src/firebase.jsでfirebaseのインストール、ユーザー登録が必要なので下を参考にnpm installなどする.  
https://firebase.google.com/docs/web/setup?hl=ja 

competitive_virtual直下にenv.localファイルを作りAPIkeyなどを登録する(firebaseの登録など終えてから）

REACT_APP_FIREBASE_API_KEY= "" 

REACT_APP_FIREBASE_AUTH_DOMAIN=""
REACT_APP_FIREBASE_PROJECT_ID="" 

REACT_APP_FIREBASE_STORAGE_BUCKET="" 

REACT_APP_FIREBASE_MESSAGE_SENDER_ID="" 

REACT_APP_FIREBASE_APP_ID="" 

REACT_APP_FIREBASE_COLLECTION_NAME="" 

,はいらないので注意

### srcの説明
index.js:起動時に呼ばれるファイル 

app.js: Routerなど登録してある 

components/ :各種Componentを置いてある 

backend・main.py レスポンド処理を実行（起動方法などもこちらに）FastAPIを使用


"# competitive_virtual" 
"# competitive_virtual" 
