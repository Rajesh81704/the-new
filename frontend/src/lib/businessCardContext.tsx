import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface BusinessCard {
  id: string;
  template: "modern" | "classic";
  name: string;
  role: string;
  company: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  description: string;
  imageUrl: string;
  linkedin: string;
  twitter: string;
  instagram: string;
  whatsapp: string;
}

interface BusinessCardContextType {
  cards: BusinessCard[];
  addCard: (card: Omit<BusinessCard, "id">) => Promise<void>;
  updateCard: (card: BusinessCard) => Promise<void>;
  deleteCard: (id: string) => Promise<void>;
  getCard: (id: string) => BusinessCard | undefined;
  loading: boolean;
}

const BusinessCardContext = createContext<BusinessCardContextType | undefined>(undefined);

export const BusinessCardProvider = ({ children }: { children: ReactNode }) => {
  const [cards, setCards] = useState<BusinessCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const res = await fetch('http://localhost:5000/api/users/business-cards', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data) {
            setCards(data.data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch business cards", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  const addCard = async (card: Omit<BusinessCard, "id">) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await fetch('http://localhost:5000/api/users/business-cards', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(card)
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          setCards((prev) => [data.data, ...prev]);
        }
      }
    } catch (error) {
      console.error("Failed to create business card", error);
    }
  };

  const updateCard = async (card: BusinessCard) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await fetch(`http://localhost:5000/api/users/business-cards/${card.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(card)
      });

      if (res.ok) {
        setCards((prev) => prev.map((c) => (c.id === card.id ? card : c)));
      }
    } catch (error) {
      console.error("Failed to update business card", error);
    }
  };

  const deleteCard = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await fetch(`http://localhost:5000/api/users/business-cards/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        setCards((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete business card", error);
    }
  };

  const getCard = (id: string) => cards.find((c) => c.id === id);

  return (
    <BusinessCardContext.Provider value={{ cards, addCard, updateCard, deleteCard, getCard, loading }}>
      {children}
    </BusinessCardContext.Provider>
  );
};

export const useBusinessCards = () => {
  const ctx = useContext(BusinessCardContext);
  if (!ctx) throw new Error("useBusinessCards must be used within BusinessCardProvider");
  return ctx;
};
