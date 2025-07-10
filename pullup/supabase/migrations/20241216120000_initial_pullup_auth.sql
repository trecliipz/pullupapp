-- Location: supabase/migrations/20241216120000_initial_pullup_auth.sql
-- PullUp Authentication and User Management System

-- 1. Create custom types
CREATE TYPE public.user_role AS ENUM ('admin', 'rider', 'driver');
CREATE TYPE public.user_status AS ENUM ('active', 'inactive', 'suspended', 'pending_verification');
CREATE TYPE public.vehicle_type AS ENUM ('economy', 'comfort', 'premium', 'xl', 'luxury');

-- 2. Core user profiles table (intermediary for auth.users)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    date_of_birth DATE,
    role public.user_role DEFAULT 'rider'::public.user_role,
    status public.user_status DEFAULT 'active'::public.user_status,
    is_phone_verified BOOLEAN DEFAULT false,
    is_email_verified BOOLEAN DEFAULT false,
    rating DECIMAL(3,2) DEFAULT 5.0,
    total_rides INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Driver specific information
CREATE TABLE public.driver_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    license_number TEXT NOT NULL UNIQUE,
    license_expiry DATE NOT NULL,
    background_check_status TEXT DEFAULT 'pending',
    background_check_date TIMESTAMPTZ,
    is_online BOOLEAN DEFAULT false,
    earnings_total DECIMAL(10,2) DEFAULT 0.00,
    earnings_today DECIMAL(10,2) DEFAULT 0.00,
    trips_completed INTEGER DEFAULT 0,
    acceptance_rate DECIMAL(5,2) DEFAULT 100.00,
    cancellation_rate DECIMAL(5,2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Vehicle information for drivers
CREATE TABLE public.driver_vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    driver_id UUID REFERENCES public.driver_profiles(id) ON DELETE CASCADE,
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER NOT NULL,
    color TEXT NOT NULL,
    license_plate TEXT NOT NULL UNIQUE,
    vehicle_type public.vehicle_type DEFAULT 'economy'::public.vehicle_type,
    seats INTEGER DEFAULT 4,
    is_active BOOLEAN DEFAULT true,
    insurance_policy TEXT,
    insurance_expiry DATE,
    registration_expiry DATE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. User locations for real-time tracking
CREATE TABLE public.user_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    heading DECIMAL(5,2),
    accuracy DECIMAL(8,2),
    speed DECIMAL(8,2),
    user_type public.user_role NOT NULL,
    is_online BOOLEAN DEFAULT false,
    last_updated TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. Essential indexes
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_user_profiles_status ON public.user_profiles(status);
CREATE INDEX idx_driver_profiles_user_id ON public.driver_profiles(user_id);
CREATE INDEX idx_driver_profiles_online ON public.driver_profiles(is_online);
CREATE INDEX idx_driver_vehicles_driver_id ON public.driver_vehicles(driver_id);
CREATE INDEX idx_driver_vehicles_active ON public.driver_vehicles(is_active);
CREATE INDEX idx_user_locations_user_id ON public.user_locations(user_id);
CREATE INDEX idx_user_locations_coordinates ON public.user_locations(latitude, longitude);
CREATE INDEX idx_user_locations_online ON public.user_locations(is_online);

-- 7. Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.driver_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.driver_vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_locations ENABLE ROW LEVEL SECURITY;

-- 8. Helper functions for RLS policies
CREATE OR REPLACE FUNCTION public.is_profile_owner(profile_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT profile_user_id = auth.uid()
$$;

CREATE OR REPLACE FUNCTION public.is_driver_owner(driver_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.driver_profiles dp
    WHERE dp.user_id = driver_user_id AND dp.user_id = auth.uid()
)
$$;

CREATE OR REPLACE FUNCTION public.has_role(required_role TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role::TEXT = required_role
)
$$;

-- 9. RLS Policies
-- User profiles: users can manage their own profile
CREATE POLICY "users_manage_own_profile"
ON public.user_profiles
FOR ALL
TO authenticated
USING (public.is_profile_owner(id))
WITH CHECK (public.is_profile_owner(id));

-- Public read access for basic user info (for ride matching)
CREATE POLICY "public_read_basic_profile"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (true);

-- Driver profiles: drivers manage their own profile
CREATE POLICY "drivers_manage_own_profile"
ON public.driver_profiles
FOR ALL
TO authenticated
USING (public.is_driver_owner(user_id))
WITH CHECK (public.is_driver_owner(user_id));

-- Driver vehicles: drivers manage their own vehicles
CREATE POLICY "drivers_manage_own_vehicles"
ON public.driver_vehicles
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.driver_profiles dp
        WHERE dp.id = driver_id AND dp.user_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.driver_profiles dp
        WHERE dp.id = driver_id AND dp.user_id = auth.uid()
    )
);

