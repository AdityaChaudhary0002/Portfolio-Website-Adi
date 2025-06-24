from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Portfolio Models
class ContactMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    subject: str
    message: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class ContactMessageCreate(BaseModel):
    name: str
    email: str
    subject: str
    message: str

class VisitorStats(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    ip_address: str
    user_agent: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    page_visited: str

class VisitorStatsCreate(BaseModel):
    ip_address: str
    user_agent: str
    page_visited: str

# Original status check models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# Portfolio Routes
@api_router.post("/contact", response_model=ContactMessage)
async def create_contact_message(contact_data: ContactMessageCreate):
    """Submit a contact form message"""
    try:
        contact_dict = contact_data.dict()
        contact_obj = ContactMessage(**contact_dict)
        result = await db.contact_messages.insert_one(contact_obj.dict())
        
        if result.inserted_id:
            return contact_obj
        else:
            raise HTTPException(status_code=500, detail="Failed to save contact message")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving contact message: {str(e)}")

@api_router.get("/contact", response_model=List[ContactMessage])
async def get_contact_messages():
    """Get all contact messages (admin only)"""
    try:
        messages = await db.contact_messages.find().sort("timestamp", -1).to_list(100)
        return [ContactMessage(**message) for message in messages]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving contact messages: {str(e)}")

@api_router.post("/visitor-stats", response_model=VisitorStats)
async def track_visitor(visitor_data: VisitorStatsCreate):
    """Track visitor statistics"""
    try:
        visitor_dict = visitor_data.dict()
        visitor_obj = VisitorStats(**visitor_dict)
        result = await db.visitor_stats.insert_one(visitor_obj.dict())
        
        if result.inserted_id:
            return visitor_obj
        else:
            raise HTTPException(status_code=500, detail="Failed to save visitor stats")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving visitor stats: {str(e)}")

@api_router.get("/visitor-stats/count")
async def get_visitor_count():
    """Get total visitor count"""
    try:
        total_visitors = await db.visitor_stats.count_documents({})
        unique_visitors = len(await db.visitor_stats.distinct("ip_address"))
        
        return {
            "total_visits": total_visitors,
            "unique_visitors": unique_visitors
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving visitor stats: {str(e)}")

@api_router.get("/portfolio-stats")
async def get_portfolio_stats():
    """Get portfolio statistics for dashboard"""
    try:
        # Get visitor stats
        total_visits = await db.visitor_stats.count_documents({})
        unique_visitors = len(await db.visitor_stats.distinct("ip_address"))
        
        # Get contact messages count
        contact_messages = await db.contact_messages.count_documents({})
        
        # Get recent visitors (last 7 days)
        from datetime import timedelta
        week_ago = datetime.utcnow() - timedelta(days=7)
        recent_visits = await db.visitor_stats.count_documents({
            "timestamp": {"$gte": week_ago}
        })
        
        return {
            "total_visits": total_visits,
            "unique_visitors": unique_visitors,
            "contact_messages": contact_messages,
            "recent_visits": recent_visits,
            "projects_completed": 3,
            "problems_solved": 1500,
            "max_leetcode_rating": 1805,
            "certifications": 5
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving portfolio stats: {str(e)}")

# Original routes
@api_router.get("/")
async def root():
    return {"message": "Aditya Chaudhary's Portfolio API"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Health check endpoint
@api_router.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Test database connection
        await db.command("ping")
        return {
            "status": "healthy",
            "database": "connected",
            "timestamp": datetime.utcnow()
        }
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Service unavailable: {str(e)}")

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)