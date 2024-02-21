// Example from: https://github.com/peterlidee/mocking-useRouter-useSearchParams-next-13 £acknowledgement

import { EthAddress } from "../../types" ;
import { parseEthAddress } from '../utils/parsers';
import { ReadonlyURLSearchParams } from 'next/navigation';

export function getProgAddressFromUseSearchParams(
  params: ReadonlyURLSearchParams
) {
  const progParam = params.get('prog');
  let address:EthAddress = '0x0000000000000000000000000000'
  if (params.has('prog') && progParam ) {
    address = parseEthAddress(progParam);
  }
  return {
    progAddress: address,
  };
}
