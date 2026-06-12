export type VehicleStatus = 'disponible' | 'vendido' | 'reservado';
export type FuelType = 'gasolina' | 'diesel' | 'hibrido' | 'electrico' | 'gas';
export type TransmissionType = 'manual' | 'automatica' | 'cvt';

export interface VehicleImage {
  id: string;
  vehicle_id: string;
  storage_path: string;
  sort_order: number;
  created_at: string;
}

export interface Vehicle {
  id: string;
  slug: string;
  brand: string;
  model: string;
  year: number;
  price_cop: number;
  mileage_km: number;
  fuel_type: FuelType;
  transmission: TransmissionType;
  color: string;
  description: string;
  status: VehicleStatus;
  featured: boolean;
  created_at: string;
  updated_at: string;
  vehicle_images?: VehicleImage[];
}

export interface Lead {
  id: string;
  vehicle_id: string | null;
  name: string;
  phone: string;
  email: string;
  message: string;
  privacy_accepted: boolean;
  created_at: string;
}

type LeadInsert = {
  name: string;
  phone: string;
  email: string;
  message?: string;
  vehicle_id?: string | null;
  privacy_accepted: boolean;
  id?: string;
  created_at?: string;
};

export type Database = {
  public: {
    Tables: {
      vehicles: {
        Row: Vehicle;
        Insert: Omit<Vehicle, 'id' | 'created_at' | 'updated_at' | 'vehicle_images'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Vehicle>;
        Relationships: [];
      };
      vehicle_images: {
        Row: VehicleImage;
        Insert: Omit<VehicleImage, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<VehicleImage>;
        Relationships: [];
      };
      leads: {
        Row: Lead;
        Insert: LeadInsert;
        Update: Partial<Lead>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      vehicle_status: VehicleStatus;
      fuel_type: FuelType;
      transmission_type: TransmissionType;
    };
    CompositeTypes: Record<string, never>;
  };
};
