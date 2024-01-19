import { 
  EthAddress, 
  TokenMetadata, 
  Attribute, 
  DeployedContractLog, 
  Transaction, 
  TransactionArgs, 
  QrData,
  LoyaltyProgram, 
  LoyaltyToken
} from "@/types";
import { Url } from "url";
import { isBooleanObject } from "util/types";
import { Hex, Log, getAddress } from "viem";

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isValidUrl = (urlString: string) => {
  try { 
    return Boolean(new URL(urlString)); 
  }
  catch(e){ 
    return false; 
  }
}

const isNumber = (number: unknown): number is number => {
  return typeof number === 'number' || number instanceof Number;
};

const isBigInt = (number: unknown): number is BigInt => {
  return typeof number === 'bigint';
};

const isArray = (array: unknown): array is Array<unknown> => {
  // array.find(item => !isString(item)) 
  return array instanceof Array;
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
    throw new Error(`Incorrect description, not a string: ${description}`);
  }
  // here can additional checks later. 

  return description as string;
};

const parseTraitType = (description: unknown): string => {
  if (!isString(description)) {
    throw new Error(`Incorrect trait type, not a string: ${description}`);
  }
  // here can additional checks later. 

  return description as string;
};


const parseTraitValue = (traitValue: unknown): string | number => {
  if (!isString(traitValue) && !isNumber(traitValue)) {
    throw new Error(`Incorrect trait value, not a string or number or boolean: ${traitValue}`);
  }
  // here can additional checks later. 
  if (isString(traitValue)) return traitValue as string;
  return traitValue as number;
  
};

const parseHash = (hash: unknown): string => {
  if (!isString(hash)) {
    throw new Error(`Incorrect hash, not a string: ${hash}`);
  }
  // here can additional checks later. 

  return hash as string;
};

const parseNumber = (number: unknown): number => {
  if (!isNumber(number)) {
    throw new Error(`Incorrect number, not a number: ${number}`);
  }
  // here can additional checks later. 

  return number as number;
};

export const parseBigInt = (number: unknown): BigInt => {
  if (!isBigInt(number)) {
    throw new Error(`Incorrect number, not a number: ${number}`);
  }
  // here can additional checks later. 

  return number as BigInt;
};

const parseTokenised = (tokenised: unknown): BigInt[] => {
  if (!isArray(tokenised)) {
    throw new Error(`Incorrect data, not an array: ${tokenised}`);
  }

  tokenised.forEach(token => {
    if (!isBigInt(token)) {
      throw new Error(`Incorrect item at tokenised, not a bigint: ${token} at  ${tokenised}`);
    }
  })

  return tokenised as BigInt[];
};

const parseArgsAddRemoveLoyaltyToken = (args: unknown): {giftAddress: EthAddress, giftId: number}  => {
  if ( !args || typeof args !== 'object' ) {
    throw new Error('Incorrect or missing data at args');
  }

  if (
    'loyaltyGift' in args &&
    'loyaltyGiftId' in args 
    ) { 
    return ({ 
      giftAddress: parseEthAddress(args.loyaltyGift),
      giftId: Number(parseBigInt(args.loyaltyGiftId))  
    })
  }
  throw new Error(`Incorrect args format: ${args}`);
}

const parseArgsLoyaltyGift = (args: unknown): {issuer: EthAddress, tokenised: BigInt[]} => {
  if ( !args || typeof args !== 'object' ) {
    throw new Error('Incorrect or missing data at args');
  }

  if (
    'issuer' in args && 
    'tokenised' in args
    ) { 
    return ({
      issuer: parseEthAddress(args.issuer), 
      tokenised: parseTokenised(args.tokenised)
    })
  }
  throw new Error(`Incorrect args format: ${args}`);
}

const parseArgsTransferSingle = (args: unknown): TransactionArgs => {
  // console.log("parseArgsTransferSingle called ")
  if ( !args || typeof args !== 'object' ) {
    throw new Error('Incorrect or missing data at args');
  }

  if (
    'operator' in args &&
    'from' in args && 
    'to' in args && 
    'id' in args && 
    'value' in args
    ) { 
      // console.log(parseNumber(args.id))
    return ({
      operator: parseEthAddress(args.operator),
      from: parseEthAddress(args.from), 
      to: parseEthAddress(args.to),
      ids: [parseBigInt(args.id)],  
      values: [parseBigInt(args.value)],    
    })
  }
  throw new Error(`Incorrect args format: ${args}`);
}

