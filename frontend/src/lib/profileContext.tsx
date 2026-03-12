import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import api from "./api"; // assuming frontend/src/lib/api.ts exists or we can create one, wait let's use fetch with auth token
// Wait, actually the app already has api.ts or we can use standard fetch with token from localStorage.
// Let's use standard fetch wrapper if there isn't one, but let's check lib/api first.

export interface MyProfile {
  id?: string;
  name: string;
  role: string;
  company: string;
  business: {
    category: string;
    phone: string;
    email: string;
    website: string;
    address: string;
    description: string;
  };
  personal: {
    city: string;
    phone: string;
    email: string;
    dob: string;
  };
  social: {
    linkedin: string;
    twitter: string;
    instagram: string;
    whatsapp: string;
  };
}

const defaultProfile: MyProfile = {
  name: "",
  role: "",
  company: "",
  business: {
    category: "",
    phone: "",
    email: "",
    website: "",
    address: "",
    description: "",
  },
  personal: {
    city: "",
    phone: "",
    email: "",
    dob: "",
  },
  social: {
    linkedin: "",
    twitter: "",
    instagram: "",
    whatsapp: "",
  },
};

interface ProfileContextType {
  profile: MyProfile;
  updateProfile: (profile: MyProfile) => Promise<void>;
  loading: boolean;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<MyProfile>(defaultProfile);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const res = await fetch('http://localhost:5000/api/users/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data) {
            const user = data.data;
            // Map backend user to MyProfile
            setProfile({
              id: user.id,
              name: `${user.firstName} ${user.lastName}`.trim(),
              role: user.role || "",
              company: user.company?.name || "",
              business: {
                category: user.category || "",
                phone: user.metadata?.businessPhone || "",
                email: user.email || "",
                website: user.website || "",
                address: user.metadata?.businessAddress || "",
                description: user.headline || "",
              },
              personal: {
                city: user.city || "",
                phone: user.metadata?.personalPhone || "",
                email: user.email || "",
                dob: user.metadata?.dob || "",
              },
              social: {
                linkedin: user.metadata?.linkedin || "",
                twitter: user.metadata?.twitter || "",
                instagram: user.metadata?.instagram || "",
                whatsapp: user.metadata?.whatsapp || "",
              }
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const updateProfile = async (newProfile: MyProfile) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const [firstName, ...lastNameParts] = newProfile.name.split(' ');
      const lastName = lastNameParts.join(' ');

      const res = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName,
          lastName,
          headline: newProfile.business.description,
          city: newProfile.personal.city,
          category: newProfile.business.category,
          website: newProfile.business.website,
          metadata: {
            businessPhone: newProfile.business.phone,
            businessAddress: newProfile.business.address,
            personalPhone: newProfile.personal.phone,
            dob: newProfile.personal.dob,
            linkedin: newProfile.social.linkedin,
            twitter: newProfile.social.twitter,
            instagram: newProfile.social.instagram,
            whatsapp: newProfile.social.whatsapp,
          }
        })
      });

      if (res.ok) {
        setProfile(newProfile);
      }
    } catch (error) {
      console.error("Failed to update profile", error);
    }
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, loading }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useMyProfile = () => {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useMyProfile must be used within ProfileProvider");
  return ctx;
};
