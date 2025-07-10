import { supabase } from './supabase';

class UserService {
  // Get all user profiles (for admin or public access)
  async getUserProfiles(filters = {}) {
    try {
      let query = supabase
        .from('user_profiles')
        .select(`
          *,
          driver_profiles (
            *,
            driver_vehicles (*)
          )
        `);

      // Apply filters
      if (filters?.role) {
        query = query.eq('role', filters.role);
      }
      
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.search) {
        query = query.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      
      return { success: false, error: 'Failed to load user profiles.' };
    }
  }

  // Get user by ID
  async getUserById(userId) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select(`
          *,
          driver_profiles (
            *,
            driver_vehicles (*)
          )
        `)
        .eq('id', userId)
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to load user.' };
    }
  }

  // Update user profile
  async updateUserProfile(userId, updates) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to update user profile.' };
    }
  }

  // Create driver profile
  async createDriverProfile(userId, driverData) {
    try {
      const { data, error } = await supabase
        .from('driver_profiles')
        .insert({
          user_id: userId,
          ...driverData
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      // Update user role to driver
      await this.updateUserProfile(userId, { role: 'driver' });

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to create driver profile.' };
    }
  }

  // Update driver profile
  async updateDriverProfile(userId, updates) {
    try {
      const { data, error } = await supabase
        .from('driver_profiles')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to update driver profile.' };
    }
  }

  // Add driver vehicle
  async addDriverVehicle(driverId, vehicleData) {
    try {
      const { data, error } = await supabase
        .from('driver_vehicles')
        .insert({
          driver_id: driverId,
          ...vehicleData
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to add vehicle.' };
    }
  }

  // Update driver vehicle
  async updateDriverVehicle(vehicleId, updates) {
    try {
      const { data, error } = await supabase
        .from('driver_vehicles')
        .update(updates)
        .eq('id', vehicleId)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to update vehicle.' };
    }
  }

  // Delete driver vehicle
  async deleteDriverVehicle(vehicleId) {
    try {
      const { error } = await supabase
        .from('driver_vehicles')
        .delete()
        .eq('id', vehicleId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to delete vehicle.' };
    }
  }

  // Update user location
  async updateUserLocation(userId, locationData) {
    try {
      const { data, error } = await supabase
        .from('user_locations')
        .upsert({
          user_id: userId,
          ...locationData,
          last_updated: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to update location.' };
    }
  }

  // Get nearby drivers
  async getNearbyDrivers(latitude, longitude, radius = 5) {
    try {
      const { data, error } = await supabase
        .rpc('get_nearby_drivers', {
          user_lat: latitude,
          user_lng: longitude,
          radius_km: radius
        });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to find nearby drivers.' };
    }
  }

  // Toggle driver online status
  async toggleDriverOnlineStatus(userId, isOnline) {
    try {
      // Update driver profile
      const driverResult = await this.updateDriverProfile(userId, { is_online: isOnline });
      
      if (!driverResult.success) {
        return driverResult;
      }

      // Update location status
      const { error: locationError } = await supabase
        .from('user_locations')
        .update({ is_online: isOnline })
        .eq('user_id', userId);

      if (locationError) {
        return { success: false, error: locationError.message };
      }

      return { success: true, data: { is_online: isOnline } };
    } catch (error) {
      return { success: false, error: 'Failed to update online status.' };
    }
  }

  // Real-time subscription for user profile updates
  subscribeToUserProfile(userId, callback) {
    return supabase
      .channel(`user_profile_${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_profiles',
          filter: `id=eq.${userId}`
        },
        callback
      )
      .subscribe();
  }

  // Real-time subscription for driver location updates
  subscribeToDriverLocations(callback) {
    return supabase
      .channel('driver_locations')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_locations',
          filter: 'user_type=eq.driver'
        },
        callback
      )
      .subscribe();
  }

  // Unsubscribe from real-time updates
  unsubscribe(subscription) {
    if (subscription) {
      supabase.removeChannel(subscription);
    }
  }
}

const userService = new UserService();
export default userService;