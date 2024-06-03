// Custom hook to manage fetching points and cards of vendor account.
// They are saved in redux for quick retrieval.  

import { useAppSelector } from "@/redux/hooks";
import { Status } from "@/types";
import { useEffect, useRef, useState } from "react";
import { usePublicClient } from "wagmi";
import { parseBalances, parseBigInt, parseEthAddress } from "../utils/parsers";
import { loyaltyProgramAbi } from "@/context/abi";
import { selectLoyaltyProgram } from "@/redux/reducers/loyaltyProgramReducer";
import { useDispatch } from "react-redux";

export const useVendorAccount = () => {
  const publicClient = usePublicClient(); 
  const { selectedLoyaltyProgram  } = useAppSelector(state => state.selectedLoyaltyProgram )
  const dispatch = useDispatch() 
  
  const [ mintedCards, setMintedCards] = useState<number>()
  const [ balances, setBalances] = useState<{points: number, cards: number}>()  
  
  const statusMintedCards = useRef<Status>("isIdle") 
  const statusFetchBalances = useRef<Status>("isIdle") 
  const [status, setStatus] = useState<Status>("isIdle") 

  /// Fetch number of Cards Minted ///  
  const fetchMintedCards = async () => {
    if (selectedLoyaltyProgram && publicClient) {
      statusMintedCards.current = "isLoading"
      try {
        const cardData = await publicClient.readContract({
          address: parseEthAddress(selectedLoyaltyProgram.programAddress), 
          abi: loyaltyProgramAbi,
          functionName: 'getNumberLoyaltyCardsMinted', 
          args: []
        });

        const mintedCardsData = Number(parseBigInt(cardData))
        setMintedCards(mintedCardsData)

        statusMintedCards.current = "isSuccess"
        } catch (error) {
          statusMintedCards.current = "isError"
          console.log(error)
      }
    }
  }

  /// Fetch Balance of points [0] and all cards minted & upload to Redux /// 
  const fetchBalances = async () => {
    if (selectedLoyaltyProgram && mintedCards != undefined) {
      statusFetchBalances.current = "isLoading"
      const tokenIds = Array.from({length: mintedCards + 1}, (_, index) => index);
      const addressArray = new Array(mintedCards + 1).fill(selectedLoyaltyProgram.programOwner)   

      if (tokenIds.length == addressArray.length && publicClient)
        try {
          const pointsData = await publicClient.readContract({
            address: parseEthAddress(selectedLoyaltyProgram.programAddress), 
            abi: loyaltyProgramAbi,
            functionName: 'balanceOfBatch', 
            args: [ addressArray, tokenIds ]
          });

          const updatedLoyaltyProgram = {...selectedLoyaltyProgram, balances: parseBalances(pointsData)}
          dispatch(selectLoyaltyProgram(updatedLoyaltyProgram))
          statusFetchBalances.current = "isSuccess"
          } catch (error) {
            statusFetchBalances.current = "isError"
            console.log(error)
          }
    }
  }

  // forces a refetchBalances. 
  const refetchBalances = () => {
    statusMintedCards.current = "isIdle"
    statusFetchBalances.current = "isIdle"
    fetchMintedCards()
  }

  const setProgramBalances = () => {
    if (selectedLoyaltyProgram && selectedLoyaltyProgram.balances) {
      const cards = selectedLoyaltyProgram.balances.slice(1,)
      const numberOfCards: number = cards.reduce(
        (acc, balance) => acc + Number(balance), 0)

      setBalances({
        points: Number(selectedLoyaltyProgram.balances[0]),
        cards: numberOfCards
      })
    }   
  }

   // sequencing hook functions 
  useEffect(() => {
  // hook gets automatically triggered if no balance is available in redux 
    if (
      selectedLoyaltyProgram && 
      selectedLoyaltyProgram.balances 
    ) setProgramBalances()
    if (
      statusMintedCards.current == "isIdle" && 
      !mintedCards && 
      selectedLoyaltyProgram &&
      !selectedLoyaltyProgram.balances 
    ) fetchMintedCards() 
    if (
      statusMintedCards.current == "isSuccess" &&
      mintedCards != undefined && 
      statusFetchBalances.current == "isIdle" 
      ) fetchBalances()
  }, [, mintedCards, selectedLoyaltyProgram])

  // updating status 
  useEffect(() => {
    if (
      statusMintedCards.current == "isLoading" || 
      statusFetchBalances.current == "isLoading"
    ) setStatus("isLoading")
    if (
      statusMintedCards.current == "isError" || 
      statusFetchBalances.current == "isError"
    ) setStatus("isError")
    if (
      statusMintedCards.current == "isSuccess" || 
      statusFetchBalances.current == "isSuccess"
    ) setStatus("isSuccess")
  }, [balances, mintedCards])

  return {status, mintedCards, balances, refetchBalances } // refetchBalances
}

