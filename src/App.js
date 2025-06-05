import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CLAIM_CONTRACT_ADDRESS } from './contract/config';
import ClaimABI from './contract/ClaimABI.json';

function App() {
  const [account, setAccount] = useState("");
  const [status, setStatus] = useState("");
  const [hasClaimed, setHasClaimed] = useState(false);

  // Kết nối ví
  const connectWallet = async () => {
    if (window.ethereum) {
      const [selectedAddress] = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(selectedAddress);
      checkIfClaimed(); // Kiểm tra sau khi kết nối ví
    } else {
      alert("❌ Vui lòng cài đặt MetaMask!");
    }
  }

  // Kiểm tra đã claim chưa
  useEffect(() => {
    const checkClaimed = async () => {
      if (window.ethereum && account) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(CLAIM_CONTRACT_ADDRESS, ClaimABI, provider);
        const claimed = await contract.hasClaimed(account);
        setHasClaimed(claimed);
      }
    };
    checkClaimed();
  }, [account]);

  async function claimToken() {
    if (!window.ethereum) return alert("❌ Vui lòng kết nối MetaMask trước");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CLAIM_CONTRACT_ADDRESS, ClaimABI, signer);

    try {
      const tx = await contract.claim();
      setStatus("⏳ Đang gửi giao dịch... TX: " + tx.hash);
      await tx.wait();
      setStatus("✅ Nhận GMECOIN thành công!")
      setHasClaimed(true); // ✅ ẩn nút
    } catch (err) {
      console.error(err);
      setStatus("❌ Lỗi khi nhận GMECOIN: " + err.message);
    }
  }

const checkIfClaimed = async () => {
  if (window.ethereum && account) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(CLAIM_CONTRACT_ADDRESS, ClaimABI, provider);
    const claimed = await contract.hasClaimed(account);
    setHasClaimed(claimed);
  }
};

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>🎮 Claim GMECOIN</h1>
      <p>🧾 Ví: {account || "Chưa kết nối"}</p>
      <button onClick={connectWallet}>🔌 Kết nối ví</button>

      {!hasClaimed && account && (
        <button onClick={claimToken} style={{ marginLeft: '1rem' }}>🎁 Nhận GMECOI</button>
      )}

      {hasClaimed && account && <p>✅ Bạn đã nhận GMECOIN</p>}

      <p style={{ marginTop: '1rem' }}>{status}</p>
    </div>
  );
}

export default App;
