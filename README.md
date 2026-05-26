# PDA 프로젝트 실행 가이드

---

# 📌 프로젝트 개요
본 프로젝트는 사용자의 소비 성향(DPTI)과 재정 상태를 기반으로  
상품 구매를 추천하는 시스템입니다.

---

# 🛠 개발 환경

## Mac
- Terminal (zsh)
- Python 3.x
- Node.js
- VSCode

## Windows
- PowerShell 또는 CMD
- Python 3.x
- Node.js
- VSCode

---

# 🚀 1. Backend 실행 방법

---

## Mac 기준

### 1) 프로젝트 폴더 이동
```bash
cd PDA/pda-backend

### 2) 가상환경 활성화
source venv/bin/activate

### 3) 서버 실행
uvicorn app.main:app --reload

# Windows 기준

## 1) 프로젝트 폴더 이동
cd PDA/pda-backend

## 2) 가상환경 활성화
venv\Scripts\activate

## 3) 서버 실행
uvicorn app.main:app --reload

---

# 🧑‍💻 2. Frontend (React / Next.js) 실행 방법

---

# Mac / Windows 공통

## 1) 프론트 폴더 이동
cd PDA/pda-frontend

## 2) 패키지 설치 (최초 1회)
npm install

## 3) 개발 서버 실행
npm run dev

## 4) 브라우저 접속
http://localhost:3000

---

# ⛔ 서버 종료 방법 (공통)
Ctrl + C

---

🔗 API 테스트

브라우저 접속:

http://127.0.0.1:8000/docs

사용 가능한 API:

/signup
/login
/dpti
/financial-info
/recommend

(2026-04-11 기준)

---

# 🗄 DB 관리

## DB 위치
app/pda.db

---

## DB 확인 방법
sqlite3 app/pda.db
.tables
SELECT * FROM users;
SELECT * FROM user_profiles;
SELECT * FROM products;
SELECT * FROM recommendations;

종료:

.exit

---

# 🔄 DB 초기화 방법

## 1) 서버 종료
Ctrl + C

## 2) DB 삭제

### Mac
rm app/pda.db

### Windows
del app\pda.db

## 3) 서버 재실행
uvicorn app.main:app --reload

---

# 🧪 초기 테스트 순서

## 1) 회원가입 (/signup)
{
  "name": "test",
  "email": "test@test.com",
  "password": "12345"
}

---

## 2) 로그인 (/login)
{
  "email": "test@test.com",
  "password": "12345"
}

👉 user_id 확인 (예: 1)

---

## 3) DPTI 설문 (/dpti)

Query:

user_id=1

Body:

{
  "impulse": [5,4,3,4,5],
  "calculation": [2,2,3,2,2],
  "target": [3,3,3,3,3],
  "emotional": [1,2,1,2,1]
}

---

## 4) 재정 정보 입력 (/financial-info)
{
  "user_id": 1,
  "capital": 1000000,
  "income": 3000000,
  "fixed_expense": 1000000
}

---

## 5) 상품 추천 (/recommend)
{
  "user_id": 1,
  "product_name": "맥북 에어 M3",
  "price": 200000,
  "purpose": "노트북 공부",
  "description": "코딩용 노트북",
  "need_level": 5,
  "urgency": 4
}

---

# 💡 참고 사항
Backend: FastAPI 기반 REST API
Frontend: Next.js (React 기반)
DB: SQLite 사용 (로컬 환경)

---

# 🧠 TIP

실행 순서:

Backend 실행
Frontend 실행
웹 접속 (localhost:3000)
전체 흐름 테스트

---

# 🎯 프로젝트 흐름

회원가입 → 로그인 → DPTI 설문 → 결과 → 재정 입력 → 상품 입력 → 추천 결과