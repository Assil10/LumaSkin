@echo off
echo 🧠 Starting LumaSkin AI System...
echo.

echo 📍 Starting AI Service (Python)...
start "AI Service" cmd /k "cd ai-service && python -m venv venv && venv\Scripts\activate && pip install -r requirements.txt && python app.py"

echo ⏳ Waiting for AI service to start...
timeout /t 10 /nobreak > nul

echo 🌐 Starting Next.js App...
start "Next.js App" cmd /k "npm run dev"

echo.
echo 🎉 Both services are starting!
echo.
echo 📱 AI Service: http://localhost:8001
echo 🌐 Next.js App: http://localhost:3000
echo.
echo 💡 Open http://localhost:3000/ai-skin-analysis to test the AI system
echo.
pause
