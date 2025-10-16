"use client";

import { useState, useEffect } from 'react';
import { getUserProfile, getUserRoles } from '@/lib/api';
import { UserProfile, UserRole } from '@/types';

export function useAdminCheck() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      // Try to load user profile first
      const profile = await getUserProfile();
      setUserProfile(profile);
      
      // Then try to load roles
      try {
        const roles = await getUserRoles();
        
        // Check if user has admin role
        const hasAdminRole = roles.some((role: UserRole) => 
          role.user === profile.id && role.role === 'admin'
        );
        
        setIsAdmin(hasAdminRole);
      } catch (rolesError) {
        console.warn('Failed to load user roles (roles endpoint may not be implemented yet):', rolesError);
        
        // Temporary fallback: Check if user email contains admin indicators
        // This is just for testing until the roles endpoint is implemented
        const isTemporaryAdmin = profile.email?.toLowerCase().includes('admin') || 
                                profile.email?.toLowerCase().includes('riyas.f@techbrein.com');
        
        if (isTemporaryAdmin) {
          console.log('Using temporary admin check based on email');
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      }
      
    } catch (profileError) {
      console.error('Failed to load user profile:', profileError);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  return { isAdmin, loading, userProfile };
}
