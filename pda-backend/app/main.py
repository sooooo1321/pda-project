from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session

from .database import engine, get_db, Base
from .models import User, UserProfile, Product, Recommendation
from .schemas import (
    UserCreate, 
    UserLogin, 
    DPTIRequest, 
    RecommendationRequest,
    FinancialInfoRequest
)

from passlib.context import CryptContext

from fastapi.middleware.cors import CORSMiddleware

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

def calculate_purpose_fit(purpose: str, description: str) -> int:
    purpose_text = purpose.lower().strip()
    description_text = description.lower().strip()

    purpose_keywords = set(purpose_text.split())
    description_keywords = set(description_text.split())

    matched_keywords = purpose_keywords.intersection(description_keywords)
    match_count = len(matched_keywords)

    if purpose_text and purpose_text in description_text:
        return 100
    if match_count >= 2:
        return 100
    elif match_count == 1:
        return 80
    elif len(description_keywords) > 0 and any(word in description_text for word in purpose_keywords):
        return 60
    elif purpose_text or description_text:
        return 30
    else:
        return 0

def generate_reason_text(
    price_fit: float,
    purpose_fit: float,
    dpti_match: float,
    final_score: float,
    result: str
) -> str:
    reasons = []

    if price_fit >= 80:
        reasons.append("현재 자본 대비 가격 부담이 적습니다")
    elif price_fit >= 40:
        reasons.append("가격은 감당 가능하지만 신중한 판단이 필요합니다")
    else:
        reasons.append("현재 자본 대비 가격 부담이 큽니다")

    if purpose_fit >= 80:
        reasons.append("구매 목적과 상품 설명의 일치도가 높습니다")
    elif purpose_fit >= 60:
        reasons.append("구매 목적과 어느 정도 맞습니다")
    else:
        reasons.append("구매 목적과의 일치도가 낮습니다")

    if dpti_match >= 80:
        reasons.append("현재 필요도와 긴급도를 고려할 때 적절한 소비로 보입니다")
    elif dpti_match >= 60:
        reasons.append("필요성은 있으나 지금 구매가 최선인지 더 생각해볼 수 있습니다")
    else:
        reasons.append("현재 시점에서는 후회 가능성이 있어 보입니다")

    if result == "구매 추천":
        ending = "따라서 지금 구매를 추천합니다."
    elif result == "구매 보류":
        ending = "따라서 지금은 구매를 보류하는 것이 좋습니다."
    else:
        ending = "따라서 현재는 구매를 추천하지 않습니다."

    return ". ".join(reasons) + ". " + ending

def calculate_regret_risk(
    dpti_type: str,
    price_fit: float,
    purpose_fit: float,
    need_fit: float,
    timing_fit: float
) -> float:
    if dpti_type == "Impulse":
        regret_risk = (100 - price_fit) * 0.5 + (100 - need_fit) * 0.3 + (100 - timing_fit) * 0.2
    
    elif dpti_type == "Calculation":
        regret_risk = (100 - price_fit) * 0.5 + (100 - purpose_fit) * 0.3 + (100 - need_fit) * 0.2

    elif dpti_type == "Target":
        regret_risk = (100 - purpose_fit) * 0.5 + (100 - timing_fit) * 0.3 + (100 - price_fit) * 0.2
    
    else:
        regret_risk = (100 - purpose_fit) * 0.4 + (100 - need_fit) * 0.2 + (100 - price_fit) * 0.4

    regret_risk = max(0, min(100, regret_risk))
    return regret_risk

def hash_password(password: str) -> str:
    return pwd_context.hash(password)
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

@app.get("/")
def root():
    return {"message": "PDA 서버 실행 중"}

