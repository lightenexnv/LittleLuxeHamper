import { db } from "../db";
import { OrderDTO } from "../payments/provider";
import { ShippingProvider, TrackingEvent } from "./provider";

export class MockShippingProvider implements ShippingProvider {
  name = "mock";

  async checkServiceability(pin: string) {
    // Check in database first
    const record = await db.pincode.findUnique({
      where: { pin: pin.trim() },
    });

    if (record) {
      return {
        serviceable: record.serviceable,
        etaDays: record.etaDays,
        cost: record.serviceable ? 0 : 0,
      };
    }

    // Default fallback: valid 6 digit pin is assumed serviceable with 4-5 days ETA
    const isValid = /^[1-9][0-9]{5}$/.test(pin.trim());
    return {
      serviceable: isValid,
      etaDays: isValid ? 4 : 0,
      cost: 0,
    };
  }

  async createShipment(order: OrderDTO) {
    const awb = `LLH-AWB-${order.number}-${Math.floor(1000 + Math.random() * 9000)}`;
    const trackingUrl = `/track-order?orderId=${encodeURIComponent(order.number)}`;

    return {
      awb,
      labelUrl: `/api/orders/${order.id}/label`,
      trackingUrl,
    };
  }

  async getTracking(awb: string): Promise<TrackingEvent[]> {
    const now = new Date();
    const d1 = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    const d2 = new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString();
    const d3 = now.toISOString();

    return [
      {
        status: "MANIFESTED",
        activity: "Shipment manifested and picked up from Little Luxe Atelier",
        location: "Bengaluru, Karnataka",
        timestamp: d1,
      },
      {
        status: "IN_TRANSIT",
        activity: "Consignment processed at regional courier hub",
        location: "Bengaluru Logistics Hub",
        timestamp: d2,
      },
      {
        status: "OUT_FOR_DELIVERY",
        activity: "Out for delivery with courier delivery executive",
        location: "Destination City Delivery Hub",
        timestamp: d3,
      },
    ];
  }
}
