interface EthereumProvider {
    isMetaMask?: boolean;
    request?: (...args: any[]) => Promise<any>;
    on?: (...args: any[]) => void;
}

interface Window {
    ethereum?: EthereumProvider;
}