// User database functionality
class UserDatabase {
    constructor() {
        // Load users from localStorage - ALWAYS check localStorage first
        try {
            const storedUsers = localStorage.getItem('users');
            const storedCurrentUser = localStorage.getItem('currentUser');
            
            this.users = storedUsers ? JSON.parse(storedUsers) : [];
            this.currentUser = storedCurrentUser ? JSON.parse(storedCurrentUser) : null;
            
            // Check for remember me and auto-login
            this.checkRememberMe();
            
            // UserDB initialized
        } catch (error) {
            console.error('Error loading user data:', error);
            this.users = [];
            this.currentUser = null;
        }
    }
    
    // Check remember me and auto-login
    checkRememberMe() {
        try {
            const rememberMe = localStorage.getItem('rememberMe');
            const rememberedUser = localStorage.getItem('rememberedUser');
            
            if (rememberMe === 'true' && rememberedUser && !this.currentUser) {
                const remembered = JSON.parse(rememberedUser);
                const now = Date.now();
                const weekInMs = 7 * 24 * 60 * 60 * 1000; // 7 days
                
                // Check if remember me is still valid (within 7 days)
                if (now - remembered.timestamp < weekInMs) {
                    // Find the user and auto-login
                    const user = this.users.find(u => 
                        u.email === remembered.emailOrUsername || u.username === remembered.emailOrUsername
                    );
                    
                    if (user) {
                        this.currentUser = {
                            id: user.id,
                            username: user.username,
                            email: user.email,
                            role: user.role
                        };
                        
                        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                        localStorage.setItem('isLoggedIn', 'true');
                        sessionStorage.setItem('isLoggedIn', 'true');
                        
                        // Auto-login successful
                    }
                } else {
                    // Remember me expired, clean up
                    localStorage.removeItem('rememberMe');
                    localStorage.removeItem('rememberedUser');
                }
            }
        } catch (error) {
            console.error('Error checking remember me:', error);
        }
    }

    // Register a new user - BULLETPROOF VERSION
    registerUser(username, email, password) {
        // Registration attempt
        
        // Normalize inputs
        const normalizedUsername = username.trim();
        const normalizedEmail = email.trim().toLowerCase();
        const normalizedPassword = password.trim();
        
        // Validate inputs
        if (!normalizedUsername || !normalizedEmail || !normalizedPassword) {
            return { success: false, message: 'All fields are required' };
        }
        
        // CRITICAL: Always reload users from localStorage before registration
        try {
            const storedUsers = localStorage.getItem('users');
            if (storedUsers) {
                this.users = JSON.parse(storedUsers);
                // Reloaded users for registration check
            }
        } catch (error) {
            console.error('❌ Error reloading users for registration:', error);
            return { success: false, message: 'Database error. Please try again.' };
        }
        
        // Check if username already exists (case-insensitive)
        const usernameExists = this.users.some(user => 
            user.username.toLowerCase() === normalizedUsername.toLowerCase()
        );
        
        if (usernameExists) {
            return { success: false, message: 'Username already exists' };
        }
        
        // Check if email already exists (case-insensitive)
        const emailExists = this.users.some(user => 
            user.email.toLowerCase() === normalizedEmail
        );
        
        if (emailExists) {
            return { success: false, message: 'Email already exists' };
        }
        
        // Create new user object
        const newUser = {
            id: Date.now(),
            username: normalizedUsername, // Store normalized username
            email: normalizedEmail, // Store normalized email
            password: normalizedPassword, // Store normalized password
            createdAt: new Date().toISOString(),
            role: this.users.length === 0 ? 'admin' : 'user' // First user is admin
        };
        
        // Creating new user
        
        // Add to users array
        this.users.push(newUser);
        
        // Save to localStorage with error handling
        try {
            this.saveUsers();
            // Registration successful
            return { success: true, message: 'Registration successful' };
        } catch (error) {
            console.error('❌ Error saving new user:', error);
            // Remove the user from array if save failed
            this.users.pop();
            return { success: false, message: 'Unable to save user data. Please check browser storage.' };
        }
    }
    
