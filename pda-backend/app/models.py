from sqlalchemy import Column, Integer, String, Float, Text
from .database import Base

class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True)
    password = Column(String)

class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)
    dpti_type = Column(String)
    capital = Column(Integer, default=0)
    income = Column(Integer, default=0)
    fixed_expense = Column(Integer, default=0)

class Product(Base):
    __tablename__ = "products"

    product_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)
    product_name = Column(String)
    price = Column(Integer)
    purpose = Column(String)
    description = Column(Text)
    need_level = Column(Integer)
    urgency = Column(Integer)

class Recommendation(Base):
    __tablename__ = "recommendations"
    
    recommendation_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)
    product_id = Column(Integer)
    price_fit = Column(Float)
    purpose_fit = Column(Float)
    dpti_match = Column(Float)
    final_score = Column(Float)
    result = Column(String)
    reason_text = Column(Text)