import { OrderDTO } from "../payments/provider";
import { ShippingProvider, TrackingEvent } from "./provider";

export class ShiprocketShippingProvider implements ShippingProvider {
  name = "shiprocket";
  private email: string;
  private pass: string;
  private token: string | null = null;
  private tokenExpiry: number = 0;

  constructor() {
    this.email = process.env.SHIPROCKET_EMAIL || "";
    this.pass = process.env.SHIPROCKET_PASSWORD || "";
  }

  private async getAuthToken(): Promise<string> {
    if (this.token && Date.now() < this.tokenExpiry) {
      return this.token;
    }

    if (!this.email || !this.pass) {
      throw new Error("Shiprocket credentials are not configured in environment");
    }

    const res = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: this.email, password: this.pass }),
    });

    if (!res.ok) {
      throw new Error(`Shiprocket auth failed: ${await res.text()}`);
    }

    const data = await res.json();
    this.token = data.token;
    // Cache for 9 days (Shiprocket token is valid for 10 days)
    this.tokenExpiry = Date.now() + 9 * 24 * 60 * 60 * 1000;
    return this.token as string;
  }

  async checkServiceability(pin: string) {
    try {
      const token = await this.getAuthToken();
      const pickupPin = "560001"; // Bengaluru Atelier origin pin
      const res = await fetch(
        `https://apiv2.shiprocket.in/v1/external/courier/serviceability/?pickup_postcode=${pickupPin}&delivery_postcode=${pin}&weight=1.5&cod=0`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        return { serviceable: true, etaDays: 4, cost: 9900 };
      }

      const data = await res.json();
      const companies = data?.data?.available_courier_companies || [];
      const serviceable = companies.length > 0;
      const minEta = companies.length > 0 ? Number(companies[0].estimated_delivery_days) || 3 : 4;

      return {
        serviceable,
        etaDays: minEta,
        cost: 0,
      };
    } catch {
      return { serviceable: true, etaDays: 4, cost: 0 };
    }
  }

  async createShipment(order: OrderDTO) {
    const token = await this.getAuthToken();
    const address = (order.address || {}) as Record<string, string>;

    const res = await fetch(
      "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          order_id: order.number,
          order_date: new Date().toISOString().slice(0, 10),
          pickup_location: "Primary Atelier",
          billing_customer_name: order.customerName,
          billing_last_name: "",
          billing_address: address.addressLine1 || "Bengaluru",
          billing_city: address.city || "Bengaluru",
          billing_pincode: address.pincode || "560001",
          billing_state: address.state || "Karnataka",
          billing_country: "India",
          billing_email: order.customerEmail,
          billing_phone: order.customerPhone,
          shipping_is_billing: true,
          order_items: [
            {
              name: `Little Luxe Hamper ${order.number}`,
              sku: `LLH-${order.number}`,
              units: 1,
              selling_price: (order.totalPaise / 100).toFixed(2),
            },
          ],
          payment_method: "Prepaid",
          sub_total: (order.totalPaise / 100).toFixed(2),
          length: 25,
          breadth: 20,
          height: 12,
          weight: 1.2,
        }),
      }
    );

    if (!res.ok) {
      throw new Error(`Shiprocket order creation failed: ${await res.text()}`);
    }

    const data = await res.json();
    const awb = data.awb_code || `SR-${data.shipment_id || Date.now()}`;
    return {
      awb,
      trackingUrl: `https://shiprocket.co//tracking/${awb}`,
    };
  }

  async getTracking(awb: string): Promise<TrackingEvent[]> {
    try {
      const token = await this.getAuthToken();
      const res = await fetch(
        `https://apiv2.shiprocket.in/v1/external/courier/track/awb/${awb}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) return [];
      const data = await res.json();
      const scans = data?.tracking_data?.shipment_track_activities || [];
      return scans.map((s: { current_status: string; activity: string; location: string; date: string }) => ({
        status: s.current_status || "IN_TRANSIT",
        activity: s.activity || "Package in transit",
        location: s.location || "India Hub",
        timestamp: s.date || new Date().toISOString(),
      }));
    } catch {
      return [];
    }
  }
}
