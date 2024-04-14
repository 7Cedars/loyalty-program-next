import { 
  EthAddress, 
  Metadata, 
  Attribute, 
  DeployedContractLog, 
  Transaction, 
  TransactionArgs, 
  QrData,
  LoyaltyProgram, 
  LoyaltyGift
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

export const parseHash = (hash: unknown): string => {
  if (!isString(hash)) {
    throw new Error(`Incorrect hash, not a string: ${hash}`);
  }
  // here can additional checks later. 

  return hash as string;
};

export const parseNumber = (number: unknown): number => {
  if (!isNumber(number)) {
    throw new Error(`Incorrect number, not a number: ${number}`);
  }
  // here can additional checks later. 

  return number as number;
};

export const parseBigInt = (number: unknown): bigint => {
  if (!isBigInt(number) || isNumber(number) ) {
    throw new Error(`Incorrect number, not a bigInt or number: ${number}`);
  }
  // here can additional checks later. 

  return number as bigint;
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

export const parseBalances = (balancesBigInt: unknown): number[] => {
  if (!isArray(balancesBigInt)) {
    throw new Error(`Incorrect data, not an array: ${balancesBigInt}`);
  }

  balancesBigInt.forEach(balance => {
    if (!isBigInt(balance)) {
      throw new Error(`Incorrect item at tokenised, not a bigint: ${balance} at  ${balance}`);
    }
  })

  const balances = balancesBigInt.map(balance => Number(balance)) 
  return balances as number[];
};

const parseArgsAddRemoveLoyaltyGift = (args: unknown): {giftAddress: EthAddress, giftId: number}  => {
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

const parseArgsLoyaltyGift = (args: unknown): {issuer: EthAddress, isVoucher: BigInt[]} => {
  if ( !args || typeof args !== 'object' ) {
    throw new Error('Incorrect or missing data at args');
  }

  if (
    'issuer' in args && 
    'isVoucher' in args
    ) { 
    return ({
      issuer: parseEthAddress(args.issuer), 
      isVoucher: parseTokenised(args.isVoucher)
    })
  }
  throw new Error(`Incorrect args format: ${args}`);
}

const parseArgsTransferSingle = (args: unknown): TransactionArgs => {
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

export const parseHex = (hex: unknown): Hex => {
  if (!isString(hex)) {
    throw new Error(`Incorrect address, not a string: ${hex}`);
  }
  if (/0x/.test(hex) == false) {
    throw new Error(`Incorrect address, 0x prefix missing: ${hex}`);
  }

  return hex as Hex;
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


export const parseTokenContractLogs = (logs: Log[]): LoyaltyGift[] => {
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
          const tokenIds = parseArgsLoyaltyGift(log.args).isVoucher 
          const temp = tokenIds.map((tokenId, i) => ({
            giftAddress: parseEthAddress(log.address), 
            issuer: parseArgsLoyaltyGift(log.args).issuer, 
            giftId: i, 
            isVoucher: tokenId
          }))
          return temp
        }
        throw new Error('Incorrect data at Token (gift) Contract logs: some fields are missing or incorrect');
    })

    return parsedLogs.flat() as LoyaltyGift[] 

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
        return parseArgsAddRemoveLoyaltyGift(log.args)
      } 
        throw new Error('Incorrect data at LoyaltyGift logs: some fields are missing or incorrect');
    })
    return parsedLogs as {giftAddress: EthAddress, giftId: number}[]

  } catch {
    throw new Error('Incorrect data at LoyaltyGift logs. Parser caught error');
  }
};

// Is this parser unused? Check and if so, delete £todo
export const parseLoyaltyLogs = (logs: Log[]): EthAddress[] => {
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
        'address' in log && 
        'args' in log && 
        'logIndex' in log && 
        'blockNumber' in log
        ) {
        return ({
          address: parseEthAddress(log.address),
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

export const parseMetadata = (metadata: unknown): Metadata => {
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
  if ( !qrText || typeof qrText !== 'string' ) {
    throw new Error('Incorrect or missing data');
  }

  if ( 
    qrText.includes('type') &&
    qrText.includes(';')
      ) { 
        try {
          const data = qrText.split(";")

          if (data[0].includes("claimGift")) {

            return {
              type: "claimGift",  
              loyaltyToken: parseEthAddress(data[1]), 
              loyaltyTokenId: Number(data[2]), 
              loyaltyCardId: Number(data[3]), 
              customerAddress: parseEthAddress(data[4]), 
              loyaltyPoints: Number(data[5]), 
              signature: parseSignature(data[6])
              }
          } 

          if (data[0].includes("redeemToken")) {
            return {
              type: "redeemToken", 
              loyaltyToken: parseEthAddress(data[1]), 
              loyaltyTokenId: Number(data[2]), 
              loyaltyCardId: Number(data[3]), 
              customerAddress: parseEthAddress(data[4]), 
              signature: parseSignature(data[5])
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
       }
       
    else 

      try {
        return {
            type: "giftPoints", 
            loyaltyCardAddress: parseEthAddress(qrText)
            } 
        } catch (error) {
          throw new Error(`Incorrect data at QrData: type not recognised ${error}`);
        }
      
       throw new Error('Incorrect data at QrData: some fields are missing or incorrect');
};