// ALL examples from other app. 
/////////////////////////////

// import { error } from "console";

// const isString = (text: unknown): text is string => {
//   return typeof text === 'string' || text instanceof String;
// };

// const isNumber = (number: unknown): number is number => {
//   return typeof number === 'number' || number instanceof Number;
// };

// const isArray = (array: unknown): array is Array<string> => {
//   // array.find(item => !isString(item)) 
//   return typeof array === 'string' || array instanceof Array;
// };

// const parseId = (id: unknown): string => {
//   if (!isString(id)) {
//     throw new Error(`Incorrect or missing id: ${id}`);
//   }
//   return id;
// };

// const parseVotesCount = (votesCount: unknown): number => {
//   if (!isNumber(votesCount)) {
//     throw new Error(`Incorrect or missing id: ${votesCount}`);
//   }
//   return votesCount;
// };

// const parseCategories = (categories: unknown): Array<string> => {
//   if (!isArray(categories)) {
//     throw new Error(`Incorrect or missing categories: ${categories}`);
//   }
//   return [] as Array<string>;
// };

// export const toSpaceEntry = (object: unknown): Space => { 
//   if ( !object || typeof object !== 'object' ) {
//     throw new Error('Incorrect or missing data');
//   }

//   if ('id' in object && 
//       'votesCount' in object && 
//       'categories' in object
//       )  
//   {
//     const entry: Space = {
//       id: parseId(object.id),
//       votesCount: parseVotesCount(object.votesCount),
//       categories: parseCategories(object.categories), 
//     };

//     return entry;  
//   } 
//   throw new Error('Incorrect data: some fields are missing');
// }; 

// export const toSpaceId = (object: unknown): string => { 
//   if ( !object || typeof object !== 'object' ) {
//     throw new Error('Incorrect or missing data');
//   }

//   if ('id' in object && isString(object.id)) {
//    const spaceId: string = object.id
//    return spaceId
//   }

//   if ('__ref' in object && isString(object.__ref)) {
//     const spaceId: string = object.__ref.replace("Space:", "") 
//     return spaceId
//    }

//   throw new Error('Incorrect data: some fields are missing');
// }

// export const toProposalId = (object: unknown): string => { 
//   if ( !object || typeof object !== 'object' ) {
//     throw new Error('Incorrect or missing data');
//   }

//   if ('id' in object && isString(object.id)) {
//    const proposalId: string = object.id
//    return proposalId
//   }

//   if ('__ref' in object && isString(object.__ref)) {
//     const proposalId: string = object.__ref.replace("Proposal:", "") 
//     return proposalId
//    }

//   throw new Error('Incorrect data: some fields are missing');
// }

// // this parser still needs to be developed further. 
// export const toSavedSearch = (object: unknown): SavedSearch[] => { 
//   if (!isString(object)) {
//     throw new Error(`Incorrect or missing savedSearch: ${object}`);
//   }

//   try {
//     const data: SavedSearch[] = JSON.parse(object)
//     return data

//   } catch (error) {
//     throw new Error(`something went wrong with parsing jason data. Error message: ${error} `);
//   }

// }

// export const parseDateRange = (dateRange: string[]): [StartDate, EndDate] => {
//   if (dateRange.find(date => !isString(date))) {
//     throw new Error(`Incorrect or missing dataUrl at dateRange: ${dateRange}`);
//   }

//   const dateRangeNumber = dateRange.map(date => parseInt(date))
//   const [StartDate, EndDate] = [Math.min(...dateRangeNumber), Math.max(...dateRangeNumber),] //.split(';')

//   return [StartDate, EndDate]; 
// }

// export const parseDate = (date: string): number => {
//   if (!isString(date)) {
//     throw new Error(`Incorrect or missing dataUrl at dateRange: ${date}`);
//   }

//   return parseInt(date); 
// }

// export const parseTimeStamp = (timeStamp: number): number => {
//   if (!isNumber(timeStamp)) {
//     throw new Error(`Incorrect or missing dataUrl at dateRange: ${timeStamp}`);
//   }

//   return timeStamp; 
// }


// export const parseSelectedSpaces = (spaces: string[]): SelectedSpaces => {
//   if (spaces.find(space => !isString(space))) {
//     throw new Error(`Incorrect or missing dataUrl at selectedSpaces: ${spaces}`);
//   }

//   const selectedSpaces = spaces //.split(';')
//   // TODO
//   // Here should be checked against ids of spacelist. 
//   // But should not be created everysingle time... 
//   // should save this list in redux store at startup. 

//   return selectedSpaces; 
// }

// export const toProposals = (object: unknown): Proposal[]  => {
//   if ( !object || typeof object !== 'object' ) {
//     throw new Error('Incorrect or missing data');
//   }

//   if ('proposals' in object ) {
//     if (!isArray(object.proposals)) {
//       throw new Error(`Incorrect data: not an array: ${object.proposals}`);
//     }

//     if (object.proposals.length === 0) { return [] } 
    
//     const proposals = object.proposals.map((item: any): Proposal  => {
//         if ( 
//           'id'  in item  &&
//           'start' in item &&     
//           'end' in item && 
//           'space' in item &&
//           'votes' in item 
//             ) { return ({
//                 id: parseId(item.id),
//                 start: parseTimeStamp(item.start),
//                 end: parseTimeStamp(item.end),
//                 space: {id: toSpaceId(item.space)},
//                 votes: parseVotesCount(item.votes),
//               })
//              }
//             throw new Error(`Incorrect data: some fields or categories in Proposal: ${item}`);
//       })
//       return proposals;
//   } 
//   throw new Error('Incorrect data: malformed fields');
// }

// export const toVotes = (object: unknown): Vote[] => {
//   if ( !object || typeof object !== 'object' ) {
//     throw new Error('Incorrect or missing data');
//   }

//   if ('votes' in object ) {
//     if (!isArray(object.votes)) {
//       throw new Error(`Incorrect data: not an array: ${object.votes}`);
//     }

//     if (object.votes.length === 0) { return [] }  
//     else {
//       const votes = object.votes.map((item: any): Vote => {
//           if ( 
//             'voter'  in item  &&
//             'created' in item &&     
//             'proposal' in item
//               ) { return ({
//                   voter: parseId(item.voter),
//                   created: parseTimeStamp(item.created),
//                   proposal: {id: toProposalId(item.proposal)},
//                 })
//               }
//               throw new Error(`Incorrect data: some fields or categories in Vote: ${item}`);
//         })
//         return votes;
//       }
//   } 
//   throw new Error('Incorrect data: malformed fields');
// }
  
// export default { toSpaceEntry }; 