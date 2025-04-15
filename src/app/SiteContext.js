import { useContext, createContext } from 'react';

const SiteContext = createContext();

export const SiteProvider = SiteContext.Provider;
export const SiteConsumer = SiteContext.Consumer;

export const useSiteValue = () => useContext(SiteContext);

export default SiteContext;
