export interface DashboardStats {
  totalProducts: number;
  lowStockProducts: number;
  totalSales: number;
  totalUsers: number;
}

export interface RecentOrder {
  id: string;
  trackingNo: string;
  productName: string;
  productImage: string;
  price: number;
  totalOrder: number;
  totalAmount: number;
  createdAt: Date;
}

export interface SalesData {
  date: string;
  amount: number;
}

export interface AnalyticsData {
  pending: number;
  completed: number;
  cancelled: number;
}

export interface TopProduct {
  id: string;
  name: string;
  image: string;
  price: number;
  totalSold: number;
  revenue: number;
}

export interface DateRange {
  startDate?: Date;
  endDate?: Date;
}


