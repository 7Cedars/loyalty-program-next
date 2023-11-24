import { EthAddress } from "@/types";

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isNumber = (number: unknown): number is number => {
  return typeof number === 'number' || number instanceof Number;
};

const isArray = (array: unknown): array is Array<string> => {
  // array.find(item => !isString(item)) 
  return typeof array === 'string' || array instanceof Array;
};

const parseEthAddress = (address: unknown): `0x${string}` => {
  if (!isString(address)) {
    throw new Error(`Incorrect address, not a string: ${address}`);
  }
  if (/0x/.test(address) == false) {
    throw new Error(`Incorrect address, 0x prefix missing: ${address}`);
  }
  if (address.length != 42) {
    throw new Error(`Incorrect address length: ${address}`);
  }

  return address as `0x${string}`;
};

export const toEthAddress = (object: unknown): EthAddress => {
  if ( !object || typeof object !== 'object' ) {
        throw new Error('Incorrect or missing data');
      }
  if ('a' in object )  
    {
      const address: EthAddress = parseEthAddress(object.a); 
      return address
    };

  throw new Error('Incorrect data at address: some fields are missing');
}