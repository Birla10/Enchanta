import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv('MONGODB_URI', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(MONGO_URL)
db = client.get_default_database(os.getenv('MONGODB_NAME', 'testdb'))
users_collection = db.get_collection('users')
comics_collection = db.get_collection('comics')
