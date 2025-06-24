import requests
import unittest
import json
import os
from dotenv import load_dotenv
import sys

# Load environment variables from frontend .env file to get the backend URL
load_dotenv('/app/frontend/.env')

# Get the backend URL from environment variables
BACKEND_URL = os.environ.get('REACT_APP_BACKEND_URL')
if not BACKEND_URL:
    print("Error: REACT_APP_BACKEND_URL not found in environment variables")
    sys.exit(1)

# Ensure the URL ends with /api
API_URL = f"{BACKEND_URL}/api"
print(f"Testing API at: {API_URL}")

class PortfolioBackendTests(unittest.TestCase):
    
    def test_root_endpoint(self):
        """Test the root API endpoint"""
        response = requests.get(f"{API_URL}/")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("message", data)
        self.assertIn("Portfolio API", data["message"])
        print("✅ Root endpoint test passed")
    
    def test_health_check(self):
        """Test the health check endpoint"""
        response = requests.get(f"{API_URL}/health")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "healthy")
        self.assertEqual(data["database"], "connected")
        self.assertIn("timestamp", data)
        print("✅ Health check test passed")
    
    def test_contact_form_submission(self):
        """Test submitting a contact form message"""
        contact_data = {
            "name": "John Doe",
            "email": "john.doe@example.com",
            "subject": "Test Message",
            "message": "This is a test message from the automated test suite."
        }
        
        response = requests.post(f"{API_URL}/contact", json=contact_data)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        # Verify the response contains the expected fields
        self.assertIn("id", data)
        self.assertEqual(data["name"], contact_data["name"])
        self.assertEqual(data["email"], contact_data["email"])
        self.assertEqual(data["subject"], contact_data["subject"])
        self.assertEqual(data["message"], contact_data["message"])
        self.assertIn("timestamp", data)
        print("✅ Contact form submission test passed")
    
    def test_get_contact_messages(self):
        """Test retrieving contact messages"""
        response = requests.get(f"{API_URL}/contact")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        # Verify the response is a list
        self.assertIsInstance(data, list)
        
        # If there are messages, verify their structure
        if data:
            message = data[0]
            self.assertIn("id", message)
            self.assertIn("name", message)
            self.assertIn("email", message)
            self.assertIn("subject", message)
            self.assertIn("message", message)
            self.assertIn("timestamp", message)
        print("✅ Get contact messages test passed")
    
    def test_visitor_tracking(self):
        """Test visitor tracking endpoint"""
        visitor_data = {
            "ip_address": "192.168.1.1",
            "user_agent": "Mozilla/5.0 (Test Browser)",
            "page_visited": "/home"
        }
        
        response = requests.post(f"{API_URL}/visitor-stats", json=visitor_data)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        # Verify the response contains the expected fields
        self.assertIn("id", data)
        self.assertEqual(data["ip_address"], visitor_data["ip_address"])
        self.assertEqual(data["user_agent"], visitor_data["user_agent"])
        self.assertEqual(data["page_visited"], visitor_data["page_visited"])
        self.assertIn("timestamp", data)
        print("✅ Visitor tracking test passed")
    
    def test_visitor_count(self):
        """Test visitor count endpoint"""
        response = requests.get(f"{API_URL}/visitor-stats/count")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        # Verify the response contains the expected fields
        self.assertIn("total_visits", data)
        self.assertIn("unique_visitors", data)
        self.assertIsInstance(data["total_visits"], int)
        self.assertIsInstance(data["unique_visitors"], int)
        print("✅ Visitor count test passed")
    
    def test_portfolio_stats(self):
        """Test portfolio stats endpoint"""
        response = requests.get(f"{API_URL}/portfolio-stats")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        # Verify the response contains the expected fields
        self.assertIn("total_visits", data)
        self.assertIn("unique_visitors", data)
        self.assertIn("contact_messages", data)
        self.assertIn("recent_visits", data)
        self.assertIn("projects_completed", data)
        self.assertIn("problems_solved", data)
        self.assertIn("max_leetcode_rating", data)
        self.assertIn("certifications", data)
        
        # Verify data types
        self.assertIsInstance(data["total_visits"], int)
        self.assertIsInstance(data["unique_visitors"], int)
        self.assertIsInstance(data["contact_messages"], int)
        self.assertIsInstance(data["recent_visits"], int)
        self.assertIsInstance(data["projects_completed"], int)
        self.assertIsInstance(data["problems_solved"], int)
        self.assertIsInstance(data["max_leetcode_rating"], int)
        self.assertIsInstance(data["certifications"], int)
        print("✅ Portfolio stats test passed")

if __name__ == "__main__":
    # Run the tests
    unittest.main(argv=['first-arg-is-ignored'], exit=False)