@app.post("/signup")
def signup(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()

    if existing_user:
        return {"message": "이미 존재하는 이메일입니다"}
    
    hashed_pw = hash_password(user.password)

    new_user = User(
        name=user.name,
        email=user.email,
        password=hashed_pw
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "회원가입 성공"}

@app.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()

    if db_user is None:
        return {"message": "이메일이 존재하지 않습니다"}
    
    if not verify_password(user.password, db_user.password):
        return {"message": "비밀번호가 일치하지 않습니다"}
    
    return {
        "message": "로그인 성공",
        "user_id": db_user.user_id,
        "name": db_user.name,
        "email": db_user.email
    }

@app.post("/dpti")
def calculate_dpti(user_id: int, data: DPTIRequest, db: Session = Depends(get_db)):
    impulse_score = sum(data.impulse)
    calculation_score = sum(data.calculation)
    target_score = sum(data.target)
    emotional_score = sum(data.emotional)

    scores = {
        "Impulse": impulse_score,
        "Calculation": calculation_score,
        "Target": target_score,
        "Emotional": emotional_score
    }

    dpti_type = max(scores, key=scores.get)

    existing_profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()

    if existing_profile:
        existing_profile.dpti_type = dpti_type
        db.commit()
        db.refresh(existing_profile)
    else:
        profile = UserProfile(
            user_id=user_id,
            dpti_type=dpti_type
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)

    return {
        "dpti_type": dpti_type,
        "scores": scores
    }

@app.post("/recommend")
def recommend(data: RecommendationRequest, db: Session = Depends(get_db)):
    profile = db.query(UserProfile).filter(UserProfile.user_id == data.user_id).first()

    if not profile:
        return {"message": "DPTI 정보가 없습니다"}
    
    if profile.capital is None or profile.capital <= 0:
        return {"message": "재정 정보가 없습니다. 먼저 재정 정보를 입력하세요."}
    
    dpti_type = profile.dpti_type
    capital = profile.capital

    if data.price <= capital * 0.3:
        price_fit = 100
    elif data.price <= capital * 0.5:
        price_fit = 80
    elif data.price <= capital * 0.7:
        price_fit = 60
    elif data.price <= capital:
        price_fit = 40
    else:
        price_fit = 0

    need_map = {5:100, 4:80, 3:60, 2:30, 1:10}
    need_fit = need_map.get(data.need_level, 0)

    timing_map = {5:100, 4:80, 3:60, 2:30, 1:10}
    timing_fit = timing_map.get(data.urgency, 0)

    purpose_fit = calculate_purpose_fit(data.purpose, data.description)

    regret_risk = calculate_regret_risk(
        dpti_type=dpti_type,
        price_fit=price_fit,
        purpose_fit=purpose_fit,
        need_fit=need_fit,
        timing_fit=timing_fit
    )

    dpti_match = (need_fit * 0.4) + (timing_fit * 0.3) + ((100 - regret_risk) * 0.3)

    if dpti_type == "Impulse":
        final_score = (price_fit * 0.4) + (purpose_fit * 0.35) + (dpti_match * 0.25)
    elif dpti_type == "Calculation":
        final_score = (price_fit * 0.4) + (purpose_fit * 0.35) + (dpti_match * 0.25)
    elif dpti_type == "Target":
        final_score = (price_fit * 0.25) + (purpose_fit * 0.45) + (dpti_match * 0.30)
    else: # Emotional
        final_score = (price_fit * 0.2) + (purpose_fit * 0.25) + (dpti_match * 0.55)

    if final_score >= 80:
        result = "구매 추천"
    elif final_score >= 50:
        result = "구매 보류"
    else:
        result = "비추천"


    reason_text = generate_reason_text(
        price_fit=price_fit,
        purpose_fit=purpose_fit,
        dpti_match=dpti_match,
        final_score=final_score,
        result=result
    )

    new_product = Product(
        user_id = data.user_id,
        product_name = data.product_name,
        price = data.price,
        purpose = data.purpose,
        description = data.description,
        need_level = data.need_level,
        urgency = data.urgency
    )
    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    new_recommendation = Recommendation(
        user_id = data.user_id,
        product_id = new_product.product_id,
        price_fit = price_fit,
        purpose_fit = purpose_fit,
        dpti_match = dpti_match,
        final_score = final_score,
        result = result,
        reason_text = reason_text
    )
    db.add(new_recommendation)
    db.commit()
    db.refresh(new_recommendation)

    return {
        "result": result,
        "final_score": final_score,
        "reason_text": reason_text,
        "detail": {
            "price_fit": price_fit,
            "purpose_fit": purpose_fit,
            "need_fit": need_fit,
            "timing_fit": timing_fit,
            "regret_risk": regret_risk,
            "dpti_match": dpti_match
        },
        "product_id": new_product.product_id,
        "recommendation_id": new_recommendation.recommendation_id
    }

@app.post("/financial-info")
def save_financial_info(data: FinancialInfoRequest, db: Session = Depends(get_db)):
    profile = db.query(UserProfile).filter(UserProfile.user_id == data.user_id).first()

    if not profile:
        return {"message": "DPTI 정보가 없습니다. 먼저 DPTI를 진행하세요."}
    
    profile.capital = data.capital
    profile.income = data.income
    profile.fixed_expense = data.fixed_expense

    db.commit()
    db.refresh(profile)

    return {
        "message": "재정 정보 저장 성공",
        "user_id": profile.user_id,
        "capital": profile.capital,
        "income": profile.income,
        "fixed_expense": profile.fixed_expense
    }