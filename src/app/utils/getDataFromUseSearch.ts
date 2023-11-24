// Example from: https://github.com/peterlidee/mocking-useRouter-useSearchParams-next-13

import { EthAddress } from "../../types" ;
import { toEthAddress } from '../utils/parsers';
import { ReadonlyURLSearchParams } from 'next/navigation';

export function getProgAddressFromUseSearchParams(
  params: ReadonlyURLSearchParams
) {
  const progParam = params.get('prog');
  let address:EthAddress = '0x0000000000000000000000000000'
  if (params.has('prog') && progParam ) {
    address = toEthAddress(progParam);
  }
  return {
    progAddress: progParam,
  };
}
