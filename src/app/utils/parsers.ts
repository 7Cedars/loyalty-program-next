import { 
  EthAddress, 
  TokenMetadata, 
  Attribute, 
  DeployedContractLog
} from "@/types";
import { Log } from "viem";

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

const parseName = (name: unknown): string => {
  if (!isString(name)) {
    throw new Error(`Incorrect name, not a string: ${name}`);
  }
  // here can additional checks later. 

  return name as string;
};

const parseDescription = (description: unknown): string => {
  if (!isString(description)) {
    throw new Error(`Incorrect uri, not a string: ${description}`);
  }
  // here can additional checks later. 

  return description as string;
};

const parseTraitType = (description: unknown): string => {
  if (!isString(description)) {
    throw new Error(`Incorrect uri, not a string: ${description}`);
  }
  // here can additional checks later. 

  return description as string;
};


const parseTraitValue = (traitValue: unknown): string => {
  if (!isString(traitValue) && !isNumber(traitValue)) {
    throw new Error(`Incorrect trait value, not a string or number: ${traitValue}`);
  }
  // here can additional checks later. 

  return traitValue as string;
};

const parseHash = (hash: unknown): string => {
  if (!isString(hash)) {
    throw new Error(`Incorrect hash, not a string: ${hash}`);
  }
  // here can additional checks later. 

  return hash as string;
};

export const parseEthAddress = (address: unknown): EthAddress => {
  if (!isString(address)) {
    throw new Error(`Incorrect address, not a string: ${address}`);
  }
  if (/0x/.test(address) == false) {
    throw new Error(`Incorrect address, 0x prefix missing: ${address}`);
  }
  if (address.length != 42) {
    throw new Error(`Incorrect address length: ${address}`);
  }

  return address as EthAddress;
};

export const parseContractLogs = (logs: Log[]): DeployedContractLog[] => {
  if (!isArray(logs)) {
    throw new Error(`Incorrect logs, not an array: ${logs}`);
  }

  try { 
    const parsedLogs = logs.map((log: unknown) => {
      if ( !log || typeof log !== 'object' ) {
        throw new Error('Incorrect or missing data at log');
      }

      if (
        'address' in log &&
        'blockHash' in log
        ) { return ({
            address: parseTraitType(log.address),
            blockHash: parseHash(log.blockHash)
          })
        }
        throw new Error('Incorrect data at LoyaltyProgram logs: some fields are missing or incorrect');
    })

    return parsedLogs as Array<DeployedContractLog> 

  } catch {
    throw new Error('Incorrect data at LoyaltyProgram logs. Parser caught error');
  }

};


export const parseAttributes = (attributes: unknown): Array<Attribute>  => {
  if (!isArray(attributes)) {
    throw new Error(`Incorrect attributes, not an array: ${attributes}`);
  }

  try { 
    const parsedAttributes = attributes.map((attribute: unknown) => {
      if ( !attribute || typeof attribute !== 'object' ) {
        throw new Error('Incorrect or missing data at attribute');
      }

      if (
        'trait_type' in attribute &&
        'value' in attribute
        ) { return ({
            trait_type: parseTraitType(attribute.trait_type),
            value: parseTraitValue(attribute.value)
          })
        }
        throw new Error('Incorrect data at prgram Metadata: some fields are missing or incorrect');
    })

    return parsedAttributes as Array<Attribute> 

  } catch {
    throw new Error('Incorrect data at program Metadata: Parser caught error');
  }

};

export const parseUri = (uri: unknown): string => {
  if (!isString(uri)) {
    throw new Error(`Incorrect uri, not a string: ${uri}`);
  }
  // here can additional checks later. 

  return uri as string;
};

export const parseMetadata = (metadata: unknown): TokenMetadata => {
  if ( !metadata || typeof metadata !== 'object' ) {
    throw new Error('Incorrect or missing data');
  }

  if ( 
    'name'  in metadata  &&
    'description' in metadata &&     
    'attributes' in metadata && 
    'image' in metadata 
      ) { 
        return ({
          name: parseName(metadata.name),
          description: parseDescription(metadata.description),
          attributes: parseAttributes(metadata.attributes),
          imageUri: parseUri(metadata.image),
        })

        
       }
      
       throw new Error('Incorrect data at program Metadata: some fields are missing or incorrect');
};