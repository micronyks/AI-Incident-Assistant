from app.database.base import Base
from app.database.base import engine

# Import all models
import app.models

Base.metadata.create_all(bind=engine)

print("Tables created successfully.")