    // Login user - BULLETPROOF VERSION
    loginUser(emailOrUsername, password, rememberMe = false) {
        // Login attempt
        
        // CRITICAL: Always reload users from localStorage before login attempt
        try {
            const storedUsers = localStorage.getItem('users');
            if (storedUsers) {
                this.users = JSON.parse(storedUsers);
                // Reloaded users from localStorage
            } else {
                console.warn('⚠️ No users found in localStorage!');
                return { success: false, message: 'No users found. Please register first.' };
            }
        } catch (error) {
            console.error('❌ Error reloading users:', error);
            return { success: false, message: 'Database error. Please try again.' };
        }
        
        // Normalize inputs - trim whitespace and convert to lowercase for comparison
        const normalizedEmailOrUsername = emailOrUsername.trim().toLowerCase();
        const normalizedPassword = password.trim();
        
        // Searching for user
        
        // Find user by email OR username (case-insensitive)
        const user = this.users.find(user => {
            const normalizedUserEmail = user.email.toLowerCase();
            const normalizedUserUsername = user.username.toLowerCase();
            
            const emailMatch = normalizedUserEmail === normalizedEmailOrUsername;
            const usernameMatch = normalizedUserUsername === normalizedEmailOrUsername;
            const passwordMatch = user.password === normalizedPassword;
            
            // Checking user credentials
            
            return (emailMatch || usernameMatch) && passwordMatch;
        });
        
        if (!user) {
            return { success: false, message: 'Invalid email/username or password' };
        }
        
        // User found
        
        // Set current user
        this.currentUser = {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        };
        
        // Save current user to localStorage with error handling
        try {
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            // Current user saved to localStorage
        } catch (error) {
            console.error('❌ Error saving current user:', error);
            return { success: false, message: 'Unable to save login session. Please check browser storage.' };
        }
        
        // Set login flags with error handling
        try {
            sessionStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('isLoggedIn', 'true');
            // Login flags set
        } catch (error) {
            console.error('❌ Error setting login flags:', error);
            return { success: false, message: 'Unable to set login session. Please check browser storage.' };
        }
        
        // Handle remember me
        if (rememberMe) {
            try {
                localStorage.setItem('rememberMe', 'true');
                localStorage.setItem('rememberedUser', JSON.stringify({
                    emailOrUsername: emailOrUsername.trim(), // Keep original case for display
                    timestamp: Date.now()
                }));
                // Remember me data saved
            } catch (error) {
                console.error('❌ Error saving remember me data:', error);
                // Don't fail login for remember me issues
            }
        } else {
            localStorage.removeItem('rememberMe');
            localStorage.removeItem('rememberedUser');
        }
        
        // Login successful
        return { success: true, message: 'Login successful', user: this.currentUser };
    }
    
    // Logout user
    logoutUser() {
        const username = this.currentUser ? this.currentUser.username : 'Unknown';
        
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('rememberedUser');
        sessionStorage.clear();
        // DO NOT remove 'users' from localStorage - keep all registered users!
        // DO NOT remove user-specific data - it stays with the user for next login
        // User logged out
        return { success: true, message: 'Logout successful' };
    }
    
