import { 
  usePathname, 
  useRouter, 
  useSearchParams 
} from 'next/navigation';
import { getProgAddressFromUseSearchParams } from '../utils/getDataFromUseSearch';
import { EthAddress } from '@/types';

export function useUrlProgramAddress() {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { progAddress }  = getProgAddressFromUseSearchParams(params);

  const putProgAddressInUrl = (progAddress: EthAddress | null) => {
    console.log("putProgAddressInUrl called.")
    let newParams = new URLSearchParams(params.toString());
    if (progAddress) {
      newParams.set('prog', progAddress)
      router.push(`${pathname}?${newParams.toString()}`);
    } else {
      router.push(`${pathname}`);
    }
  };

  return { progAddress, putProgAddressInUrl };
}