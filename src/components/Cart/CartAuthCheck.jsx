import { useCart } from '@shopify/hydrogen-react';
import { useEffect } from 'react';
import useCustomer from '@/hooks/useCustomer';
import useSessionStorage from '@/hooks/useSessionStorage';

const CartAuthCheckComponent = () => {
  const customer = useCustomer();
  const { lines, linesRemove } = useCart();
  const [customerIsAuthenticated, setCustomerIsAuthenticated] =
    useSessionStorage('customerIsAuthenticated', false);

  useEffect(() => {
    if (customer) {
      if (!customerIsAuthenticated) {
        setCustomerIsAuthenticated(customer.email);
        return;
      }
    } else {
      if (customerIsAuthenticated !== false) {
        const linesLength = lines.length;
        if (linesLength) {
          const items = lines.map((line) => line.id);
          linesRemove(items);
          setCustomerIsAuthenticated(false);
        }
      }
    }
  }, [customer, lines]);

  return null;
};

export default CartAuthCheckComponent;
