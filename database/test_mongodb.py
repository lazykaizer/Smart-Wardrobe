#!/usr/bin/env python3
"""
Test MongoDB Connection for Smart Wardrobe
"""

from pymongo import MongoClient
from datetime import datetime
import json

def test_mongodb_connection():
    """Test MongoDB connection and basic operations"""
    try:
        print("🔗 Testing MongoDB Connection...")
        
        # Connect to MongoDB
        client = MongoClient("mongodb+srv://wardrobeUser:Wardrobe123@Wardrobe123.zljuhv4.mongodb.net/?retryWrites=true&w=majority&appName=SmartWardrobeCluster")
        db = client["smartwardrobe"]
        clothes = db["clothes"]
        
        print("✅ Successfully connected to MongoDB!")
        
        # Test database ping
        client.admin.command('ping')
        print("✅ Database ping successful!")
        
        # Test insert operation
        test_cloth = {
            "name": "Test T-Shirt",
            "category": "topwear",
            "color": "blue",
            "brand": "Test Brand",
            "size": "M",
            "created_at": datetime.now().isoformat(),
            "test": True
        }
        
        result = clothes.insert_one(test_cloth)
        print(f"✅ Test cloth inserted with ID: {result.inserted_id}")
        
        # Test find operation
        found_cloth = clothes.find_one({"_id": result.inserted_id}, {"_id": 0})
        print(f"✅ Test cloth retrieved: {json.dumps(found_cloth, indent=2)}")
        
        # Test update operation
        update_result = clothes.update_one(
            {"_id": result.inserted_id},
            {"$set": {"updated_at": datetime.now().isoformat()}}
        )
        print(f"✅ Test cloth updated: {update_result.modified_count} document(s) modified")
        
        # Test delete operation
        delete_result = clothes.delete_one({"_id": result.inserted_id})
        print(f"✅ Test cloth deleted: {delete_result.deleted_count} document(s) deleted")
        
        # Test count operation
        total_clothes = clothes.count_documents({})
        print(f"✅ Total clothes in database: {total_clothes}")
        
        print("\n🎉 All MongoDB operations successful!")
        return True
        
    except Exception as e:
        print(f"❌ MongoDB test failed: {e}")
        return False

if __name__ == "__main__":
    print("=" * 50)
    print("Smart Wardrobe - MongoDB Connection Test")
    print("=" * 50)
    
    success = test_mongodb_connection()
    
    if success:
        print("\n✅ MongoDB is ready for use!")
    else:
        print("\n❌ MongoDB connection failed. Please check your connection string.")
    
    print("=" * 50)
