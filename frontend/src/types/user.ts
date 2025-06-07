export interface Address {
  id: string;
  title: string;
  phoneNumber: string;
  address: string;
  ward?: string | null;
  district?: string | null;
  province: string;
  isDefault: boolean;
}