const parseArgsTransferBatch = (args: unknown): TransactionArgs => {
  // console.log("parseArgsTransferSingle called ")
  if ( !args || typeof args !== 'object' ) {
    throw new Error('Incorrect or missing data at args');
  }

  if (
    'operator' in args &&
    'from' in args && 
    'to' in args && 
    'ids' in args && 
    'values' in args
    ) { 
      // console.log(parseNumber(args.id))
      if ( !isArray(args.ids) ) {
        throw new Error('args.ids is not an array');
      } 
      if ( !isArray(args.values) ) {
        throw new Error('args.values is not an array');
      } 

    return ({
      operator: parseEthAddress(args.operator),
      from: parseEthAddress(args.from), 
      to: parseEthAddress(args.to),
      ids: args.ids.map(id => parseBigInt(id)),  
      values: args.values.map(id => parseBigInt(id)),    
    })
  }
  throw new Error(`Incorrect args format: ${args}`);
}

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

  const returnAddress = getAddress(address) 

  return returnAddress as EthAddress;
};

export const parseSignature = (signature: unknown): Hex => {
  if (!isString(signature)) {
    throw new Error(`Incorrect signature, not a string: ${signature}`);
  }
  if (/0x/.test(signature) == false) {
    throw new Error(`Incorrect signature, 0x prefix missing: ${signature}`);
  }

  return signature as Hex;
};

 


export const parseContractLogs = (logs: Log[]): LoyaltyProgram[] => {
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
        ) { return ( {programAddress: parseEthAddress(log.address)} )
        }
        throw new Error('Incorrect data at LoyaltyProgram logs: some fields are missing or incorrect');
    })

    return parsedLogs as Array<LoyaltyProgram> 

  } catch {
    throw new Error('Incorrect data at LoyaltyProgram logs. Parser caught error');
  }

};


export const parseTokenContractLogs = (logs: Log[]): LoyaltyToken[] => {
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
        'blockHash' in log && 
        'args' in log
        ) { 
          const tokenIds = parseArgsLoyaltyGift(log.args).tokenised 
          console.log("tokenIds @parseTokenContractLogs" , tokenIds)
          const temp = tokenIds.map((tokenId, i) => ({
            tokenAddress: parseEthAddress(log.address), 
            issuer: parseArgsLoyaltyGift(log.args).issuer, 
            tokenId: i, 
            tokenised: tokenId
          }))
          return temp
        }
        throw new Error('Incorrect data at Token (gift) Contract logs: some fields are missing or incorrect');
    })

    return parsedLogs.flat() as LoyaltyToken[] 

  } catch {
    throw new Error('Incorrect data at Token (gift) Contract logs. Parser caught error');
  }

};


export const parseLoyaltyGiftLogs = (logs: Log[]): {giftAddress: EthAddress, giftId: number}[] => {
  if (!isArray(logs)) {
    throw new Error(`Incorrect logs, not an array: ${logs}`);
  }

  try { 
    const parsedLogs = logs.map((log: unknown) => {
      if ( !log || typeof log !== 'object' ) {
        throw new Error('Incorrect or missing data at log');
      }

      if ( 'args' in log ) {
        console.log("parseArgsAddRemoveLoyaltyToken(log.args): ",log.args)
        return parseArgsAddRemoveLoyaltyToken(log.args)
      } 
        throw new Error('Incorrect data at LoyaltyGift logs: some fields are missing or incorrect');
    })

    console.log("parsedLogs: ", parsedLogs)

    return parsedLogs as {giftAddress: EthAddress, giftId: number}[]

  } catch {
    throw new Error('Incorrect data at LoyaltyGift logs. Parser caught error');
  }
};

export const parseLoyaltyTokenLogs = (logs: Log[]): EthAddress[] => {
  if (!isArray(logs)) {
    throw new Error(`Incorrect logs, not an array: ${logs}`);
  }

  try { 
    const parsedLogs = logs.map((log: unknown) => {
      if ( !log || typeof log !== 'object' ) {
        throw new Error('Incorrect or missing data at log');
      }

      if ( 'address' in log ) {
        return ( parseEthAddress(log.address) ) 
      } 
        throw new Error('Incorrect data at LoyaltyProgram logs: some fields are missing or incorrect');
    })

    return parsedLogs as Array<EthAddress> 

  } catch {
    throw new Error('Incorrect data at LoyaltyProgram logs. Parser caught error');
  }
};


export const parseTransferSingleLogs = (logs: Log[]): Transaction[] => {
  if (!isArray(logs)) {
    throw new Error(`Incorrect transaction logs, not an array: ${logs}`);
  }

  try { 
    const parsedLogs = logs.map((log: unknown) => {
      if ( !log || typeof log !== 'object' ) {
        throw new Error('Incorrect or missing data at transaction log');
      }

      if ( 
        'args' in log && 
        'logIndex' in log && 
        'blockNumber' in log
        ) {
        // console.log('lala' , log.args )
        return ({
          blockNumber: parseBigInt(log.blockNumber),
          logIndex: parseNumber(log.logIndex),
          ...parseArgsTransferSingle(log.args) 
        }) 
      } 
        throw new Error('Incorrect data at transaction logs: some fields are missing or incorrect');
    })

    return parsedLogs as Array<Transaction> 

  } catch {
    throw new Error('Incorrect data at transaction logs. Parser caught error');
  }
};

