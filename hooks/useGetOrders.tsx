// src/hooks/useGetOrders.ts
import axios from "axios";
import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

const useGetOrders = (
  page: number,
  limit: number,
  refreshKey: number,
  search?: string
) => {
  const [data, setData] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${API_BASE}/orders`, {
        params: { page, limit, search },
      });
      const response = res.data.response;

      setData(response.orders || []);
      setPagination(response.pagination || null);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, limit, refreshKey, search]); // ✅ Trigger on page change too

  return { data, pagination, isLoading };
};

export default useGetOrders;
