import { Horizon } from 'stellar-sdk';

const TESTNET_HORIZON_URL = 'https://horizon-testnet.stellar.org';
const PUBLIC_HORIZON_URL = 'https://horizon.stellar.org';

export const getHorizonServer = (network: string = 'TESTNET') => {
  return new Horizon.Server(network === 'PUBLIC' ? PUBLIC_HORIZON_URL : TESTNET_HORIZON_URL);
};

export const fetchXLMBalance = async (address: string, network: string = 'TESTNET'): Promise<string> => {
  try {
    const server = getHorizonServer(network);
    const account = await server.loadAccount(address);
    const nativeBalance = account.balances.find((b) => b.asset_type === 'native');
    return nativeBalance ? nativeBalance.balance : '0.0000000';
  } catch (error) {
    console.error('Error fetching balance from Horizon:', error);
    // If account doesn't exist yet on testnet, return 0
    return '0.00';
  }
};
