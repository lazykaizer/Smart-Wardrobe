"""
Smart Wardrobe - Flask Backend
AI-powered virtual wardrobe with cloth changing capabilities
Weather-based outfit suggestions
"""

from flask import Flask, request, jsonify, send_from_directory # Import Flask framework and necessary modules
from flask_cors import CORS # Import CORS for cross-origin resource sharing
from pymongo import MongoClient # Import MongoDB client for database operations
import os # Import os module for file system operations
import base64 # Import base64 for image encoding/decoding
from io import BytesIO # Import BytesIO for handling binary data in memory
from PIL import Image # Import PIL (Pillow) for image processing
import hashlib # Import hashlib for generating file hashes
from datetime import datetime # Import datetime for timestamp operations

# Get base directories
BASE_DIR = os.path.dirname(os.path.abspath(__file__)) # Get current file directory
PROJECT_ROOT = os.path.dirname(BASE_DIR) # Get project root directory (one level up)
FRONTEND_DIR = os.path.join(PROJECT_ROOT, 'frontend') # Get frontend directory path

app = Flask(__name__, # Create Flask application instance
            static_folder=FRONTEND_DIR, # Set static files directory
            static_url_path='', # Set static URL path to root
            template_folder=FRONTEND_DIR) # Set template directory
CORS(app)  # Enable CORS for all routes to allow cross-origin requests

# MongoDB Connection
try: # Try to establish MongoDB connection
    # Your MongoDB connection string
    client = MongoClient("mongodb+srv://wardrobeUser:Wardrobe123@Wardrobe123.zljuhv4.mongodb.net/?retryWrites=true&w=majority&appName=SmartWardrobeCluster") # Connect to MongoDB Atlas
    db = client["smartwardrobe"] # Get database instance
    clothes = db["clothes"] # Get clothes collection
    print("Successfully connected to MongoDB!") # Print success message
except Exception as e: # Catch any connection errors
    print(f"MongoDB connection failed: {e}") # Print error message
    client = None # Set client to None if connection fails
    db = None # Set database to None if connection fails
    clothes = None # Set collection to None if connection fails

# Configuration
UPLOAD_FOLDER = os.path.join(PROJECT_ROOT, 'frontend', 'assets', 'uploads') # Path to upload directory
RESULTS_FOLDER = os.path.join(PROJECT_ROOT, 'frontend', 'assets', 'results') # Path to results directory
MAX_FILE_SIZE = 16 * 1024 * 1024  # 16MB - Maximum file size for uploads
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'} # Allowed image file extensions

# Create necessary directories
os.makedirs(UPLOAD_FOLDER, exist_ok=True) # Create upload directory if it doesn't exist
os.makedirs(RESULTS_FOLDER, exist_ok=True) # Create results directory if it doesn't exist


