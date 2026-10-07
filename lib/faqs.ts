export interface FaqItem {
  question: string;
  answer: string;
}

export const defaultFaqs: FaqItem[] = [
  {
    question: "How long does delivery take across India?",
    answer:
      "Deliveries to metro cities (Delhi-NCR, Mumbai, Bengaluru, Hyderabad, Chennai, Pune) typically take 1 to 3 business days. Non-metro Tier-1 & Tier-2 cities take 3 to 5 business days. You can check the exact estimated arrival date by entering your 6-digit PIN on any product page.",
  },
  {
    question: "Can I choose a specific target delivery date?",
    answer:
      "Yes! On every product page and during checkout, you can select your preferred delivery date. We schedule dispatch so the hamper arrives as close to that date as possible.",
  },
  {
    question: "Can I add a personalized handwritten message?",
    answer:
      "Every Little Luxe Hamper includes a complimentary calligraphy gold foil note card sealed with wax. You can type your personalized message (up to 250 characters) during checkout.",
  },
  {
    question: "Are prices inclusive of all taxes (GST)?",
    answer:
      "Yes, all prices displayed across our boutique are 100% inclusive of all applicable GST. If you require a B2B GST tax invoice for corporate claims, simply check the GST option and input your company GSTIN during checkout.",
  },
  {
    question: "What payment options do you support?",
    answer:
      "We accept all major Indian payment methods: UPI (Google Pay, PhonePe, Paytm, BHIM), Credit/Debit Cards (Visa, Mastercard, RuPay, Amex), Netbanking, and Cash on Delivery (COD) for eligible pincodes.",
  },
  {
    question: "How are fragile items protected during transit?",
    answer:
      "We use rigid 1200 GSM bespoke keepsake boxes surrounded by shock-absorbing outer corrugated mailers, custom die-cut foam inserts, and moisture-sealed inner linings to guarantee zero breakage.",
  },
];
