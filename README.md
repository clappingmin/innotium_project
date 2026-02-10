# 실행 순서

## 1. Backend 실행
- python 3.14 이상으로 맞추기

### backend 폴더로 이동
cd backend

### 가상환경 생성 (처음만)
python -m venv venv

### 가상환경 활성화 (Windows)
venv\Scripts\activate

### 패키지 설치
pip install -r requirements.txt

### 실행
python app.py

**서버**: http://localhost:5000


## 2. Frontend 실행
### frontend 폴더로 이동
cd frontend

### 패키지 설치
npm install

### 실행
npm run dev