def allowed_file(filename): # Function to check if file extension is allowed
    """Check if file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS # Check if file has valid extension


def generate_unique_filename(original_filename): # Function to generate unique filename
    """Generate unique filename using hash and timestamp"""
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S') # Get current timestamp in YYYYMMDD_HHMMSS format
    hash_obj = hashlib.md5(original_filename.encode()) # Create MD5 hash of original filename
    hash_str = hash_obj.hexdigest()[:8] # Get first 8 characters of hash
    ext = original_filename.rsplit('.', 1)[1].lower() if '.' in original_filename else 'png' # Get file extension or default to png
    return f"{timestamp}_{hash_str}.{ext}" # Return unique filename with timestamp and hash


def mock_ai_cloth_change(person_image, garment_image):
    """
    Mock AI cloth changing function
    In production, this would call a real AI model like:
    - Stable Diffusion with ControlNet
    - Virtual Try-On models (VITON, HR-VITON)
    - Custom-trained models
    
    For now, it creates a simple composite image
    """
    try:
        # Open images
        person = Image.open(person_image).convert('RGBA')
        garment = Image.open(garment_image).convert('RGBA')
        
        # Resize person image to max 1024px while maintaining aspect ratio
        max_size = 1024
        if person.width > max_size or person.height > max_size:
            person.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
        
        # Create a new image for the result
        result = Image.new('RGBA', person.size, (255, 255, 255, 0))
        result.paste(person, (0, 0))
        
        # Calculate garment position (center on torso area)
        garment_width = int(person.width * 0.55)
        garment_height = int(garment_width * garment.height / garment.width)
        garment_resized = garment.resize((garment_width, garment_height), Image.Resampling.LANCZOS)
        
        # Position garment on torso (roughly center-top area)
        x_offset = (person.width - garment_width) // 2
        y_offset = int(person.height * 0.32)
        
        # Create a semi-transparent version for blending
        garment_layer = Image.new('RGBA', person.size, (255, 255, 255, 0))
        garment_layer.paste(garment_resized, (x_offset, y_offset))
        
        # Blend the garment with the person image
        result = Image.alpha_composite(result, garment_layer)
        
        # Convert back to RGB
        result_rgb = Image.new('RGB', result.size, (255, 255, 255))
        result_rgb.paste(result, mask=result.split()[3])
        
        return result_rgb
        
    except Exception as e:
        print(f"Error in mock AI processing: {str(e)}")
        raise


@app.route('/')
def index():
    """Serve the main landing page"""
    return send_from_directory(FRONTEND_DIR, 'landing.html')


@app.route('/<path:path>')
def serve_static(path):
    """Serve static files"""
    return send_from_directory(FRONTEND_DIR, path)


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'Smart Wardrobe API is running',
        'version': '1.0.0'
    })


@app.route('/api/change_cloth', methods=['POST'])
def change_cloth():
    """
    Main endpoint for AI cloth changing
    Expects: multipart/form-data with 'person' and 'garment' image files
    Returns: JSON with result image URL or base64 data
    """
    try:
        # Check if files are present
        if 'person' not in request.files:
            return jsonify({'success': False, 'error': 'No person image provided'}), 400
        
        if 'garment' not in request.files:
            return jsonify({'success': False, 'error': 'No garment image provided'}), 400
        
        person_file = request.files['person']
        garment_file = request.files['garment']
        
        # Validate files
        if person_file.filename == '' or garment_file.filename == '':
            return jsonify({'success': False, 'error': 'Empty filename'}), 400
        
        if not (allowed_file(person_file.filename) and allowed_file(garment_file.filename)):
            return jsonify({'success': False, 'error': 'Invalid file type. Only PNG, JPG, JPEG, WEBP allowed'}), 400
        
        # Save uploaded files temporarily
        person_filename = generate_unique_filename(person_file.filename)
        garment_filename = generate_unique_filename(garment_file.filename)
        
        person_path = os.path.join(UPLOAD_FOLDER, person_filename)
        garment_path = os.path.join(UPLOAD_FOLDER, garment_filename)
        
        person_file.save(person_path)
        garment_file.save(garment_path)
        
        # Process with mock AI
        result_image = mock_ai_cloth_change(person_path, garment_path)
        
        # Save result
        result_filename = f"result_{generate_unique_filename('output.png')}"
        result_path = os.path.join(RESULTS_FOLDER, result_filename)
        result_image.save(result_path, 'PNG', quality=95)
        
        # Convert to base64 for immediate display
        buffered = BytesIO()
        result_image.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode()
        
        # Clean up uploaded files (optional - comment out to keep uploads)
        # os.remove(person_path)
        # os.remove(garment_path)
        
        return jsonify({
            'success': True,
            'message': 'Cloth change successful',
            'result_url': f'/results/{result_filename}',
            'result_base64': f'data:image/png;base64,{img_str}'
        })
        
    except Exception as e:
        print(f"Error processing cloth change: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'Processing failed: {str(e)}'
        }), 500


@app.route('/api/wardrobe/items', methods=['GET'])
def get_wardrobe_items():
    """
    Get wardrobe items from MongoDB
    """
    try:
        if not clothes:
            return jsonify({'success': False, 'error': 'Database not connected'}), 500
            
        # Get all clothes from MongoDB, exclude _id field
        items = list(clothes.find({}, {"_id": 0}))
        return jsonify({'success': True, 'items': items})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


# MongoDB API Routes
@app.route('/add_clothes', methods=['POST'])
def add_clothes():
    """Add new clothes to MongoDB"""
    try:
        if not clothes:
            return jsonify({"error": "Database not connected"}), 500
            
        data = request.get_json()
        
        # Add timestamp
        data['created_at'] = datetime.now().isoformat()
        
        # Insert into MongoDB
        result = clothes.insert_one(data)
        
        return jsonify({
            "message": "Cloth added successfully!",
            "id": str(result.inserted_id)
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/clothes', methods=['GET'])
def get_clothes():
    """Get all clothes from MongoDB"""
    try:
        if not clothes:
            return jsonify({"error": "Database not connected"}), 500
            
        # Get all clothes, exclude MongoDB's _id field
        data = list(clothes.find({}, {"_id": 0}))
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/clothes/<cloth_id>', methods=['GET'])
def get_cloth(cloth_id):
    """Get specific cloth by ID"""
    try:
        if not clothes:
            return jsonify({"error": "Database not connected"}), 500
            
        from bson import ObjectId
        cloth = clothes.find_one({"_id": ObjectId(cloth_id)}, {"_id": 0})
        
        if cloth:
            return jsonify(cloth)
        else:
            return jsonify({"error": "Cloth not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/clothes/<cloth_id>', methods=['PUT'])
def update_cloth(cloth_id):
    """Update specific cloth by ID"""
    try:
        if not clothes:
            return jsonify({"error": "Database not connected"}), 500
            
        from bson import ObjectId
        data = request.get_json()
        data['updated_at'] = datetime.now().isoformat()
        
        result = clothes.update_one(
            {"_id": ObjectId(cloth_id)}, 
            {"$set": data}
        )
        
        if result.modified_count > 0:
            return jsonify({"message": "Cloth updated successfully!"})
        else:
            return jsonify({"error": "Cloth not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/clothes/<cloth_id>', methods=['DELETE'])
def delete_cloth(cloth_id):
    """Delete specific cloth by ID"""
    try:
        if not clothes:
            return jsonify({"error": "Database not connected"}), 500
            
        from bson import ObjectId
        result = clothes.delete_one({"_id": ObjectId(cloth_id)})
        
        if result.deleted_count > 0:
            return jsonify({"message": "Cloth deleted successfully!"})
        else:
            return jsonify({"error": "Cloth not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/weather/suggest', methods=['POST'])
def weather_suggest():
    """
    Get weather-based outfit suggestions
    Uses local mock weather data - 100% OFFLINE - no external APIs
    Returns outfit recommendations based on temperature and conditions
    """
    try:
        data = request.get_json()
        city = data.get('city', '').strip()
        print(f"DEBUG: Received city: {city}")
        
        if not city:
            return jsonify({'success': False, 'error': 'City name is required'}), 400
        
        # Get local weather data (no external API calls)
        print("DEBUG: Calling get_mock_weather...")
        weather_data = get_mock_weather(city)
        print(f"DEBUG: weather_data type: {type(weather_data)}, value: {weather_data}")
        
        if not weather_data:
            print("DEBUG: No weather data found")
            return jsonify({
                'success': False,
                'error': f"City '{city}' not found. Try: London, New York, Tokyo, Paris, Dubai, Mumbai, Sydney, Moscow, Singapore, Los Angeles"
            }), 404
        
        # Extract weather data
        print("DEBUG: Extracting temperature...")
        temp = weather_data["main"]["temp"]
        feels_like = weather_data["main"]["feels_like"]
        condition = weather_data["weather"][0]["main"]
        description = weather_data["weather"][0]["description"]
        humidity = weather_data["main"]["humidity"]
        wind_speed = weather_data["wind"]["speed"]
        
        # AI outfit suggestion logic based on temperature and conditions
        suggestions = []
        outfit_items = []
        
        # Temperature-based suggestions
        if temp < 0:
            suggestions.append("It's freezing! Bundle up warm.")
            outfit_items.extend(['Heavy winter coat', 'Thermal layers', 'Wool scarf', 'Gloves', 'Winter boots'])
        elif temp < 10:
            suggestions.append("It's quite cold. Wear warm layers.")
            outfit_items.extend(['Warm jacket or coat', 'Sweater', 'Long pants', 'Closed shoes', 'Light scarf'])
        elif temp < 15:
            suggestions.append("Cool weather. A jacket would be perfect.")
            outfit_items.extend(['Light jacket', 'Long-sleeve shirt', 'Jeans', 'Sneakers'])
        elif temp < 20:
            suggestions.append("Mild and pleasant. Comfortable clothing recommended.")
            outfit_items.extend(['Hoodie or cardigan', 'T-shirt', 'Jeans or casual pants', 'Comfortable shoes'])
        elif temp < 25:
            suggestions.append("Nice weather! Light clothing is ideal.")
            outfit_items.extend(['T-shirt or polo', 'Light pants or shorts', 'Sneakers', 'Sunglasses'])
        elif temp < 30:
            suggestions.append("Warm weather. Stay cool and comfortable.")
            outfit_items.extend(['Light t-shirt', 'Shorts or summer dress', 'Sandals', 'Sun hat', 'Sunglasses'])
        else:
            suggestions.append("Very hot! Wear minimal, breathable clothing.")
            outfit_items.extend(['Tank top or light shirt', 'Shorts', 'Sandals', 'Sun protection', 'Stay hydrated!'])
        
        # Condition-based suggestions
        if 'rain' in condition.lower() or 'drizzle' in condition.lower():
            suggestions.append("It's rainy! Don't forget rain gear.")
            outfit_items.extend(['Waterproof jacket', 'Umbrella', 'Water-resistant shoes'])
        elif 'snow' in condition.lower():
            suggestions.append("Snowy conditions! Wear waterproof winter gear.")
            outfit_items.extend(['Snow boots', 'Waterproof coat', 'Warm gloves'])
        elif 'cloud' in condition.lower():
            suggestions.append("Cloudy skies. Layer up just in case.")
        elif 'clear' in condition.lower() or 'sun' in condition.lower():
            suggestions.append("Clear skies! Perfect weather to go out.")
            outfit_items.extend(['Sunglasses', 'Light colors'])
        
        # Wind-based suggestions
        if wind_speed > 10:
            suggestions.append("It's windy! Consider a windbreaker.")
            outfit_items.append('Windbreaker or wind-resistant jacket')
        
        # Humidity-based suggestions
        if humidity > 80:
            suggestions.append("High humidity. Choose breathable fabrics.")
            outfit_items.append('Breathable cotton or moisture-wicking fabrics')
        
        return jsonify({
            'success': True,
            'city': city,
            'weather': {
                'temperature': round(temp, 1),
                'feels_like': round(feels_like, 1),
                'condition': condition,
                'description': description.capitalize(),
                'humidity': humidity,
                'wind_speed': wind_speed
            },
            'suggestions': suggestions,
            'outfit_items': list(set(outfit_items)),  # Remove duplicates
            'emoji': get_weather_emoji(condition, temp)
        })
        
    except Exception as e:
        print(f"Error in weather suggestion: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'An error occurred: {str(e)}'
        }), 500


def get_weather_emoji(condition, temp):
    """Get emoji based on weather condition and temperature"""
    condition = condition.lower()
    
    if 'thunder' in condition:
        return 'Storm'
    elif 'rain' in condition or 'drizzle' in condition:
        return 'Rain'
    elif 'snow' in condition:
        return 'Snow'
    elif 'cloud' in condition:
        return 'Cloudy'
    elif temp > 30:
        return 'Hot'
    elif 'clear' in condition:
        return 'Sunny'
    else:
        return 'Partly Cloudy'


def get_mock_weather(city):
    """
    Return local weather data - completely offline, no external dependencies
    All weather data is stored locally for instant access
    """
    city_lower = city.lower().strip()
    
    # Mock weather database
    mock_cities = {
        'london': {
            'main': {'temp': 15, 'feels_like': 13, 'humidity': 75},
            'weather': [{'main': 'Clouds', 'description': 'overcast clouds'}],
            'wind': {'speed': 5.5}
        },
        'new york': {
            'main': {'temp': 22, 'feels_like': 21, 'humidity': 60},
            'weather': [{'main': 'Clear', 'description': 'clear sky'}],
            'wind': {'speed': 3.2}
        },
        'tokyo': {
            'main': {'temp': 18, 'feels_like': 17, 'humidity': 70},
            'weather': [{'main': 'Rain', 'description': 'light rain'}],
            'wind': {'speed': 4.1}
        },
        'paris': {
            'main': {'temp': 16, 'feels_like': 15, 'humidity': 68},
            'weather': [{'main': 'Clouds', 'description': 'few clouds'}],
            'wind': {'speed': 4.5}
        },
        'dubai': {
            'main': {'temp': 35, 'feels_like': 38, 'humidity': 55},
            'weather': [{'main': 'Clear', 'description': 'clear sky'}],
            'wind': {'speed': 2.8}
        },
        'mumbai': {
            'main': {'temp': 28, 'feels_like': 30, 'humidity': 85},
            'weather': [{'main': 'Rain', 'description': 'moderate rain'}],
            'wind': {'speed': 6.2}
        },
        'sydney': {
            'main': {'temp': 20, 'feels_like': 19, 'humidity': 65},
            'weather': [{'main': 'Clear', 'description': 'sunny'}],
            'wind': {'speed': 3.5}
        },
        'moscow': {
            'main': {'temp': 5, 'feels_like': 2, 'humidity': 80},
            'weather': [{'main': 'Snow', 'description': 'light snow'}],
            'wind': {'speed': 7.1}
        },
        'singapore': {
            'main': {'temp': 31, 'feels_like': 35, 'humidity': 90},
            'weather': [{'main': 'Rain', 'description': 'tropical rain'}],
            'wind': {'speed': 4.0}
        },
        'los angeles': {
            'main': {'temp': 25, 'feels_like': 24, 'humidity': 50},
            'weather': [{'main': 'Clear', 'description': 'sunny and warm'}],
            'wind': {'speed': 2.5}
        }
    }
    
    # Check if city exists in mock database
    for city_name, weather_data in mock_cities.items():
        if city_name in city_lower or city_lower in city_name:
            weather_data['cod'] = 200
            return weather_data
    
    return None


@app.route('/results/<filename>')
def serve_result(filename):
    """Serve generated result images"""
    return send_from_directory(RESULTS_FOLDER, filename)


@app.route('/uploads/<filename>')
def serve_upload(filename):
    """Serve uploaded images"""
    return send_from_directory(UPLOAD_FOLDER, filename)


# Error handlers
@app.errorhandler(404)
def not_found(e):
    return jsonify({'success': False, 'error': 'Endpoint not found'}), 404


@app.errorhandler(500)
def server_error(e):
    return jsonify({'success': False, 'error': 'Internal server error'}), 500


if __name__ == '__main__':
    print("""
    ===========================================================
         Smart Wardrobe - Flask Backend Server
    ===========================================================
    
    Server running at: http://localhost:5000
    
    100% Offline - No External Dependencies!
    MongoDB Status: """ + ("Connected" if client else "Failed") + """
    
    Features:
    - Virtual Cloth Try-On
    - Weather-Based Outfit Suggestions (Local Data)
    - Smart Wardrobe Management
    - AI Outfit Generator
    - MongoDB Database Integration
    
    API Endpoints:
    - POST /add_clothes - Add new clothes to database
    - GET /clothes - Get all clothes from database
    - GET /clothes/<id> - Get specific cloth by ID
    - PUT /clothes/<id> - Update cloth by ID
    - DELETE /clothes/<id> - Delete cloth by ID
    - GET /health - Health check with MongoDB status
    
    Main Pages:
    - http://localhost:5000/landing.html
    - http://localhost:5000/index.html
    - http://localhost:5000/ai-cloth-changer.html
    - http://localhost:5000/ai-stylist.html
    
    ===========================================================
    """)
    
    # Run the Flask app
    # Use debug=True for development, debug=False for production
    app.run(debug=True, host='0.0.0.0', port=5000)

