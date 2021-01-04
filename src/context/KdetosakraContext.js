import React from 'react';

const KdetosakraContext = React.createContext({});

export const KdetosakraProvider = KdetosakraContext.Provider;
export const KdetosakraConsumer = KdetosakraContext.Consumer;
export default KdetosakraContext;
