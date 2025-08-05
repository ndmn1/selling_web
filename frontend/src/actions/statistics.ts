import { db } from "@/lib/db";

// Dashboard Statistics Types
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

// Get Dashboard Statistics
export async function getDashboardStats(dateRange?: DateRange): Promise<DashboardStats> {
  try {
    const { startDate, endDate } = dateRange || {};
    
    // Build date filter for orders
    const orderDateFilter = startDate && endDate ? {
      createdAt: {
        gte: startDate,
        lte: endDate
      }
    } : {};

    const [totalProducts, lowStockProducts, orders, totalUsers] = await Promise.all([
      // Total products count (not date-dependent)
      db.product.count(),
      
      // Products with low stock (not date-dependent)
      db.product.count({
        where: {
          sizes: {
            some: {
              stock: {
                lt: 5
              }
            }
          }
        }
      }),
      
      // Total revenue from delivered orders within date range
      db.order.aggregate({
        where: {
          status: 'DELIVERED',
          ...orderDateFilter
        },
        _sum: {
          totalAmount: true
        },
        _count: true
      }),
      
      // Total users created within date range (if dates provided) or all users
      db.user.count({
        where: {
          role: 'USER',
          ...(startDate && endDate ? {
            createdAt: {
              gte: startDate,
              lte: endDate
            }
          } : {})
        }
      })
    ]);

    return {
      totalProducts,
      lowStockProducts,
      totalSales: Math.round((orders._sum.totalAmount || 0) / 1000000), // Convert to millions
      totalUsers
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      totalProducts: 0,
      lowStockProducts: 0,
      totalSales: 0,
      totalUsers: 0
    };
  }
}

