import React, { useContext } from 'react';
import { TransactionContext } from '../context/TransactionContext';
import testData from '../utils/testData';
import { shortenAddress } from '../utils/shortenAddress';
import { IoCheckmarkDone } from 'react-icons/io5';

const TransactionCard = ({
  addressTo,
  addressFrom,
  timestamp,
  message,
  amount,
  url,
}) => (
  <div
    className="bg-[#181918] m-4 flex flex-1
    2xl:min-w-[450px]
    2xl:max-w-[500px]
    sm:min-w-[270px]
    sm:max-w-[300px]
    flex-col p-3 rounded-md hover:shadow-2xl
  "
  >
    <div className="flex flex-col items-center w-full mt-3">
      <div className="w-full mb-6 p-2">
        <a
          href={`https://ropsten.etherscan.io/address/${addressFrom}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <p className="text-white text-base">
            From: {shortenAddress(addressFrom)}
          </p>
        </a>
        <a
          href={`https://ropsten.etherscan.io/address/${addressTo}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <p className="text-white text-base">
            To: {shortenAddress(addressFrom)}
          </p>
        </a>
        <p className="text-white text-base">Amount: {amount} ETH</p>
        {message && (
          <>
            <br />
            <p className="text-white text-base">Message: {message}</p>
          </>
        )}
        <svg width="1em" height="1em">
          <linearGradient
            id="bg-checkmark"
            x1="100%"
            y1="100%"
            x2="0%"
            y2="0%"
          >
            <stop stopColor="#11998e" offset="0%" />
            <stop stopColor="#38ef7d" offset="100%" />
          </linearGradient>
        </svg>
        <IoCheckmarkDone
          fontSize={40}
          className="w-full h-36 rounded-md"
          style={{ stroke: "url(#bg-checkmark)" }}
        />
        <div className="bg-black p-3 px-5 w-max rounded-3xl mt-5 shadow-2xl">
          <p className="text-[#37c7da] font-bold">{timestamp}</p>
        </div>
      </div>
    </div>
  </div>
);

const Transactions = () => {
  const { currentAccount } = useContext(TransactionContext);

  return (
    <div className="flex w-full justify-center items-center 2xl:px-20 gradient-bg-transactions">
      <div className="flex flex-col md:p-12 py-12 px-4">
        {currentAccount ? (
          <h3 className="text-white text-3xl text-center my-2">
            Latest Transactions
          </h3>
        ) : (
          <h3 className="text-white text-3xl text-center my-2">
            Connect your account to see the latest transactions.
          </h3>
        )}

        <div className="flex flex-wrap justify-center items-center mt-10">
          {testData.reverse().map((transaction, index) => (
            <TransactionCard key={index} {...transaction} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Transactions;
