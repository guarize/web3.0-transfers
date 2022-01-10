import React, { createContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { contractABI, contractAddress } from '../utils/constants';

export const TransactionContext = createContext();

const { ethereum } = window;

const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer,
  );

  return transactionContract;
};

export const TransactionProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState('');
  const [formData, setFormData] = useState({
    addressTo: '',
    amount: '',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(
    localStorage.getItem('transactionCount'),
  );
  const [transactions, setTransactions] = useState([]);

  const handleForm = ({ target: { value } }, name) => {
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const getAllTransactions = async () => {
    try {
      if (!ethereum) return alert('Please install Metamask');

      const transactionContract = getEthereumContract();

      const availableTransactions =
        await transactionContract.getAllTransactions();

      const structuredTransactions = availableTransactions.map(
        ({ receiver, sender, timestamp, message, amount }) => ({
          addressTo: receiver,
          addressFrom: sender,
          timestamp: new Date(timestamp.toNumber() * 1000).toLocaleString(),
          message,
          amount: parseInt(amount._hex) / (10 ** 18),
        }),
      );

      setTransactions(structuredTransactions);
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum) return alert('Please install Metamask');

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);

        getAllTransactions();
      } else {
        console.log('No accounts found');
      }
    } catch (error) {
      console.log(error);
      throw new Error('No Ethereum object.');
    }
  };

  const checkIfTransactionsExist = async () => {
    try {
      const transactionContract = getEthereumContract();
      const transactionCount = await transactionContract.getTransactionCount();

      window.localStorage.setItem('transactionCount', transactionCount);
    } catch (error) {
      console.log(error);
      throw new Error('No Ethereum object.');
    }
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert('Please install Metamask');

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });

      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
      throw new Error('No Ethereum object.');
    }
  };

  const sendTransaction = async () => {
    try {
      if (!ethereum) return alert('Please install Metamask');

      const { addressTo, amount, message } = formData;
      const transactionContract = getEthereumContract();
      const parsedAmount = ethers.utils.parseEther(amount);

      await ethereum.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: currentAccount,
            to: addressTo,
            gas: '0x5208',
            value: parsedAmount._hex,
          },
        ],
      });

      const transactionHash = await transactionContract.addToBlockchain(
        addressTo,
        parsedAmount,
        message,
      );

      setIsLoading(true);
      console.log(`Loading - ${transactionHash.hash}`);
      await transactionHash.wait();
      setIsLoading(false);
      console.log(`Success - ${transactionHash.hash}`);

      const transactionCount = await transactionContract.getTransactionCount();
      setTransactionCount(transactionCount.toNumber());

      window.reload();
    } catch (error) {
      console.log(error);
      throw new Error('No Ethereum object.');
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
    checkIfTransactionsExist();
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        currentAccount,
        formData,
        handleForm,
        sendTransaction,
        isLoading,
        transactions,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