export const parseTransferBatchLogs = (logs: Log[]): Transaction[] => {
  if (!isArray(logs)) {
    throw new Error(`Incorrect transaction logs, not an array: ${logs}`);
  }

  try { 
    const parsedLogs = logs.map((log: unknown) => {
      if ( !log || typeof log !== 'object' ) {
        throw new Error('Incorrect or missing data at transaction log');
      }

      if ( 
        'args' in log && 
        'logIndex' in log && 
        'blockNumber' in log
        ) {
        // console.log('lala' , log.args )
        return ({
          blockNumber: parseBigInt(log.blockNumber),
          logIndex: parseNumber(log.logIndex),
          ...parseArgsTransferBatch(log.args) 
        }) 
      } 
        throw new Error('Incorrect data at transaction logs: some fields are missing or incorrect');
    })

    return parsedLogs as Array<Transaction> 

  } catch {
    throw new Error('Incorrect data at transaction logs. Parser caught error');
  }
};



export const parseAttributes = (attributes: unknown): Attribute[]  => {
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

    return parsedAttributes as Attribute[] 

  } catch {
    throw new Error('Incorrect data at program Metadata: Parser caught error');
  }

};

export const parseUri = (uri: unknown): string => {
  if (!isString(uri)) {
    throw new Error(`Incorrect uri, not a string: ${uri}`);
  }
  
  if (!isValidUrl(uri)) {
    throw new Error(`Incorrect uri, not a uri: ${uri}`);
  }
  // here can additional checks later. 

  return uri as string;
};

export const parseMetadata = (metadata: unknown): TokenMetadata => {

  console.log("metadata @parseMetadata: ", metadata)

  if ( !metadata || typeof metadata !== 'object' ) {
    throw new Error('Incorrect or missing data');
  }

  if ( 
    'title' in metadata && 
    'description' in metadata &&     
    'image' in metadata &&
    'attributes' in metadata 
    ) { 
        return ({
          name: parseName(metadata.title),
          description: parseDescription(metadata.description),
          imageUri: parseUri(metadata.image),
          attributes: parseAttributes(metadata.attributes)
        })
       }
      
       throw new Error('Incorrect data at program Metadata: some fields are missing or incorrect');
};

export const parseQrData = (qrText: unknown): QrData => {
  console.log("parseQrData CALLED:", qrText)
  if ( !qrText || typeof qrText !== 'string' ) {
    throw new Error('Incorrect or missing data');
  }

  if ( 
    qrText.includes('type') &&
    qrText.includes(';')
      ) { 
        try {
          const data = qrText.split(";")
          // console.log("DATA: ", data)
          
          if (data[0].includes("giftPoints")) {
            return {
              type: "giftPoints",  
              loyaltyProgram: parseEthAddress(data[1].slice(3)), 
              loyaltyCardAddress: parseEthAddress(data[2].slice(3))
              } 
          }

          if (data[0].includes("claimGift")) {


            return {
              type: "claimGift",  
              loyaltyToken: parseEthAddress(data[1].slice(3)), 
              loyaltyTokenId: Number(data[2].slice(3)), 
              loyaltyCardAddress: parseEthAddress(data[3].slice(3)), 
              customerAddress: parseEthAddress(data[4].slice(3)), 
              loyaltyPoints: Number(data[5].slice(3)), 
              signature: parseSignature(data[6].slice(3))
              }
          } 

          if (data[0].includes("redeemToken")) {
            return {
              type: "redeemToken",  
              loyaltyProgram: parseEthAddress(data[1].slice(3)), 
              loyaltyCardAddress: parseEthAddress(data[2].slice(3)), 
              loyaltyToken: parseEthAddress(data[3].slice(3)), 
              loyaltyTokenId: Number(data[4].slice(3)), 
              signature: parseSignature(data[5].slice(3))
              }
          } 

          if (data[0].includes("requestCard")) {
            return {
              type: "requestCard",  
              loyaltyProgram: parseEthAddress(data[1].slice(3)), 
              customerAddress: parseEthAddress(data[2].slice(3)),
              } 
          } 
          
        } catch (error) {
          throw new Error(`parseQrData caught error: ${error}`);
        }

        throw new Error('Incorrect data at QrData: type not recognised');
       }
      
       throw new Error('Incorrect data at QrData: some fields are missing or incorrect');
};