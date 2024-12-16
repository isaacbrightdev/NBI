import { useState } from 'react';

const useCustomer = () => {
  const [customer] = useState(window.Customer);

  return customer;
};

export default useCustomer;