    // Check if user is logged in - BULLETPROOF VERSION
    isLoggedIn() {
        // First check if we have a current user in memory
        if (this.currentUser) {
            // Verify the user still exists in localStorage
            try {
                const storedUsers = localStorage.getItem('users');
                if (storedUsers) {
                    const users = JSON.parse(storedUsers);
                    const userExists = users.some(user => 
                        user.id === this.currentUser.id && 
                        user.username === this.currentUser.username &&
                        user.email === this.currentUser.email
                    );
                    
                    if (userExists) {
                        // User is logged in and verified
                        return true;
                    } else {
                        // User not found in database, logging out
                        this.logoutUser();
                        return false;
                    }
                }
            } catch (error) {
                console.error('❌ Error verifying user:', error);
                this.logoutUser();
                return false;
            }
        }
        
        // Check localStorage for current user
        try {
            const storedCurrentUser = localStorage.getItem('currentUser');
            const storedIsLoggedIn = localStorage.getItem('isLoggedIn');
            
            if (storedCurrentUser && storedIsLoggedIn === 'true') {
                const currentUser = JSON.parse(storedCurrentUser);
                
                // Verify user exists in users database
                const storedUsers = localStorage.getItem('users');
                if (storedUsers) {
                    const users = JSON.parse(storedUsers);
                    const userExists = users.some(user => 
                        user.id === currentUser.id && 
                        user.username === currentUser.username &&
                        user.email === currentUser.email
                    );
                    
                    if (userExists) {
                        this.currentUser = currentUser;
                        // Restored logged in user from localStorage
                        return true;
                    }
                }
            }
        } catch (error) {
            console.error('❌ Error checking localStorage login status:', error);
        }
        
        // If we get here, user is not logged in
        // User is not logged in
        return false;
    }
    
    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }
    
    // USER-SPECIFIC DATA MANAGEMENT
    // Get user-specific storage key
    getUserStorageKey(key) {
        if (!this.currentUser) {
            console.warn('⚠️ No current user for storage key generation');
            return key;
        }
        return `user_${this.currentUser.id}_${key}`;
    }
    
    // Save user-specific data
    saveUserData(key, data) {
        if (!this.currentUser) {
            console.warn('⚠️ Cannot save data: No current user');
            return false;
        }
        
        try {
            const userKey = this.getUserStorageKey(key);
            localStorage.setItem(userKey, JSON.stringify(data));
            // Saved user data
            return true;
        } catch (error) {
            console.error(`❌ Error saving user data ${key}:`, error);
            return false;
        }
    }
    
    // Load user-specific data
    loadUserData(key, defaultValue = null) {
        if (!this.currentUser) {
            console.warn('⚠️ Cannot load data: No current user');
            return defaultValue;
        }
        
        try {
            const userKey = this.getUserStorageKey(key);
            const data = localStorage.getItem(userKey);
            if (data) {
                const parsed = JSON.parse(data);
                // Loaded user data
                return parsed;
            }
            return defaultValue;
        } catch (error) {
            console.error(`❌ Error loading user data ${key}:`, error);
            return defaultValue;
        }
    }
    
    // Clear user-specific data
    clearUserData(key) {
        if (!this.currentUser) {
            console.warn('⚠️ Cannot clear data: No current user');
            return false;
        }
        
        try {
            const userKey = this.getUserStorageKey(key);
            localStorage.removeItem(userKey);
            // Cleared user data
            return true;
        } catch (error) {
            console.error(`❌ Error clearing user data ${key}:`, error);
            return false;
        }
    }
    
    // Get all user-specific keys
    getUserDataKeys() {
        if (!this.currentUser) {
            return [];
        }
        
        const userPrefix = `user_${this.currentUser.id}_`;
        const keys = [];
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(userPrefix)) {
                keys.push(key.replace(userPrefix, ''));
            }
        }
        
        return keys;
    }
    
    // Clear all user-specific data
    clearAllUserData() {
        if (!this.currentUser) {
            console.warn('⚠️ Cannot clear data: No current user');
            return false;
        }
        
        try {
            const userPrefix = `user_${this.currentUser.id}_`;
            const keysToRemove = [];
            
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(userPrefix)) {
                    keysToRemove.push(key);
                }
            }
            
            keysToRemove.forEach(key => localStorage.removeItem(key));
            // Cleared all user data
            return true;
        } catch (error) {
            console.error('❌ Error clearing all user data:', error);
            return false;
        }
    }
    
    // Update user profile data
    updateUser(updatedUser) {
        if (!this.currentUser) {
            console.warn('⚠️ Cannot update user: No current user');
            return false;
        }
        
        try {
            // Find the user in the users array and update it
            const userIndex = this.users.findIndex(user => user.id === this.currentUser.id);
            if (userIndex !== -1) {
                this.users[userIndex] = { ...this.users[userIndex], ...updatedUser };
                
                // Save updated users array
                localStorage.setItem('users', JSON.stringify(this.users));
                
                // Update current user reference
                this.currentUser = this.users[userIndex];
                
                // Updated user profile
                return true;
            } else {
                console.error('❌ User not found in database');
                return false;
            }
        } catch (error) {
            console.error(`❌ Error updating user:`, error);
            return false;
        }
    }
    
    // Get all users (admin only)
    getAllUsers() {
        if (!this.currentUser || this.currentUser.role !== 'admin') {
            return { success: false, message: 'Unauthorized' };
        }
        
        return { 
            success: true, 
            users: this.users.map(user => ({
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt
            }))
        };
    }
    
    // Save users to localStorage
    saveUsers() {
        try {
            localStorage.setItem('users', JSON.stringify(this.users));
            // Users saved to localStorage
            
            // Verify save was successful
            const verification = localStorage.getItem('users');
            if (!verification) {
                console.error('❌ CRITICAL: Failed to save users to localStorage!');
            }
        } catch (error) {
            console.error('❌ Error saving users to localStorage:', error);
            alert('CRITICAL ERROR: Unable to save user data. Please check browser settings and ensure localStorage is enabled.');
        }
    }
    
    // Validate email format
    static validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // Validate password strength
    static validatePassword(password) {
        // At least 8 characters, one uppercase, one lowercase, one number
        const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        return re.test(password);
    }

    // Request password reset (generates OTP)
    requestPasswordReset(email) {
        // Reload users from localStorage
        try {
            const storedUsers = localStorage.getItem('users');
            if (storedUsers) {
                this.users = JSON.parse(storedUsers);
            }
        } catch (error) {
            console.error('Error reloading users:', error);
        }

        // Find user by email
        const user = this.users.find(u => u.email === email);
        
        if (!user) {
            return { success: false, message: 'No account found with this email address' };
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Store OTP in user object with expiration (5 minutes)
        user.resetOTP = otp;
        user.resetOTPExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes from now
        
        // Save updated users
        this.saveUsers();
        
        // Password reset OTP generated
        
        return { 
            success: true, 
            message: 'OTP generated successfully',
            otp: otp // In production, don't return OTP - send via email
        };
    }

    // Reset password with OTP
    resetPassword(email, otp, newPassword) {
        // Reload users from localStorage
        try {
            const storedUsers = localStorage.getItem('users');
            if (storedUsers) {
                this.users = JSON.parse(storedUsers);
            }
        } catch (error) {
            console.error('Error reloading users:', error);
        }

        // Find user by email
        const user = this.users.find(u => u.email === email);
        
        if (!user) {
            return { success: false, message: 'User not found' };
        }

        // Check if OTP exists
        if (!user.resetOTP) {
            return { success: false, message: 'No password reset request found. Please request a new OTP.' };
        }

        // Check if OTP has expired
        if (Date.now() > user.resetOTPExpiry) {
            // Clean up expired OTP
            delete user.resetOTP;
            delete user.resetOTPExpiry;
            this.saveUsers();
            return { success: false, message: 'OTP has expired. Please request a new one.' };
        }

        // Verify OTP
        if (user.resetOTP !== otp) {
            return { success: false, message: 'Invalid OTP. Please check and try again.' };
        }

        // Update password
        user.password = newPassword;
        
        // Clear OTP data
        delete user.resetOTP;
        delete user.resetOTPExpiry;
        
        // Save updated users
        this.saveUsers();
        
        // Password reset successful
        
        return { success: true, message: 'Password reset successful' };
    }
}

