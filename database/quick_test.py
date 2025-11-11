#!/usr/bin/env python3
"""
Quick MongoDB Connection Test
"""

from pymongo import MongoClient

def quick_test():
    try:
        print("🔗 Testing MongoDB connection...")
        
        # Your connection string
        client = MongoClient("mongodb+srv://wardrobeUser:Wardrobe123@Wardrobe123.zljuhv4.mongodb.net/?retryWrites=true&w=majority&appName=SmartWardrobeCluster")
        
        # Test connection
        client.admin.command('ping')
        print("✅ MongoDB connection successful!")
        
        # Test database access
        db = client["smartwardrobe"]
        collection = db["clothes"]
        
        # Count documents
        count = collection.count_documents({})
        print(f"✅ Database accessible! Found {count} clothes in collection.")
        
        return True
        
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        return False

if __name__ == "__main__":
    quick_test()
