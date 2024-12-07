import { TradeAbi } from "../contract/abi"
import { wagmiClient } from "@/configs";
import { useState } from "react";
import toast from "react-hot-toast";
import { getAddress } from "viem";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";

type ExecuteTradeProps = {
  user: string;
  token: string;
  amount: number;
  price: number;
  tradeId: string;
};

type RecordAttestationProps = {
  user: string;
  tradeId: string;
  details: string;
};

export const useTradeOperations = () => {
  const { address, isConnected } = useAccount({
    config: wagmiClient,
  });

  const { writeContract, data: hash } = useWriteContract({
    config: wagmiClient,
  });

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: hash!,
    });

  const [isSending, setIsSending] = useState(false);
  const [isAttesting, setIsAttesting] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const executeTrade = ({ user, token, amount, price, tradeId }: ExecuteTradeProps) => {
    setIsSending(true);
    console.log('Inside execute trade');
    console.log(user, token, amount, price);
    writeContract(
      {
        abi: TradeAbi,
        address: getAddress(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!),
        functionName: "executeTrade",
        args: [user, token, BigInt(amount), BigInt(price), tradeId],
      },
      {
        onSuccess: () => {
          toast.loading("Trade Executed! Waiting for confirmation.", {
            id: "loading1",
          });
          setIsSending(false);
          setConfirming(true);
        },
        onError: (e) => {
          setIsSending(false);
          toast.error("Transaction Failed! Try Again.");
        },
      }
    );
  };

  const recordAttestation = ({ user, tradeId, details }: RecordAttestationProps) => {
    setIsAttesting(true);
    writeContract(
      {
        abi: TradeAbi,
        address: getAddress(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!),
        functionName: "recordAttestation",
        args: [user, tradeId, details],
      },
      {
        onSuccess: () => {
          toast.loading("Attestation Recorded! Waiting for confirmation.", {
            id: "loading2",
          });
          setIsAttesting(false);
          setConfirming(true);
        },
        onError: () => {
          setIsAttesting(false);
          toast.error("Transaction Failed! Try Again.");
        },
      }
    );
  };

  const useGetTradeDetails = (tradeId: string) => {
    const { data, isLoading } = useReadContract({
      abi: TradeAbi,
      address: getAddress(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!),
      functionName: "getTradeDetails",
      args: [tradeId],
    });
    return { data, isLoading };
  };

  const useGetUserTrades = (user: string) => {
    const { data, isLoading, refetch } = useReadContract({
      abi: TradeAbi,
      address: getAddress(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!),
      functionName: "getUserTrades",
      args: [user],
      query: {
        staleTime: 0,
        enabled: isConnected,
      },
    });
    return { data, isLoading, refetch };
  };

  return {
    isSending,
    isAttesting,
    confirming,
    isConfirming,
    isConfirmed,
    hash,
    executeTrade,
    recordAttestation,
    useGetTradeDetails,
    useGetUserTrades,
  };
};
