'use client';
import { fetchAccountProfile } from "@/store/actions/userActions";
import { useAppDispatch } from "@/store/hooks";
import { useSession } from "next-auth/react";
import { useState, useContext, createContext, useEffect } from "react";
 

 

// Create the context with a default value
const AppContext = createContext({
  cartDrawerOpen: false,
  modalOpen: false,
  loading: true,
  toggleLoading: () => {},
  toggleCartDrawer: () => {},
  toggleModal: () => {},
});



// Create a provider component
export const AppProvider = ({ children }: Readonly<{
  children: React.ReactNode;
}> ) => {
  const dispatch = useAppDispatch()
  const { data: session, status } = useSession()
  const id = session?.user?.id
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
   
  useEffect(() => {
    if (!id ) return undefined
    // dispatch(fetchAccountProfile(id))
  }, [dispatch, id ])
  
  const toggleLoading = () => {
    setCartDrawerOpen((prev) => {
      console.log("Cart Drawer toggled:", !prev);
      return !prev;
    });
  };

  // Toggle functions for better state management
  const toggleCartDrawer = () => {
    setCartDrawerOpen((prev) => {
      console.log("Cart Drawer toggled:", !prev);
      return !prev;
    });
  };

  const toggleModal = () => {
    setModalOpen((prev) => {
      console.log("Modal toggled:", !prev);
      return !prev;
    });
  };

  return (
    <AppContext.Provider value={{ cartDrawerOpen, modalOpen, loading, toggleLoading, toggleCartDrawer, toggleModal }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook for easy access
export const useAppContext = () => useContext(AppContext);
