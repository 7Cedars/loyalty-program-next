"use client"

import { 
  usePathname, 
  useRouter, 
  useSearchParams 
} from 'next/navigation';
import { 
  getDateRangeFromUseSearchParams,
  getSpacesFromUseSearchParams
} from '../utils/getDataFromUseSearch';
import { 
  tailwindColours, 
  colourCodes 
} from '../../../constants';

export function useDateRange() {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { d1, d2 }  = getDateRangeFromUseSearchParams(params);

  const handleDates = (d1: string, d2: string) => {
    // console.log("handleDates called.")
    let newParams = new URLSearchParams(params.toString());
    newParams.set('d1', d1)
    newParams.set('d2', d2)
    router.push(`${pathname}?${newParams.toString()}`);
  };

  return { d1, d2, handleDates };
}

export function useSpaces() {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const selectedSpaces = getSpacesFromUseSearchParams(params); 
  const spacesColours = selectedSpaces.map((space, i) => {
    return ({
      space: space,  
      tailwindColour: tailwindColours[i], 
      colourCode: colourCodes[i]
    })
  })

  const addSpace = (spaceId: string) => {
    let newParams = new URLSearchParams(params.toString());
    newParams.append('s', spaceId)
    router.push(`${pathname}?${newParams.toString()}`);
  };

  // because deleting single item is not supported yet: need to delete all, and then repopulate. 
  const removeSpace = (spaceId: String) => {
    let newParams = new URLSearchParams(params.toString());

    const newSpaceParams = newParams.getAll('s');
    const updatedSpaces = newSpaceParams.filter(item => item !== spaceId)

    newParams.delete('s')
    updatedSpaces.forEach(spaceId => newParams.append('s', spaceId))

    router.push(`${pathname}?${newParams.toString()}`);
  };

  const loadSavedSearch = (spaceIds: string[], d1: string, d2: string) => {
    let newParams = new URLSearchParams(params.toString());
    
    newParams.delete('s')
    newParams.set('d1', d1)
    newParams.set('d2', d2)

    spaceIds.forEach(spaceId => 
      newParams.append('s', spaceId)
    )
    
    router.push(`${pathname}?${newParams.toString()}`);
  };

  return { selectedSpaces, spacesColours, addSpace, removeSpace, loadSavedSearch };
}