-- User locations: users manage their own location
CREATE POLICY "users_manage_own_location"
ON public.user_locations
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Public read for online driver locations (for ride matching)
CREATE POLICY "public_read_online_driver_locations"
ON public.user_locations
FOR SELECT
TO authenticated
USING (user_type = 'driver' AND is_online = true);

-- 10. Functions for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'rider')::public.user_role
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 11. Function to update timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$;

-- Create triggers for updated_at
CREATE TRIGGER handle_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_driver_profiles_updated_at
    BEFORE UPDATE ON public.driver_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_driver_vehicles_updated_at
    BEFORE UPDATE ON public.driver_vehicles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 12. Mock data for testing
DO $$
DECLARE
    rider_auth_id UUID := gen_random_uuid();
    driver_auth_id UUID := gen_random_uuid();
    admin_auth_id UUID := gen_random_uuid();
    driver_profile_id UUID := gen_random_uuid();
BEGIN
    -- Create auth users with complete field structure
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (rider_auth_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'john.rider@example.com', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "John Rider", "role": "rider"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, '+1234567890', '', '', null),
        (driver_auth_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'mike.driver@example.com', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Mike Driver", "role": "driver"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, '+1987654321', '', '', null),
        (admin_auth_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@pullup.com', crypt('admin123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "PullUp Admin", "role": "admin"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, '+1555000000', '', '', null);

    -- Create driver profile
    INSERT INTO public.driver_profiles (id, user_id, license_number, license_expiry, background_check_status, is_online, earnings_total, trips_completed)
    VALUES (driver_profile_id, driver_auth_id, 'DL123456789', '2025-12-31', 'approved', true, 2450.75, 156);

    -- Create driver vehicle
    INSERT INTO public.driver_vehicles (driver_id, make, model, year, color, license_plate, vehicle_type, seats)
    VALUES (driver_profile_id, 'Toyota', 'Camry', 2022, 'Silver', 'ABC-1234', 'comfort'::public.vehicle_type, 4);

    -- Create user locations
    INSERT INTO public.user_locations (user_id, latitude, longitude, user_type, is_online)
    VALUES 
        (rider_auth_id, 40.7128, -74.0060, 'rider'::public.user_role, false),
        (driver_auth_id, 40.7138, -74.0070, 'driver'::public.user_role, true);

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error: %', SQLERRM;
END $$;

-- 13. Cleanup function for testing
CREATE OR REPLACE FUNCTION public.cleanup_test_data()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    auth_user_ids_to_delete UUID[];
BEGIN
    -- Get test auth user IDs
    SELECT ARRAY_AGG(id) INTO auth_user_ids_to_delete
    FROM auth.users
    WHERE email LIKE '%@example.com' OR email = 'admin@pullup.com';

    -- Delete in dependency order
    DELETE FROM public.user_locations WHERE user_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.driver_vehicles WHERE driver_id IN (
        SELECT id FROM public.driver_profiles WHERE user_id = ANY(auth_user_ids_to_delete)
    );
    DELETE FROM public.driver_profiles WHERE user_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.user_profiles WHERE id = ANY(auth_user_ids_to_delete);
    DELETE FROM auth.users WHERE id = ANY(auth_user_ids_to_delete);

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key constraint prevents deletion: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Cleanup failed: %', SQLERRM;
END;
$$;