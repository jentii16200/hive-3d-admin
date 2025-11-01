import axios from "axios";
import { useEffect, useState } from "react";

const useGetOrders = (page = 1, limit = 10) => {
  const [data, setData] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/orders?page=${page}&limit=${limit}`
        );
        setData(res.data.response.orders);
        setPagination(res.data.response.pagination);
        console.log(res);
      } catch (err: any) {
        setError(err.message || "Error fetching orders");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [page, limit]);

  return { data, pagination, isLoading, error };
};

export default useGetOrders;
