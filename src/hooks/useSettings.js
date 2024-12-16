import { createContext, useContext } from 'react';

export const SettingsContext = createContext({});

const useSettings = () => {
  return useContext(SettingsContext);
};

export default useSettings;
