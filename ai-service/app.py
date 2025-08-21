from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import torch
import torch.nn.functional as F
from torchvision import models, transforms
import io
import json
import os
from typing import List, Dict
import yaml

app = FastAPI(title="LumaSkin AI Service", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://yourdomain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Model configuration
MODEL_PATH = os.path.join("..", "skin recognition AI", "outputs", "best_model.pth")
LABELS_PATH = os.path.join("..", "skin recognition AI", "outputs", "labels.json")
RECOMMENDATIONS_PATH = os.path.join("..", "skin recognition AI", "src", "recommendations.yaml")

# Global variables for model and labels
model = None
device = None
labels = []
recommendations = {}

def load_model():
    """Load the trained PyTorch model"""
    global model, device, labels
    
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"Model not found at {MODEL_PATH}")
    
    if not os.path.exists(LABELS_PATH):
        raise FileNotFoundError(f"Labels not found at {LABELS_PATH}")
    
    # Load labels
    with open(LABELS_PATH, 'r') as f:
        labels_data = json.load(f)
        labels = [labels_data[str(i)] for i in range(len(labels_data))]
    
    # Load model
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    checkpoint = torch.load(MODEL_PATH, map_location=device)
    
    # Determine model architecture from checkpoint
    model_name = checkpoint.get("config", {}).get("model", "efficientnet_b0")
    num_classes = len(labels)
    
    if model_name == "efficientnet_b0":
        model = models.efficientnet_b0(weights=None)
        in_features = model.classifier[1].in_features
        model.classifier[1] = torch.nn.Linear(in_features, num_classes)
    elif model_name == "resnet18":
        model = models.resnet18(weights=None)
        in_features = model.fc.in_features
        model.fc = torch.nn.Linear(in_features, num_classes)
    elif model_name == "mobilenet_v3_small":
        model = models.mobilenet_v3_small(weights=None)
        in_features = model.classifier[3].in_features
        model.classifier[3] = torch.nn.Linear(in_features, num_classes)
    else:
        raise ValueError(f"Unsupported model: {model_name}")
    
    # Load model state
    state = checkpoint.get("model_state", checkpoint)
    model.load_state_dict(state)
    model.eval()
    model.to(device)
    
    print(f"Model loaded successfully: {model_name} with {num_classes} classes")
    print(f"Labels: {labels}")

def load_recommendations():
    """Load skin care recommendations"""
    global recommendations
    
    if os.path.exists(RECOMMENDATIONS_PATH):
        with open(RECOMMENDATIONS_PATH, 'r', encoding='utf-8') as f:
            recommendations = yaml.safe_load(f) or {}
        print(f"Loaded recommendations for {len(recommendations)} conditions")

def build_transforms(size: int = 224):
    """Build image transforms for model input"""
    return transforms.Compose([
        transforms.Resize((size, size)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])

def predict_image(image: Image.Image, topk: int = 3) -> List[Dict]:
    """Predict skin condition from image"""
    global model, device, labels
    
    if model is None:
        raise RuntimeError("Model not loaded")
    
    # Preprocess image
    transform = build_transforms()
    x = transform(image).unsqueeze(0).to(device)
    
    # Get predictions
    with torch.no_grad():
        logits = model(x)
        probs = F.softmax(logits, dim=1).cpu().numpy()[0]
    
    # Get top-k predictions
    top_idx = probs.argsort()[::-1][:topk]
    results = [
        {
            "label": labels[i],
            "confidence": float(probs[i])
        }
        for i in top_idx
    ]
    
    return results

@app.on_event("startup")
async def startup_event():
    """Initialize model and recommendations on startup"""
    try:
        load_model()
        load_recommendations()
        print("AI service started successfully!")
    except Exception as e:
        print(f"Failed to start AI service: {e}")
        raise e

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "LumaSkin AI Service",
        "model_loaded": model is not None,
        "labels_count": len(labels),
        "recommendations_count": len(recommendations)
    }

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """Predict skin condition from uploaded image"""
    try:
        # Validate file
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read and process image
        content = await file.read()
        image = Image.open(io.BytesIO(content)).convert("RGB")
        
        # Get predictions
        predictions = predict_image(image, topk=3)
        
        # Enrich with recommendations
        enriched_predictions = []
        for pred in predictions:
            label = pred["label"]
            if label in recommendations:
                pred["recommendation"] = {
                    "guidance": recommendations[label]
                }
            enriched_predictions.append(pred)
        
        return {
            "predictions": enriched_predictions,
            "disclaimer": "This is not a medical diagnosis. Consult a dermatologist for concerns."
        }
        
    except Exception as e:
        print(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/labels")
async def get_labels():
    """Get available skin condition labels"""
    return {"labels": labels}

@app.get("/recommendations")
async def get_recommendations():
    """Get skin care recommendations"""
    return {"recommendations": recommendations}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
