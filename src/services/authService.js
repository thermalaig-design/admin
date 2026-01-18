import supabase from './supabaseClient';

// Helper function to hash password (in production, use proper hashing)
const hashPassword = (password) => {
  // This is a simple hash function for demonstration
  // In production, use bcrypt or similar library
  return btoa(password); // Base64 encoding (not secure for production!)
};

// Helper function to verify password
const verifyPassword = (password, hashedPassword) => {
  return hashPassword(password) === hashedPassword;
};

// For this example, we'll use the raw password comparison
// In production, always use proper password hashing!

// Authentication functions
export const authService = {
  // Login with username and password
  async login(username, password) {
    try {
      if (!username || !password) {
        throw new Error('Username and password are required');
      }

      // First, try to find the user by username
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();

      if (userError) {
        if (userError.code === 'PGRST116') {
          // No rows returned
          throw new Error('Invalid username or password');
        }
        if (userError.code === 'PGRST205' || userError.code === '42P01') {
          // Table doesn't exist
          throw new Error('Authentication system not initialized. Please contact administrator.');
        }
        console.error('User lookup error:', userError);
        throw new Error('Invalid username or password');
      }

      if (!user) {
        throw new Error('Invalid username or password');
      }

      // Check if user is active
      if (user.is_active === false) {
        throw new Error('Account is inactive. Please contact administrator.');
      }

      // Verify password - handle both hashed and plain text passwords for backward compatibility
      let passwordMatch = false;
      if (user.password) {
        // Try to verify with hashed password
        passwordMatch = verifyPassword(password, user.password);
        // If hashed password doesn't match, try direct comparison (for existing plain text passwords)
        if (!passwordMatch) {
          passwordMatch = (password === user.password);
        }
      }

      if (!passwordMatch) {
        throw new Error('Invalid username or password');
      }

      // Update last_login timestamp
      const { error: updateError } = await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', user.id);

      if (updateError) {
        console.warn('Failed to update last_login:', updateError);
        // Don't fail login if last_login update fails
      }

      // Store user session
      const userSession = {
        id: user.id,
        username: user.username,
        role: user.role || 'user',
        email: user.email,
        createdAt: user.created_at,
        isAuthenticated: true
      };

      // Store in localStorage
      localStorage.setItem('user_session', JSON.stringify(userSession));

      return {
        success: true,
        user: userSession,
        message: 'Login successful'
      };
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Login failed');
    }
  },

  // Sign up a new user
  async signup(username, password, email) {
    try {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('username', username)
        .single();

      if (existingUser) {
        throw new Error('Username already exists');
      }

      // Insert new user
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert([{
          username,
          password: hashPassword(password), // Hash the password before storing
          email,
          role: 'user',
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (insertError) {
        throw new Error(insertError.message);
      }

      // Store user session
      const userSession = {
        id: newUser.id,
        username: newUser.username,
        role: newUser.role || 'user',
        email: newUser.email,
        createdAt: newUser.created_at,
        isAuthenticated: true
      };

      localStorage.setItem('user_session', JSON.stringify(userSession));

      return {
        success: true,
        user: userSession,
        message: 'Account created successfully'
      };
    } catch (error) {
      console.error('Signup error:', error);
      throw new Error(error.message || 'Signup failed');
    }
  },

  // Forgot password - update password directly with username and new password (stores plain text)
  async forgotPassword(username, newPassword) {
    try {
      // Find user by username
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id, username, is_active')
        .eq('username', username)
        .single();

      if (userError) {
        if (userError.code === 'PGRST116') {
          throw new Error('Invalid username');
        }
        throw new Error(userError.message || 'Invalid username');
      }

      if (!user) {
        throw new Error('Invalid username');
      }

      if (user.is_active === false) {
        throw new Error('Account is inactive. Please contact administrator.');
      }

      // Store plain text password directly (as requested)
      const { data: updatedUser, error: updateError } = await supabase
        .from('users')
        .update({ 
          password: newPassword
        })
        .eq('id', user.id)
        .select('id, username, updated_at');

      if (updateError) {
        console.error('Password update error:', updateError);
        throw new Error(updateError.message || 'Failed to update password');
      }

      if (!updatedUser || updatedUser.length === 0) {
        throw new Error('Password update failed. User not found.');
      }

      console.log('Password updated successfully for user:', username);

      return {
        success: true,
        message: 'Password updated successfully'
      };
    } catch (error) {
      console.error('Forgot password error:', error);
      throw new Error(error.message || 'Password update failed');
    }
  },

  // Reset password with token
  async resetPassword() {
    try {
      // In a real implementation, you would:
      // 1. Validate the reset token
      // 2. Update the user's password
      // 3. Invalidate the reset token

      // For this example, we'll throw an error since we don't have a real token system
      throw new Error('Password reset with token not implemented in this example');
    } catch (error) {
      console.error('Reset password error:', error);
      throw new Error(error.message || 'Password reset failed');
    }
  },

  // Logout user
  logout() {
    localStorage.removeItem('user_session');
    return { success: true, message: 'Logged out successfully' };
  },

  // Get current user session
  getCurrentUser() {
    try {
      const session = localStorage.getItem('user_session');
      if (session) {
        const parsed = JSON.parse(session);
        // Verify that the session has required properties and is valid
        if (parsed && typeof parsed === 'object' && 'isAuthenticated' in parsed) {
          // Less strict validation - just ensure basic properties exist when authenticated
          if (parsed.isAuthenticated === true) {
            // Only validate critical fields
            if (!parsed.id && !parsed.username) {
              // If both critical identifiers are missing, session is invalid
              console.log('Session missing critical identifiers, clearing...');
              localStorage.removeItem('user_session');
              return null;
            }
          }
          return parsed;
        }
      }
    } catch (error) {
      console.error('Error parsing user session:', error);
      // If there's an error parsing, clear the invalid session
      localStorage.removeItem('user_session');
    }
    return null;
  },

  // Check if user is authenticated
  isAuthenticated() {
    // Just check localStorage, don't make Supabase calls
    const user = this.getCurrentUser();
    // console.log('Auth check - user:', user); // Debug log - commented out for production
    return user && user.isAuthenticated === true;
  },

  // Update user profile
  async updateUser(userId, updates) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      // Update local session
      const currentUser = this.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        const updatedUser = { ...currentUser, ...updates };
        localStorage.setItem('user_session', JSON.stringify(updatedUser));
      }

      return { success: true, user: data };
    } catch (error) {
      console.error('Update user error:', error);
      throw new Error(error.message || 'Failed to update user');
    }
  },

  // Create users table if it doesn't exist
  async initializeAuthTable() {
    try {
      // Check if table exists by trying to select from it
      const { error } = await supabase
        .from('users')
        .select('id')
        .limit(1);

      if (error && (error.code === '42P01' || error.code === 'PGRST205')) {
        // Table doesn't exist, we need to create it via SQL
        console.log('Users table does not exist. Please create it in Supabase.');
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error checking users table:', error);
      return false;
    }
  }
};