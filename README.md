# AgriDoc Dashboard - Smart Agriculture & AI Disease Scanner

AgriDoc Dashboard is a full-stack, AI-powered precision agriculture application designed for farmers and autonomous field robots.

## Features
- **Multilingual Support (6 Languages)**: English, Telugu (తెలుగు), Hindi (हिंदी), Tamil (தமிழ்), Kannada (ಕನ್ನಡ), and Marathi (మరాఠీ).
- **AgriRobot Telemetry & Field Map**: Live GPS tracking, battery meter, speed monitoring, and remote operating mode controls ("Cutting", "Scanning", "Idle").
- **Plant Disease Scanner**: Upload crop leaf images or grab live frames directly from an ESP32-CAM on the robot. Runs predictions using HuggingFace / YOLOv8 model (`keremberke/yolov8m-agriculture`).
- **Voice Guidance Advisory**: Synthesizes localized audio advice for every disease scan using Google Text-to-Speech in the selected language.
- **Scan History**: Full filterable data table by crop type, disease, urgency level, date, and keyword.
- **Field Health Analytics**: Recharts interactive bar chart for Top 5 Diseases, Crop Health donut chart, and monthly outbreak trends.

---

## Tech Stack
- **Frontend**: React + Vite + TailwindCSS + Lucide Icons + Recharts + Leaflet + `react-i18next`
- **Backend**: Python FastAPI + Pydantic + gTTS + PIL + Ultralytics / Hugging Face YOLO
- **Database & Storage**: Supabase Database (`reports` table) + Cloudinary Storage
- **Push Notifications**: Firebase FCM / Web Push API

---

## Local Setup Instructions

### 1. Backend Setup
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```
Backend server will start at `http://localhost:8000`.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend application will start at `http://localhost:5173`.

---

## Deployment Configuration

### Deploying Frontend to Vercel
1. Connect your repository to Vercel.
2. Set Root Directory to `frontend`.
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Environment Variables: Set `VITE_API_BASE_URL` to your deployed backend URL.

### Deploying Backend to Render
1. Create a new Web Service on Render from your repository.
2. Set Root Directory to `backend`.
3. Environment: `Python`
4. Build Command: `pip install -r requirements.txt`
5. Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

