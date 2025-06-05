import React, { useState } from 'react';
import { ethers } from 'ethers';
import { CLAIM_CONTRACT_ADDRESS } from './contract/config';
import ClaimABI from './contract/ClaimABI.json';

function App() {
  const [account, setAccount] = useState("");
  const [status, setStatus] = useState("");

  async function connectWallet() {
    if (window.ethereum) {
      const [selectedAddress] = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(selectedAddress);
    } else {
      alert("❌ Vui lòng cài đặt MetaMask!");
    }
  }

  async function claimToken() {
    if (!window.ethereum) return alert("🔌 Vui lòng kết nối MetaMask trước");

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CLAIM_CONTRACT_ADDRESS, ClaimABI, signer);

    try {
      const tx = await contract.claim();
      setStatus("⏳ Đang gửi giao dịch... TX: " + tx.hash);
      await tx.wait();
      setStatus("✅ Nhận GMECOIN thành công!");
    } catch (err) {
      console.error(err);
      setStatus("❌ Lỗi khi nhận GMECOIN: " + err.message);
    }
  }

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>🎮 Claim GMECOIN</h1>
      <p>🧾 Ví: {account || "Chưa kết nối"}</p>
      <button onClick={connectWallet}>🔌 Kết nối ví</button>
      <button onClick={claimToken} style={{ marginLeft: '1rem' }}>🎁 Nhận GMECOIN</button>
      <p style={{ marginTop: '1rem' }}>{status}</p>
    </div>
  );
}

export default App;
