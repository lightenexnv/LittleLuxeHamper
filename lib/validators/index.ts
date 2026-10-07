import { z } from "zod";

export const CartPriceSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().min(1),
      qty: z.number().int().min(1).max(50),
      addOnIds: z.array(z.string()).optional(),
    })
  ),
  couponCode: z.string().optional(),
  isCod: z.boolean().optional(),
});

export const CheckoutSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerEmail: z.string().email("Please enter a valid email address"),
  customerPhone: z
    .string()
    .regex(/^(?:\+91|91)?[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number"),
  addressLine1: z.string().min(5, "Address line 1 must be at least 5 characters"),
  addressLine2: z.string().optional(),
  landmark: z.string().optional(),
  pincode: z.string().regex(/^[1-9][0-9]{5}$/, "Please enter a valid 6-digit Indian PIN code"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  recipientName: z.string().optional(),
  recipientPhone: z
    .string()
    .regex(/^(?:\+91|91)?[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number")
    .optional()
    .or(z.literal("")),
  deliveryDate: z.string().optional(),
  giftMessage: z.string().max(250, "Gift message cannot exceed 250 characters").optional(),
  gstin: z.string().max(15).optional(),
  paymentMethod: z.enum(["UPI", "CARD", "NETBANKING", "COD"]),
  couponCode: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.string(),
        qty: z.number().int().min(1),
        addOnIds: z.array(z.string()).optional(),
      })
    )
    .min(1, "Cart cannot be empty"),
});

export const AdminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const ProductSchema = z.object({
  name: z.string().min(3),
  slug: z.string().min(3),
  shortDesc: z.string().min(10),
  description: z.string().min(20),
  pricePaise: z.number().int().positive(),
  mrpPaise: z.number().int().positive(),
  sku: z.string().min(3),
  stock: z.number().int().min(0),
  isCustomizable: z.boolean().default(false),
  isActive: z.boolean().default(true),
  isSample: z.boolean().default(true),
  contents: z.array(z.string()),
  tags: z.string(),
  collectionIds: z.array(z.string()).optional(),
  seoTitle: z.string().optional(),
  seoDesc: z.string().optional(),
  images: z
    .array(
      z.object({
        url: z.string(),
        alt: z.string(),
        sort: z.number().default(0),
      })
    )
    .optional(),
});

export const ReelSchema = z.object({
  productId: z.string().optional().nullable(),
  instagramUrl: z.string().url(),
  posterUrl: z.string().min(1),
  videoUrl: z.string().optional().nullable(),
  caption: z.string().min(3),
  sort: z.number().int().default(0),
  showOnHome: z.boolean().default(false),
});

export const CouponSchema = z.object({
  code: z.string().min(3).toUpperCase(),
  type: z.enum(["PERCENT", "FLAT"]),
  value: z.number().int().positive(),
  minOrder: z.number().int().default(0),
  expiresAt: z.string().optional().nullable(),
  usageLimit: z.number().int().optional().nullable(),
  isActive: z.boolean().default(true),
});

export const EnquirySchema = z.object({
  type: z.enum(["contact", "corporate"]),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  company: z.string().optional(),
  quantity: z.number().int().positive().optional(),
  message: z.string().min(5),
});

export const ReviewSchema = z.object({
  productId: z.string(),
  name: z.string().min(2),
  rating: z.number().int().min(1).max(5),
  body: z.string().min(5),
  photoUrl: z.string().optional(),
});
