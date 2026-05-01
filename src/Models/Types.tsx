import * as Enums from './Enums'

export type Vendor = {
    id: string;
    name: string;
    contactInformation?: ContactInformation;
    vendorType?: Enums.VendorType;
    totalCost?: number;
    website?: string;
    payments: PaymentDeadline[];
}

export type ContactInformation = {
  phone?: string;
  email?: string;
  address?: string;
}

export type PaymentDeadline = {
  deadline: Date;
  amount: number;
  isPaid: boolean;
  title?: string;
  note?: string;
}

export type Guest = {
  id: string;
  firstName: string;
  lastName?: string;
  contactInformation?: ContactInformation;
  status?: Enums.GuestStatus;
  additionalGuests?: number;
  foodOrder?: string;
  note?: string;
}

export type Task = {
  id: string;
  title: string;
  isCompleted: boolean;
  description?: string;
  deadline?: Date;
  relatedVendorType?: Enums.VendorType;
}

export type Wedding = {
  id: string;
  title: string;
  usersName?: string;
  partnersName?: string;
  date?: string;
}