import { OrderDTO } from "../payments/provider";

export interface TrackingEvent {
  status: string;
  activity: string;
  location: string;
  timestamp: string;
}

export interface ShippingProvider {
  name: string;
  checkServiceability(pin: string): Promise<{ serviceable: boolean; etaDays: number; cost: number }>;
  createShipment(order: OrderDTO): Promise<{ awb: string; labelUrl?: string; trackingUrl: string }>;
  getTracking(awb: string): Promise<TrackingEvent[]>;
}
