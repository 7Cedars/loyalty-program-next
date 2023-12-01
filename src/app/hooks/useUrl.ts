"use client"

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

// export function useSpaces() {
//   const params = useSearchParams();
//   const pathname = usePathname();
//   const router = useRouter();
//   const selectedSpaces = getSpacesFromUseSearchParams(params); 
//   const spacesColours = selectedSpaces.map((space, i) => {
//     return ({
//       space: space,  
//       tailwindColour: tailwindColours[i], 
//       colourCode: colourCodes[i]
//     })
//   })

//   const addSpace = (spaceId: string) => {
//     let newParams = new URLSearchParams(params.toString());
//     newParams.append('s', spaceId)
//     router.push(`${pathname}?${newParams.toString()}`);
//   };

//   // because deleting single item is not supported yet: need to delete all, and then repopulate. 
//   const removeSpace = (spaceId: String) => {
//     let newParams = new URLSearchParams(params.toString());

//     const newSpaceParams = newParams.getAll('s');
//     const updatedSpaces = newSpaceParams.filter(item => item !== spaceId)

//     newParams.delete('s')
//     updatedSpaces.forEach(spaceId => newParams.append('s', spaceId))

//     router.push(`${pathname}?${newParams.toString()}`);
//   };

//   const loadSavedSearch = (spaceIds: string[], d1: string, d2: string) => {
//     let newParams = new URLSearchParams(params.toString());
    
//     newParams.delete('s')
//     newParams.set('d1', d1)
//     newParams.set('d2', d2)

//     spaceIds.forEach(spaceId => 
//       newParams.append('s', spaceId)
//     )
    
//     router.push(`${pathname}?${newParams.toString()}`);
//   };

//   return { selectedSpaces, spacesColours, addSpace, removeSpace, loadSavedSearch };
// }
