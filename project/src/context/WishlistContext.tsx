import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

export type WishlistItemType = 'tour' | 'beach' | 'nightlife' | 'temple' | 'church' | 'waterfall' | 'authentic' | 'culture' | 'hotel' | 'restaurant' | 'cafe' | 'club';

interface WishlistItem {
  id: string;
  type: WishlistItemType;
  data: any;
  addedAt: Date;
}

interface WishlistState {
  items: WishlistItem[];
  isLoading: boolean;
}

interface WishlistAction {
  type: 'SET_ITEMS' | 'ADD_ITEM' | 'REMOVE_ITEM' | 'SET_LOADING';
  payload?: any;
}

const WishlistContext = createContext<{
  state: WishlistState;
  addToWishlist: (item: any, type: WishlistItemType) => Promise<void>;
  removeFromWishlist: (id: string, type: WishlistItemType) => Promise<void>;
  isInWishlist: (id: string, type: WishlistItemType) => boolean;
  getWishlistByType: (type: WishlistItemType) => any[];
} | null>(null);

const wishlistReducer = (state: WishlistState, action: WishlistAction): WishlistState => {
  switch (action.type) {
    case 'SET_ITEMS':
      return {
        ...state,
        items: action.payload,
        isLoading: false
      };
    case 'ADD_ITEM':
      return {
        ...state,
        items: [...state.items, action.payload]
      };
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item =>
          !(item.data.id === action.payload.id && item.type === action.payload.type)
        )
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    default:
      return state;
  }
};

const API_BASE_URL = 'http://localhost:5000/api';

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { state: authState } = useAuth();
  const [state, dispatch] = useReducer(wishlistReducer, {
    items: [],
    isLoading: false
  });

  useEffect(() => {
    if (authState.isAuthenticated && authState.user) {
      loadWishlist();
    } else {
      // Load from localStorage for non-authenticated users
      const localWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      dispatch({ type: 'SET_ITEMS', payload: localWishlist });
    }
  }, [authState.isAuthenticated, authState.user]);

  const loadWishlist = async () => {
    if (!authState.user) return;

    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const token = localStorage.getItem('token');

      // Perform merge if we have local items just after logging in
      const localWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      if (localWishlist.length > 0) {
        // We have items to merge.
        // NOTE: Ideally we should use a batch API, but for now we iterate to reuse add logic
        // or just add them one by one via background promises.
        // We will simply try to add them to backend. If they exist, backend (should) ignore or update.
        // Since our addToWishlist handles auth check, we can use a helper or call API directly.
        // Let's call a sync API if we had one, or just loop. Loop is simpler for now.

        for (const item of localWishlist) {
          // We only want to add, not remove.
          await fetch(`${API_BASE_URL}/wishlist`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              itemId: item.data.id,
              itemType: item.type
            })
          }).catch(e => console.error("Sync error", e));
        }
        // Clear local storage after sync? 
        // Yes, to avoid re-syncing every reload. 
        // BUT, if user logs out, they might expect them back in empty state?
        // Standard behavior: merged items become part of account. Local state clears or matches account.
        // We'll clear the *anonymous* wishlist from local storage on successful sync.
        localStorage.removeItem('wishlist');
      }

      const res = await fetch(`${API_BASE_URL}/wishlist`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Failed to load wishlist');

      const data = await res.json();

      // Map API response to Context structure
      const wishlistItems = data.map((item: any) => ({
        id: `${item.item_type}-${item.item_id}`,
        type: item.item_type,
        data: {
          id: item.item_id,
          name: item.place_name || item.destination_name || item.tour_title || item.name || 'Unnamed Place',
          title: item.tour_title || item.place_name || item.destination_name || item.name || 'Unnamed',
          image: item.place_image || item.image_url || item.tour_image_url || item.destination_image_url || '',
          rating: item.place_rating || item.rating || 0,
          location: item.place_location || item.location || '',
          type: item.place_type || item.item_type || '',
          ...item
        },
        addedAt: new Date(item.created_at)
      }));

      dispatch({ type: 'SET_ITEMS', payload: wishlistItems });
    } catch (error) {
      console.error('Error loading wishlist:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const saveToLocalStorage = (items: WishlistItem[]) => {
    localStorage.setItem('wishlist', JSON.stringify(items));
  };

  const addToWishlist = async (item: any, type: WishlistItemType) => {
    const wishlistItem: WishlistItem = {
      id: `${type}-${item.id}`,
      type,
      data: item,
      addedAt: new Date()
    };

    if (authState.isAuthenticated && authState.user) {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE_URL}/wishlist`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            itemId: item.id,
            itemType: type,
            placeDetails: ['hotel', 'restaurant', 'cafe', 'club'].includes(type) ? {
              name: item.name,
              type: item.type,
              location: item.location,
              region: item.region,
              description: item.description,
              priceRange: item.priceRange,
              openingHours: item.openingHours,
              image: item.image,
              rating: item.rating,
              reviewCount: item.reviewCount,
              latitude: item.latitude,
              longitude: item.longitude
            } : undefined
          })
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || 'Failed to add');
        }

        dispatch({ type: 'ADD_ITEM', payload: wishlistItem });
        toast.success(`${item.title || item.name} added to wishlist!`);
      } catch (error: any) {
        toast.error(error.message || 'Failed to add to wishlist');
      }
    } else {
      // Save to localStorage for non-authenticated users
      dispatch({ type: 'ADD_ITEM', payload: wishlistItem });
      const newItems = [...state.items, wishlistItem];
      saveToLocalStorage(newItems);
      toast.success(`${item.title || item.name} added to wishlist!`);
    }
  };

  const removeFromWishlist = async (id: string, type: WishlistItemType) => {
    if (authState.isAuthenticated && authState.user) {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE_URL}/wishlist/${type}/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) throw new Error('Failed to remove');

        dispatch({ type: 'REMOVE_ITEM', payload: { id, type } });
        toast.success('Removed from wishlist!');
      } catch (error) {
        toast.error('Failed to remove from wishlist');
      }
    } else {
      // Remove from localStorage
      dispatch({ type: 'REMOVE_ITEM', payload: { id, type } });
      const newItems = state.items.filter(item =>
        !(item.data.id === id && item.type === type)
      );
      saveToLocalStorage(newItems);
      toast.success('Removed from wishlist!');
    }
  };

  const isInWishlist = (id: string, type: WishlistItemType) => {
    return state.items.some(item => String(item.data.id) === String(id) && item.type === type);
  };

  const getWishlistByType = (type: WishlistItemType) => {
    return state.items.filter(item => item.type === type).map(item => item.data);
  };

  return (
    <WishlistContext.Provider value={{
      state,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      getWishlistByType
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};