// Get Recent Orders
export async function getRecentOrders(limit: number = 10, dateRange?: DateRange): Promise<RecentOrder[]> {
  try {
    const { startDate, endDate } = dateRange || {};
    
    // Build date filter
    const dateFilter = startDate && endDate ? {
      createdAt: {
        gte: startDate,
        lte: endDate
      }
    } : {};

    const orders = await db.order.findMany({
      where: dateFilter,
      include: {
        orderItems: {
          include: {
            product: {
              include: {
                brand: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    });

    return orders.map(order => {
      const firstItem = order.orderItems[0];
      return {
        id: order.id,
        trackingNo: `#${order.id.slice(-6).toUpperCase()}`,
        productName: firstItem?.product.name || 'Multiple Items',
        productImage: firstItem?.product.mainImage || '/placeholder.svg',
        price: firstItem?.price || 0,
        totalOrder: order.orderItems.reduce((sum, item) => sum + item.quantity, 0),
        totalAmount: order.totalAmount,
        createdAt: order.createdAt
      };
    });
  } catch (error) {
    console.error('Error fetching recent orders:', error);
    return [];
  }
}

// Get Sales Data for Chart
export async function getSalesData(dateRange?: DateRange): Promise<SalesData[]> {
  try {
    const { startDate, endDate } = dateRange || {};
    
    // Default to last 10 hours if no date range provided
    const defaultEndDate = endDate || new Date();
    const defaultStartDate = startDate || (() => {
      const date = new Date();
      date.setHours(date.getHours() - 10);
      return date;
    })();

    // Get orders within the date range
    const orders = await db.order.findMany({
      where: {
        createdAt: {
          gte: defaultStartDate,
          lte: defaultEndDate
        },
        status: {
          in: ['DELIVERED', 'PROCESSING', 'SHIPPING']
        }
      },
      select: {
        createdAt: true,
        totalAmount: true
      }
    });

    // If we have a specific date range (more than 1 day), group by days
    const daysDiff = Math.ceil((defaultEndDate.getTime() - defaultStartDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff > 1) {
      // Group by days
      const dailyData: { [key: string]: number } = {};
      
      // Initialize all days in range
      const currentDate = new Date(defaultStartDate);
      while (currentDate <= defaultEndDate) {
        const dayKey = currentDate.toLocaleDateString('en-GB', { 
          day: '2-digit', 
          month: '2-digit' 
        });
        dailyData[dayKey] = 0;
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Aggregate orders by day
      orders.forEach(order => {
        const dayKey = order.createdAt.toLocaleDateString('en-GB', { 
          day: '2-digit', 
          month: '2-digit' 
        });
        dailyData[dayKey] += order.totalAmount;
      });

      return Object.entries(dailyData).map(([date, amount]) => ({
        date,
        amount: Math.round(amount / 10000) // Convert to ten thousands for readability
      }));
    } else {
      // Group by hours (for same day or less than 24 hours)
      const hourlyData: SalesData[] = [];
      const hoursToShow = Math.min(10, Math.ceil((defaultEndDate.getTime() - defaultStartDate.getTime()) / (1000 * 60 * 60)));
      
      for (let i = hoursToShow - 1; i >= 0; i--) {
        const hour = new Date(defaultEndDate);
        hour.setHours(hour.getHours() - i);
        const hourLabel = hour.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        });

        // Find sales for this hour
        const hourSales = orders.filter(order => {
          const orderHour = order.createdAt.getHours();
          return orderHour === hour.getHours() && 
                 order.createdAt.toDateString() === hour.toDateString();
        });

        const totalAmount = hourSales.reduce((sum, order) => sum + order.totalAmount, 0);

        hourlyData.push({
          date: hourLabel,
          amount: Math.round(totalAmount / 10000) // Convert to ten thousands for readability
        });
      }

      return hourlyData;
    }
  } catch (error) {
    console.error('Error fetching sales data:', error);
    // Return mock data if there's an error
    const mockData: SalesData[] = [];
    for (let i = 9; i >= 0; i--) {
      const hour = new Date();
      hour.setHours(hour.getHours() - i);
      const hourLabel = hour.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
      mockData.push({
        date: hourLabel,
        amount: Math.floor(Math.random() * 80) + 20
      });
    }
    return mockData;
  }
}

// Get Analytics Data (Order Status Distribution)
export async function getAnalyticsData(dateRange?: DateRange): Promise<AnalyticsData> {
  try {
    const { startDate, endDate } = dateRange || {};
    
    // Build date filter
    const dateFilter = startDate && endDate ? {
      createdAt: {
        gte: startDate,
        lte: endDate
      }
    } : {};

    const [pending, completed, cancelled] = await Promise.all([
      db.order.count({
        where: {
          status: {
            in: ['PENDING', 'CONFIRMED', 'PROCESSING']
          },
          ...dateFilter
        }
      }),
      db.order.count({
        where: {
          status: {
            in: ['DELIVERED', 'SHIPPING']
          },
          ...dateFilter
        }
      }),
      db.order.count({
        where: {
          status: 'CANCELLED',
          ...dateFilter
        }
      })
    ]);

    return {
      pending,
      completed,
      cancelled
    };
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    return {
      pending: 0,
      completed: 0,
      cancelled: 0
    };
  }
}

// Get Top Selling Products
export async function getTopSellingProducts(limit: number = 5, dateRange?: DateRange): Promise<TopProduct[]> {
  try {
    const { startDate, endDate } = dateRange || {};
    
    // Build date filter for orders
    const orderDateFilter = startDate && endDate ? {
      order: {
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      }
    } : {};

    const topProducts = await db.orderItem.groupBy({
      by: ['productId'],
      where: orderDateFilter,
      _sum: {
        quantity: true,
        price: true
      },
      _count: true,
      orderBy: {
        _sum: {
          quantity: 'desc'
        }
      },
      take: limit
    });

    const productsWithDetails = await Promise.all(
      topProducts.map(async (item) => {
        const product = await db.product.findUnique({
          where: { id: item.productId },
          include: { brand: true }
        });

        return {
          id: item.productId,
          name: product?.name || 'Unknown Product',
          image: product?.mainImage || '/placeholder.svg',
          price: product?.price || 0,
          totalSold: item._sum.quantity || 0,
          revenue: item._sum.price || 0
        };
      })
    );

    return productsWithDetails;
  } catch (error) {
    console.error('Error fetching top selling products:', error);
    return [];
  }
}