// Initialize user database
const userDB = new UserDatabase();

// Form validation functions
function validateLoginForm(emailOrUsername, password) {
    const errors = {};
    
    if (!emailOrUsername) {
        errors.email = 'Email or Username is required';
    }
    // Don't validate email format - accept both email and username
    
    if (!password) {
        errors.password = 'Password is required';
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}

function validateSignupForm(username, email, password, confirmPassword) {
    const errors = {};
    
    if (!username) {
        errors.username = 'Username is required';
    } else if (username.length < 3) {
        errors.username = 'Username must be at least 3 characters';
    }
    
    if (!email) {
        errors.email = 'Email is required';
    } else if (!UserDatabase.validateEmail(email)) {
        errors.email = 'Invalid email format';
    }
    
    if (!password) {
        errors.password = 'Password is required';
    } else if (!UserDatabase.validatePassword(password)) {
        errors.password = 'Password must be at least 8 characters with one uppercase letter and one number';
    }
    
    if (password !== confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}

// Authentication check function
function checkAuth() {
    // Ensure we have the latest user data
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
        userDB.users = JSON.parse(storedUsers);
    }
    
    // Check if user is logged in
    if (!userDB.isLoggedIn()) {
        // Redirect to landing page if not on allowed pages
        const currentPage = window.location.pathname.split('/').pop();
        if (currentPage !== 'landing.html' && currentPage !== 'login.html' && currentPage !== 'signup.html' && 
            currentPage !== 'terms.html' && currentPage !== 'privacy.html') {
            window.location.href = 'landing.html';
        }
    } else {
        // Redirect to home page if already logged in and on login or signup page
        // But allow users to stay on landing page to see features
        const currentPage = window.location.pathname.split('/').pop();
        if (currentPage === 'login.html' || currentPage === 'signup.html') {
            window.location.href = 'index.html';
        }
    }
}

// Run auth check on page load
document.addEventListener('DOMContentLoaded', checkAuth);
