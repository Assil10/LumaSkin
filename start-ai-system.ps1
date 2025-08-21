# LumaSkin AI System Startup Script
Write-Host "🧠 Starting LumaSkin AI System..." -ForegroundColor Cyan
Write-Host ""

# Check if Python is installed
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✅ Python found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python not found. Please install Python 3.8+ first." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if Node.js is installed
try {
    $nodeVersion = node --version 2>&1
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js first." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "📍 Starting AI Service (Python)..." -ForegroundColor Yellow

# Start AI Service
$aiServiceJob = Start-Job -ScriptBlock {
    Set-Location "ai-service"
    
    # Create virtual environment if it doesn't exist
    if (!(Test-Path "venv")) {
        Write-Host "Creating virtual environment..." -ForegroundColor Yellow
        python -m venv venv
    }
    
    # Activate virtual environment and install dependencies
    & "venv\Scripts\Activate.ps1"
    pip install -r requirements.txt
    
    # Start the AI service
    python app.py
}

Write-Host "⏳ Waiting for AI service to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Check if AI service is running
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8001/" -Method Get -TimeoutSec 5
    Write-Host "✅ AI Service is running at http://localhost:8001" -ForegroundColor Green
    Write-Host "   Status: $($response.status)" -ForegroundColor Green
    Write-Host "   Model Loaded: $($response.model_loaded)" -ForegroundColor Green
    Write-Host "   Labels: $($response.labels_count)" -ForegroundColor Green
} catch {
    Write-Host "⚠️  AI Service might still be starting up..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🌐 Starting Next.js App..." -ForegroundColor Yellow

# Start Next.js App
$nextjsJob = Start-Job -ScriptBlock {
    npm run dev
}

Write-Host "⏳ Waiting for Next.js app to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host ""
Write-Host "🎉 Both services are starting!" -ForegroundColor Green
Write-Host ""
Write-Host "📱 AI Service: http://localhost:8001" -ForegroundColor Cyan
Write-Host "🌐 Next.js App: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 Open http://localhost:3000/ai-skin-analysis to test the AI system" -ForegroundColor Magenta
Write-Host ""

# Show job status
Write-Host "📊 Service Status:" -ForegroundColor Yellow
Get-Job | Format-Table -AutoSize

Write-Host ""
Write-Host "🔍 To monitor services:" -ForegroundColor Yellow
Write-Host "   - AI Service logs: Receive-Job -Id $($aiServiceJob.Id)" -ForegroundColor Gray
Write-Host "   - Next.js logs: Receive-Job -Id $($nextjsJob.Id)" -ForegroundColor Gray
Write-Host ""

Write-Host "Press Ctrl+C to stop all services" -ForegroundColor Red

try {
    # Keep the script running and show real-time updates
    while ($true) {
        Start-Sleep -Seconds 30
        
        # Check service health
        try {
            $aiHealth = Invoke-RestMethod -Uri "http://localhost:8001/" -Method Get -TimeoutSec 5
            Write-Host "✅ AI Service: Healthy" -ForegroundColor Green
        } catch {
            Write-Host "❌ AI Service: Unhealthy" -ForegroundColor Red
        }
        
        try {
            $nextjsHealth = Invoke-RestMethod -Uri "http://localhost:3000/" -Method Get -TimeoutSec 5
            Write-Host "✅ Next.js App: Healthy" -ForegroundColor Green
        } catch {
            Write-Host "❌ Next.js App: Unhealthy" -ForegroundColor Red
        }
        
        Write-Host "---" -ForegroundColor Gray
    }
} catch {
    Write-Host ""
    Write-Host "🛑 Stopping all services..." -ForegroundColor Red
    
    # Stop all jobs
    Get-Job | Stop-Job
    Get-Job | Remove-Job
    
    Write-Host "✅ All services stopped" -ForegroundColor Green
}
