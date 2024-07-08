import firebase_admin
from firebase_admin import credentials, auth 

cred = credentials.Certificate('YOUR_SECRET_CRED')
firebase_admin.initialize_app(cred)