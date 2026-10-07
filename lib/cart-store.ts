import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartAddOn {
  id: string;
  name: string;
  pricePaise: number;
}

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  pricePaise: number;
  mrpPaise: number;
  imageUrl: string;
  qty: number;
  addOns: CartAddOn[];
}

interface CartStore {
  items: CartItem[];
  couponCode: string;
  giftMessage: string;
  deliveryDate: string;
  isMiniCartOpen: boolean;

  addItem: (
    product: {
      productId: string;
      slug: string;
      name: string;
      pricePaise: number;
      mrpPaise: number;
      imageUrl: string;
    },
    qty?: number,
    addOns?: CartAddOn[]
  ) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  setCouponCode: (code: string) => void;
  setGiftMessage: (message: string) => void;
  setDeliveryDate: (date: string) => void;
  setMiniCartOpen: (open: boolean) => void;
  getItemCount: () => number;
  getSubtotalPaise: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: "",
      giftMessage: "",
      deliveryDate: "",
      isMiniCartOpen: false,

      addItem: (product, qty = 1, addOns = []) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.productId === product.productId
          );

          if (existingIndex > -1) {
            const updatedItems = [...state.items];
            const currentItem = updatedItems[existingIndex];
            updatedItems[existingIndex] = {
              ...currentItem,
              qty: currentItem.qty + qty,
              addOns: addOns.length > 0 ? addOns : currentItem.addOns,
            };
            return { items: updatedItems, isMiniCartOpen: true };
          }

          return {
            items: [
              ...state.items,
              {
                ...product,
                qty,
                addOns,
              },
            ],
            isMiniCartOpen: true,
          };
        });
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }));
      },

      updateQty: (productId: string, qty: number) => {
        if (qty <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId ? { ...item, qty } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [], couponCode: "", giftMessage: "", deliveryDate: "" });
      },

      setCouponCode: (couponCode: string) => set({ couponCode }),
      setGiftMessage: (giftMessage: string) => set({ giftMessage }),
      setDeliveryDate: (deliveryDate: string) => set({ deliveryDate }),
      setMiniCartOpen: (isMiniCartOpen: boolean) => set({ isMiniCartOpen }),

      getItemCount: () => {
        return get().items.reduce((acc, item) => acc + item.qty, 0);
      },

      getSubtotalPaise: () => {
        return get().items.reduce((acc, item) => {
          const itemBase = item.pricePaise * item.qty;
          const addOnsBase = item.addOns.reduce(
            (sum, addOn) => sum + addOn.pricePaise * item.qty,
            0
          );
          return acc + itemBase + addOnsBase;
        }, 0);
      },
    }),
    {
      name: "little_luxe_cart_v1",
      partialize: (state) => ({
        items: state.items,
        couponCode: state.couponCode,
        giftMessage: state.giftMessage,
        deliveryDate: state.deliveryDate,
      }),
    }
  )
);
