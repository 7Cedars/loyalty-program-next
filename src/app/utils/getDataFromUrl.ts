// Example from: https://github.com/peterlidee/mocking-useRouter-useSearchParams-next-13

import { EthAddress, SearchParams } from "../../types" ;
import { parseEthAddress } from '../utils/parsers';

export function getProgAddressFromUrlParams(
  searchParams: SearchParams
): {progAddress: EthAddress} { 
  const addressParam = searchParams.prog;
  let progAddress:EthAddress = '0x0000000000000000000000000000'
  if ('prog' in searchParams && addressParam) {
    progAddress = parseEthAddress(String(addressParam));
  }
  return{
    progAddress: progAddress
  };
}
