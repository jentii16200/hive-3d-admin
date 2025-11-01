// src/hooks/useGetSpecificOrder.ts
import axios from "axios";
import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

const useGetSpecificOrders = (id: string) => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`${API_BASE}/orders/${id}`);
      setData(res.data.response);
    } catch (err) {
      console.error("Error fetching order:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    try {
      await axios.put(`${API_BASE}/orders/${id}/status`, {
        status: newStatus,
      });
      setData((prev: any) => ({
        ...prev,
        status: newStatus,
      }));
      return true;
    } catch (err) {
      console.error("Error updating status:", err);
      return false;
    }
  };

  useEffect(() => {
    if (id) fetchOrder();
  }, [id]);

  return { data, isLoading, updateStatus };
};

export default useGetSpecificOrders;
