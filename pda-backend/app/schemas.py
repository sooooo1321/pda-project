from pydantic import BaseModel, Field
from pydantic import EmailStr

class UserCreate(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class DPTIRequest(BaseModel):
    impulse: list[int]
    calculation: list[int]
    target: list[int]
    emotional: list[int]

class RecommendationRequest(BaseModel):
    user_id: int
    product_name: str

    price: int = Field(..., ge=0)

    purpose: str
    description: str

    need_level: int = Field(..., ge=1, le=5)
    urgency: int = Field(..., ge=1, le=5)

class FinancialInfoRequest(BaseModel):
    user_id: int

    capital: int = Field(..., ge=0)
    income: int = Field(..., ge=0)
    fixed_expense: int = Field(..., ge=0)