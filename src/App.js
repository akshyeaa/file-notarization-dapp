import "./styles/Notarization.css";
import React, { useState } from "react";
import { ethers } from "ethers";
import { ThirdwebStorage } from "@thirdweb-dev/storage";

// Contract ABI
const abi = [
  {
    inputs: [
      { internalType: "bytes32", name: "fileHash", type: "bytes32" },
      { internalType: "string", name: "ipfsCID", type: "string" },
    ],
    name: "notarizeFile",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    name: "documents",
    outputs: [
      { internalType: "bytes32", name: "hash", type: "bytes32" },
      { internalType: "string", name: "ipfsCID", type: "string" },
      { internalType: "uint256", name: "timestamp", type: "uint256" },
      { internalType: "address", name: "owner", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "fileHash", type: "bytes32" }],
    name: "verifyFile",
    outputs: [
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "address", name: "", type: "address" },
      { internalType: "string", name: "", type: "string" },
    ],
    stateMutability: "view",
    type: "function",
  },
];

// Replace with your deployed contract address
const CONTRACT_ADDRESS = "0xBe1288aA8FB244a174c1Ad1a100A537475D6A98c";

function App() {
  const [file, setFile] = useState(null);
  const [cid, setCid] = useState("");
  const [hash, setHash] = useState("");
  const [result, setResult] = useState(null);

  const storage = new ThirdwebStorage({
    clientId: "6d612d1e9f38199cd6a995d9624b4a3b", // 👈 Replace this
  });

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
    setCid("");
    setHash("");
  };

  const notarizeFile = async () => {
    if (!file) return alert("Choose a file first");

    try {
      // Read file and compute hash
      const buffer = await file.arrayBuffer();
      const hashBytes = ethers.utils.keccak256(new Uint8Array(buffer));
      setHash(hashBytes);

      // Upload to IPFS via Thirdweb
      const upload = await storage.upload(file);
      const ipfsCID = upload.replace("ipfs://", "");
      setCid(ipfsCID);

      // Interact with contract
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

      const tx = await contract.notarizeFile(hashBytes, ipfsCID);
      await tx.wait();

      alert("File notarized successfully on blockchain!");
    } catch (err) {
      console.error("Notarization Error:", err);
      alert("Notarization failed");
    }
  };

  const verifyFile = async () => {
    if (!file) return alert("Choose a file first");

    try {
      const buffer = await file.arrayBuffer();
      const hashBytes = ethers.utils.keccak256(new Uint8Array(buffer));

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);

      const [timestamp, owner, ipfsCID] = await contract.verifyFile(hashBytes);
      setResult({
        timestamp: new Date(timestamp.toNumber() * 1000).toLocaleString(),
        owner,
        ipfsCID,
      });
    } catch (err) {
      console.error("Verification Error:", err);
      alert("Verification failed");
    }
  };

  return (
    <div className="notarization-container">
      <h1 className="notarization-title">Blockchain File Notarization</h1>
  
      <input type="file" onChange={handleFileChange} className="file-input" />
  
      <div className="button-group">
        <button onClick={notarizeFile} className="notarize-btn">Notarize File</button>
        <button onClick={verifyFile} className="verify-btn">Verify File</button>
      </div>
  
      {hash && <p className="break-word"><strong>File Hash:</strong> {hash}</p>}
  
      {cid && (
        <p className="break-word">
          <strong>IPFS CID:</strong>{" "}
          <a href={`https://ipfs.io/ipfs/${cid}`} target="_blank" rel="noreferrer">
            {cid}
          </a>
        </p>
      )}
  
      {result && (
        <div className="result-box">
          <h3>Verification Result</h3>
          <p><strong>Timestamp:</strong> {result.timestamp}</p>
          <p><strong>Owner:</strong> {result.owner}</p>
          <p>
            <strong>IPFS CID:</strong>{" "}
            <a href={`https://ipfs.io/ipfs/${result.ipfsCID}`} target="_blank" rel="noreferrer">
              {result.ipfsCID}
            </a>
          </p>
        </div>
      )}
    </div>
  );  
}

export default App;




// 9th time:this is working well with all the css integrated in one code(final)..in the above code im gonna change and make css different from app.js
// import React, { useState } from "react";
// import { ethers } from "ethers";
// import { ThirdwebStorage } from "@thirdweb-dev/storage";

// // Contract ABI
// const abi = [
//   {
//     inputs: [
//       { internalType: "bytes32", name: "fileHash", type: "bytes32" },
//       { internalType: "string", name: "ipfsCID", type: "string" },
//     ],
//     name: "notarizeFile",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     inputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
//     name: "documents",
//     outputs: [
//       { internalType: "bytes32", name: "hash", type: "bytes32" },
//       { internalType: "string", name: "ipfsCID", type: "string" },
//       { internalType: "uint256", name: "timestamp", type: "uint256" },
//       { internalType: "address", name: "owner", type: "address" },
//     ],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [{ internalType: "bytes32", name: "fileHash", type: "bytes32" }],
//     name: "verifyFile",
//     outputs: [
//       { internalType: "uint256", name: "", type: "uint256" },
//       { internalType: "address", name: "", type: "address" },
//       { internalType: "string", name: "", type: "string" },
//     ],
//     stateMutability: "view",
//     type: "function",
//   },
// ];

// // Replace with your deployed contract address
// const CONTRACT_ADDRESS = "0xBe1288aA8FB244a174c1Ad1a100A537475D6A98c";

// function App() {
//   const [file, setFile] = useState(null);
//   const [cid, setCid] = useState("");
//   const [hash, setHash] = useState("");
//   const [result, setResult] = useState(null);

//   const storage = new ThirdwebStorage({
//     clientId: "6d612d1e9f38199cd6a995d9624b4a3b", // 👈 Replace this
//   });

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//     setResult(null);
//     setCid("");
//     setHash("");
//   };

//   const notarizeFile = async () => {
//     if (!file) return alert("Choose a file first");

//     try {
//       // Read file and compute hash
//       const buffer = await file.arrayBuffer();
//       const hashBytes = ethers.utils.keccak256(new Uint8Array(buffer));
//       setHash(hashBytes);

//       // Upload to IPFS via Thirdweb
//       const upload = await storage.upload(file);
//       const ipfsCID = upload.replace("ipfs://", "");
//       setCid(ipfsCID);

//       // Interact with contract
//       const provider = new ethers.providers.Web3Provider(window.ethereum);
//       await provider.send("eth_requestAccounts", []);
//       const signer = provider.getSigner();
//       const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

//       const tx = await contract.notarizeFile(hashBytes, ipfsCID);
//       await tx.wait();

//       alert("File notarized successfully on blockchain!");
//     } catch (err) {
//       console.error("Notarization Error:", err);
//       alert("Notarization failed");
//     }
//   };

//   const verifyFile = async () => {
//     if (!file) return alert("Choose a file first");

//     try {
//       const buffer = await file.arrayBuffer();
//       const hashBytes = ethers.utils.keccak256(new Uint8Array(buffer));

//       const provider = new ethers.providers.Web3Provider(window.ethereum);
//       const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);

//       const [timestamp, owner, ipfsCID] = await contract.verifyFile(hashBytes);
//       setResult({
//         timestamp: new Date(timestamp.toNumber() * 1000).toLocaleString(),
//         owner,
//         ipfsCID,
//       });
//     } catch (err) {
//       console.error("Verification Error:", err);
//       alert("Verification failed");
//     }
//   };

//   return (
//     <div style={{
//       maxWidth: "600px",
//       margin: "40px auto",
//       padding: "30px",
//       fontFamily: "Segoe UI, sans-serif",
//       backgroundColor: "#f8f9fa",
//       borderRadius: "12px",
//       boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
//     }}>
//       <h1 style={{ textAlign: "center", color: "#333" }}>Blockchain File Notarization</h1>
  
//       <input
//         type="file"
//         onChange={handleFileChange}
//         style={{
//           display: "block",
//           margin: "20px auto",
//           padding: "10px",
//           borderRadius: "6px",
//           border: "1px solid #ccc",
//           width: "100%"
//         }}
//       />
  
//       <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "10px" }}>
//         <button
//           onClick={notarizeFile}
//           style={{
//             padding: "10px 20px",
//             backgroundColor: "#007bff",
//             color: "#fff",
//             border: "none",
//             borderRadius: "6px",
//             cursor: "pointer"
//           }}
//         >
//           Notarize File
//         </button>
  
//         <button
//           onClick={verifyFile}
//           style={{
//             padding: "10px 20px",
//             backgroundColor: "#28a745",
//             color: "#fff",
//             border: "none",
//             borderRadius: "6px",
//             cursor: "pointer"
//           }}
//         >
//           Verify File
//         </button>
//       </div>
  
//       {hash && (
//         <p style={{ marginTop: "20px", wordBreak: "break-all" }}>
//           <strong>File Hash:</strong> {hash}
//         </p>
//       )}
  
//       {cid && (
//         <p style={{ wordBreak: "break-all" }}>
//           <strong>IPFS CID:</strong>{" "}
//           <a href={`https://ipfs.io/ipfs/${cid}`} target="_blank" rel="noreferrer">
//             {cid}
//           </a>
//         </p>
//       )}
  
//       {result && (
//         <div style={{
//           marginTop: "30px",
//           padding: "20px",
//           backgroundColor: "#fff",
//           border: "1px solid #ccc",
//           borderRadius: "8px"
//         }}>
//           <h3 style={{ marginBottom: "10px", color: "#333" }}>Verification Result</h3>
//           <p><strong>Timestamp:</strong> {result.timestamp}</p>
//           <p><strong>Owner:</strong> {result.owner}</p>
//           <p>
//             <strong>IPFS CID:</strong>{" "}
//             <a href={`https://ipfs.io/ipfs/${result.ipfsCID}`} target="_blank" rel="noreferrer">
//               {result.ipfsCID}
//             </a>
//           </p>
//         </div>
//       )}
//     </div>
//   );  
// }

// export default App;






//8th time:this is working properly...no issues in this code and i just wanted to style it so writing the above code 
// import React, { useState } from "react";
// import { ethers } from "ethers";
// import { ThirdwebStorage } from "@thirdweb-dev/storage";

// // Contract ABI
// const abi = [
//   {
//     inputs: [
//       { internalType: "bytes32", name: "fileHash", type: "bytes32" },
//       { internalType: "string", name: "ipfsCID", type: "string" },
//     ],
//     name: "notarizeFile",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     inputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
//     name: "documents",
//     outputs: [
//       { internalType: "bytes32", name: "hash", type: "bytes32" },
//       { internalType: "string", name: "ipfsCID", type: "string" },
//       { internalType: "uint256", name: "timestamp", type: "uint256" },
//       { internalType: "address", name: "owner", type: "address" },
//     ],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [{ internalType: "bytes32", name: "fileHash", type: "bytes32" }],
//     name: "verifyFile",
//     outputs: [
//       { internalType: "uint256", name: "", type: "uint256" },
//       { internalType: "address", name: "", type: "address" },
//       { internalType: "string", name: "", type: "string" },
//     ],
//     stateMutability: "view",
//     type: "function",
//   },
// ];

// // Replace with your deployed contract address
// const CONTRACT_ADDRESS = "0xBe1288aA8FB244a174c1Ad1a100A537475D6A98c";

// function App() {
//   const [file, setFile] = useState(null);
//   const [cid, setCid] = useState("");
//   const [hash, setHash] = useState("");
//   const [result, setResult] = useState(null);

//   const storage = new ThirdwebStorage({
//     clientId: "6d612d1e9f38199cd6a995d9624b4a3b", // 👈 Replace this
//   });

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//     setResult(null);
//     setCid("");
//     setHash("");
//   };

//   const notarizeFile = async () => {
//     if (!file) return alert("Choose a file first");

//     try {
//       // Read file and compute hash
//       const buffer = await file.arrayBuffer();
//       const hashBytes = ethers.utils.keccak256(new Uint8Array(buffer));
//       setHash(hashBytes);

//       // Upload to IPFS via Thirdweb
//       const upload = await storage.upload(file);
//       const ipfsCID = upload.replace("ipfs://", "");
//       setCid(ipfsCID);

//       // Interact with contract
//       const provider = new ethers.providers.Web3Provider(window.ethereum);
//       await provider.send("eth_requestAccounts", []);
//       const signer = provider.getSigner();
//       const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

//       const tx = await contract.notarizeFile(hashBytes, ipfsCID);
//       await tx.wait();

//       alert("File notarized successfully on blockchain!");
//     } catch (err) {
//       console.error("Notarization Error:", err);
//       alert("Notarization failed");
//     }
//   };

//   const verifyFile = async () => {
//     if (!file) return alert("Choose a file first");

//     try {
//       const buffer = await file.arrayBuffer();
//       const hashBytes = ethers.utils.keccak256(new Uint8Array(buffer));

//       const provider = new ethers.providers.Web3Provider(window.ethereum);
//       const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);

//       const [timestamp, owner, ipfsCID] = await contract.verifyFile(hashBytes);
//       setResult({
//         timestamp: new Date(timestamp.toNumber() * 1000).toLocaleString(),
//         owner,
//         ipfsCID,
//       });
//     } catch (err) {
//       console.error("Verification Error:", err);
//       alert("Verification failed");
//     }
//   };

//   return (
//     <div style={{ padding: "30px", fontFamily: "Arial" }}>
//       <h1>Blockchain File Notarization</h1>

//       <input type="file" onChange={handleFileChange} />
//       <br />
//       <br />
//       <button onClick={notarizeFile}>Notarize File</button>
//       <button onClick={verifyFile} style={{ marginLeft: "10px" }}>
//         Verify File
//       </button>

//       {hash && <p><b>File Hash:</b> {hash}</p>}
//       {cid && (
//         <p>
//           <b>IPFS CID:</b>{" "}
//           <a href={`https://ipfs.io/ipfs/${cid}`} target="_blank" rel="noreferrer">
//             {cid}
//           </a>
//         </p>
//       )}

//       {result && (
//         <div style={{ marginTop: "20px" }}>
//           <h3>Verification Result</h3>
//           <p><b>Timestamp:</b> {result.timestamp}</p>
//           <p><b>Owner:</b> {result.owner}</p>
//           <p>
//             <b>IPFS CID:</b>{" "}
//             <a href={`https://ipfs.io/ipfs/${result.ipfsCID}`} target="_blank" rel="noreferrer">
//               {result.ipfsCID}
//             </a>
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;








//7th time:issue with notarization...ipsf was working fine but some issue with notarization
// // App.js
// import { useState } from "react";
// import { 
//   useStorage, 
//   useContract, 
//   useMetamask, 
//   useAddress,
//   useChainId
// } from "@thirdweb-dev/react";
// import { ethers } from "ethers";
// import CryptoJS from "crypto-js";

// function App() {
//   const [file, setFile] = useState(null);
//   const [fileHash, setFileHash] = useState("");
//   const [ipfsUrl, setIpfsUrl] = useState("");
//   const [verificationResult, setVerificationResult] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   // Initialize ThirdWeb hooks
//   const storage = useStorage();
//   const { contract } = useContract("0xBe1288aA8FB244a174c1Ad1a100A537475D6A98c", [
//     {
//       "inputs": [
//         { "internalType": "bytes32", "name": "fileHash", "type": "bytes32" },
//         { "internalType": "string", "name": "ipfsCID", "type": "string" }
//       ],
//       "name": "notarizeFile",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         { "internalType": "bytes32", "name": "fileHash", "type": "bytes32" }
//       ],
//       "name": "verifyFile",
//       "outputs": [
//         { "internalType": "uint256", "name": "", "type": "uint256" },
//         { "internalType": "address", "name": "", "type": "address" },
//         { "internalType": "string", "name": "", "type": "string" }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     }
//   ]);
  
//   const connectWithMetamask = useMetamask();
//   const address = useAddress();
//   const chainId = useChainId();

//   const handleFileUpload = (e) => {
//     const selectedFile = e.target.files[0];
//     setFile(selectedFile);

//     const reader = new FileReader();
//     reader.onload = (event) => {
//       const content = event.target.result;
//       const hash = CryptoJS.SHA256(content).toString();
//       setFileHash(hash);
//     };
//     reader.readAsArrayBuffer(selectedFile);
//   };

//   const handleConnectWallet = async () => {
//     if (!window.ethereum) {
//       alert("Please install MetaMask!");
//       return;
//     }
//     await connectWithMetamask();
//   };

//   const switchToSepolia = async () => {
//     try {
//       await window.ethereum.request({
//         method: 'wallet_switchEthereumChain',
//         params: [{ chainId: '0xaa36a7' }], // Sepolia chain ID in hex
//       });
//       return true;
//     } catch (error) {
//       console.error("Failed to switch network:", error);
//       return false;
//     }
//   };

//   const notarizeFile = async () => {
//     try {
//       setIsLoading(true);
      
//       if (!address) {
//         await handleConnectWallet();
//         return;
//       }

//       // Check and switch to Sepolia if needed
//       if (chainId !== 11155111) {
//         const switched = await switchToSepolia();
//         if (!switched) {
//           alert("Please switch to Sepolia network in MetaMask");
//           return;
//         }
//         // Wait for network switch
//         await new Promise(resolve => setTimeout(resolve, 1000));
//       }

//       if (!file || !fileHash) {
//         alert("Please select a file first!");
//         return;
//       }

//       // 1. Upload to IPFS
//       const ipfsCid = await storage.upload(file);
//       const ipfsLink = `https://ipfs.io/ipfs/${ipfsCid.split("://")[1]}`;
//       setIpfsUrl(ipfsLink);

//       // 2. Format hash for blockchain
//       const bytes32Hash = ethers.utils.hexZeroPad('0x' + fileHash, 32);

//       // 3. Store hash + IPFS CID on-chain
//       const tx = await contract.call("notarizeFile", [bytes32Hash, ipfsCid], {
//         gasLimit: 300000
//       });
      
//       const receipt = await tx.wait();
//       console.log("Transaction receipt:", receipt);

//       alert("✅ File notarized & stored on IPFS!");
//     } catch (error) {
//       console.error("Error:", error);
//       alert(`❌ Failed: ${error.reason || error.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const verifyFile = async () => {
//     try {
//       if (!fileHash) {
//         alert("No file selected!");
//         return;
//       }

//       const bytes32Hash = ethers.utils.hexZeroPad('0x' + fileHash, 32);
//       const [timestamp, owner, storedIpfsCid] = await contract.call("verifyFile", [bytes32Hash]);

//       setVerificationResult(
//         timestamp != 0
//           ? `✅ Verified!\n📅 ${new Date(timestamp * 1000).toLocaleString()}\n👤 ${address.substring(0, 6)}...${address.substring(address.length - 4)}\n🔗 ${storedIpfsCid}`
//           : "❌ File not found on blockchain"
//       );
//     } catch (error) {
//       console.error("Verification error:", error);
//       alert(`Error: ${error.message}`);
//     }
//   };

//   return (
//     <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
//       <h1>🔏 IPFS Notarization DApp</h1>
      
//       {!address ? (
//         <button 
//           onClick={handleConnectWallet}
//           style={{ 
//             marginBottom: "20px", 
//             padding: "10px 20px",
//             backgroundColor: "#3182ce",
//             color: "white",
//             border: "none",
//             borderRadius: "4px",
//             cursor: "pointer"
//           }}
//         >
//           Connect Wallet
//         </button>
//       ) : (
//         <div style={{ marginBottom: "20px" }}>
//           <p>Connected: {`${address.substring(0, 6)}...${address.substring(address.length - 4)}`}</p>
//           <p>Network: {chainId === 11155111 ? "Sepolia" : `Unknown (${chainId})`}</p>
//         </div>
//       )}

//       <div style={{ margin: "20px 0" }}>
//         <input 
//           type="file" 
//           onChange={handleFileUpload}
//           style={{ display: "block", marginBottom: "10px" }}
//         />
//         <p>File Hash: <code>{fileHash || "None"}</code></p>
//       </div>

//       <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
//         <button 
//           onClick={notarizeFile} 
//           disabled={!fileHash || isLoading}
//           style={{
//             padding: "10px 20px",
//             backgroundColor: isLoading ? "#a0aec0" : "#3182ce",
//             color: "white",
//             border: "none",
//             borderRadius: "4px",
//             cursor: !fileHash || isLoading ? "not-allowed" : "pointer"
//           }}
//         >
//           {isLoading ? "Processing..." : "📌 Notarize"}
//         </button>
//         <button 
//           onClick={verifyFile} 
//           disabled={!fileHash}
//           style={{
//             padding: "10px 20px",
//             backgroundColor: !fileHash ? "#a0aec0" : "#3182ce",
//             color: "white",
//             border: "none",
//             borderRadius: "4px",
//             cursor: !fileHash ? "not-allowed" : "pointer"
//           }}
//         >
//           🔍 Verify
//         </button>
//       </div>

//       {ipfsUrl && (
//         <div style={{ margin: "20px 0" }}>
//           <h3>🌐 IPFS Link:</h3>
//           <a 
//             href={ipfsUrl} 
//             target="_blank" 
//             rel="noopener noreferrer"
//             style={{ color: "#3182ce", wordBreak: "break-all" }}
//           >
//             {ipfsUrl}
//           </a>
//         </div>
//       )}

//       {verificationResult && (
//         <div style={{ 
//           margin: "20px 0", 
//           whiteSpace: "pre-wrap",
//           backgroundColor: "#f7fafc",
//           padding: "15px",
//           borderRadius: "4px",
//           border: "1px solid #e2e8f0"
//         }}>
//           <h3 style={{ marginTop: 0 }}>🔎 Verification Result:</h3>
//           <p style={{ marginBottom: 0 }}>{verificationResult}</p>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;





//6th time:i have intergrated ifsp in this code but the problem is that the file hash isnt on blockchain and its only generating ipfs link which is working fine so in the above code im changing the blockchain part also
// import { useState } from "react";
// import { useStorage, useContract, useSDK } from "@thirdweb-dev/react";
// import { ethers } from "ethers";
// import CryptoJS from "crypto-js";

// function App() {
//   const [file, setFile] = useState(null);
//   const [fileHash, setFileHash] = useState("");
//   const [ipfsUrl, setIpfsUrl] = useState("");
//   const [verificationResult, setVerificationResult] = useState("");
//   const [isConnected, setIsConnected] = useState(false);

//   // Initialize ThirdWeb Storage
//   const storage = useStorage();
//   const sdk = useSDK();

//   // Replace with your contract address & ABI
//   const contractAddress = "0xBe1288aA8FB244a174c1Ad1a100A537475D6A98c";
//   const contractABI = [
//     {
//       "inputs": [
//         {
//           "internalType": "bytes32",
//           "name": "fileHash",
//           "type": "bytes32"
//         },
//         {
//           "internalType": "string",
//           "name": "ipfsCID",
//           "type": "string"
//         }
//       ],
//       "name": "notarizeFile",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "bytes32",
//           "name": "",
//           "type": "bytes32"
//         }
//       ],
//       "name": "documents",
//       "outputs": [
//         {
//           "internalType": "bytes32",
//           "name": "hash",
//           "type": "bytes32"
//         },
//         {
//           "internalType": "string",
//           "name": "ipfsCID",
//           "type": "string"
//         },
//         {
//           "internalType": "uint256",
//           "name": "timestamp",
//           "type": "uint256"
//         },
//         {
//           "internalType": "address",
//           "name": "owner",
//           "type": "address"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "bytes32",
//           "name": "fileHash",
//           "type": "bytes32"
//         }
//       ],
//       "name": "verifyFile",
//       "outputs": [
//         {
//           "internalType": "uint256",
//           "name": "",
//           "type": "uint256"
//         },
//         {
//           "internalType": "address",
//           "name": "",
//           "type": "address"
//         },
//         {
//           "internalType": "string",
//           "name": "",
//           "type": "string"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     }
//   ];

//   // Connect to contract
//   const { contract } = useContract(contractAddress, contractABI);
//   const handleFileUpload = (e) => {
//     const selectedFile = e.target.files[0];
//     setFile(selectedFile);

//     const reader = new FileReader();
//     reader.onload = (event) => {
//       const content = event.target.result;
//       const hash = CryptoJS.SHA256(content).toString();
//       setFileHash(hash);
//     };
//     reader.readAsArrayBuffer(selectedFile);
//   };

//   // Notarize file (with IPFS)
//   const notarizeFile = async () => {
//     try {
//       if (!file || !fileHash) {
//         alert("Please select a file first!");
//         return;
//       }

//       // 1. Upload to IPFS
//       const ipfsCid = await storage.upload(file);
//       setIpfsUrl(`https://ipfs.io/ipfs/${ipfsCid.split("://")[1]}`);
//       console.log("IPFS URL:", ipfsUrl);

//       // 2. Format hash for blockchain
//       const bytes32Hash = ethers.utils.hexZeroPad('0x' + fileHash, 32);

//       // 3. Store hash + IPFS CID on-chain
//       const tx = await contract.call("notarizeFile", [bytes32Hash, ipfsCid]);
//       console.log("Transaction:", tx);

//       alert("File notarized & stored on IPFS! 🚀");
//     } catch (error) {
//       console.error("Error:", error);
//       alert(`Failed: ${error.message}`);
//     }
//   };

//   // Verify file
//   const verifyFile = async () => {
//     try {
//       if (!fileHash) {
//         alert("No file selected!");
//         return;
//       }

//       const bytes32Hash = ethers.utils.hexZeroPad('0x' + fileHash, 32);
//       const [timestamp, owner, storedIpfsCid] = await contract.call("verifyFile", [bytes32Hash]);

//       if (timestamp != 0) {
//         setVerificationResult(`
//           ✅ Verified!  
//           📅 Date: ${new Date(timestamp * 1000).toLocaleString()}  
//           👤 Owner: ${owner}  
//           🔗 IPFS: ${storedIpfsCid}
//         `);
//       } else {
//         setVerificationResult("❌ File not found on blockchain.");
//       }
//     } catch (error) {
//       console.error("Verification error:", error);
//       alert(`Error: ${error.message}`);
//     }
//   };

//   return (
//     <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
//       <h1>🔏 IPFS Notarization DApp</h1>
      
//       {/* File Upload */}
//       <div style={{ margin: "20px 0" }}>
//         <input type="file" onChange={handleFileUpload} />
//         <p>File Hash: <code>{fileHash || "None"}</code></p>
//       </div>

//       {/* Buttons */}
//       <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
//         <button onClick={notarizeFile} disabled={!fileHash}>
//           📌 Notarize on IPFS + Blockchain
//         </button>
//         <button onClick={verifyFile} disabled={!fileHash}>
//           🔍 Verify File
//         </button>
//       </div>

//       {/* Results */}
//       {ipfsUrl && (
//         <div style={{ margin: "20px 0" }}>
//           <h3>🌐 IPFS Link:</h3>
//           <a href={ipfsUrl} target="_blank" rel="noopener noreferrer">
//             {ipfsUrl}
//           </a>
//         </div>
//       )}

//       {verificationResult && (
//         <div style={{ margin: "20px 0", whiteSpace: "pre-wrap" }}>
//           <h3>🔎 Verification Result:</h3>
//           <p>{verificationResult}</p>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;






// 5th time:its working properly...going to next step where im adding IPFS file storage
// import { useState } from "react";
// import { ethers } from "ethers";
// import CryptoJS from "crypto-js";

// function App() {
//   const [fileHash, setFileHash] = useState("");
//   const [contract, setContract] = useState(null);
//   const [verificationResult, setVerificationResult] = useState("");
//   const [isConnected, setIsConnected] = useState(false);

//   // Replace with your contract address
//   const contractAddress = "0xfb7a5d0B78153167cbbEe671429C08D280f6aD0A";
//   const contractABI = [
//     {
//       "inputs": [
//         {
//           "internalType": "bytes32",
//           "name": "fileHash",
//           "type": "bytes32"
//         }
//       ],
//       "name": "notarizeFile",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "bytes32",
//           "name": "",
//           "type": "bytes32"
//         }
//       ],
//       "name": "documents",
//       "outputs": [
//         {
//           "internalType": "bytes32",
//           "name": "hash",
//           "type": "bytes32"
//         },
//         {
//           "internalType": "uint256",
//           "name": "timestamp",
//           "type": "uint256"
//         },
//         {
//           "internalType": "address",
//           "name": "owner",
//           "type": "address"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "bytes32",
//           "name": "fileHash",
//           "type": "bytes32"
//         }
//       ],
//       "name": "verifyFile",
//       "outputs": [
//         {
//           "internalType": "uint256",
//           "name": "",
//           "type": "uint256"
//         },
//         {
//           "internalType": "address",
//           "name": "",
//           "type": "address"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     }
//   ];

//   const connectContract = async () => {
//     try {
//       console.log("Attempting to connect to MetaMask...");
      
//       if (!window.ethereum) {
//         throw new Error("MetaMask not detected!");
//       }

//       console.log("Requesting account access...");
//       const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
//       console.log("Connected account:", accounts[0]);

//       const provider = new ethers.providers.Web3Provider(window.ethereum);
//       const signer = provider.getSigner();
//       console.log("Signer address:", await signer.getAddress());

//       const contract = new ethers.Contract(contractAddress, contractABI, signer);
//       setContract(contract);
//       setIsConnected(true);
//       console.log("Contract connected successfully!");
      
//     } catch (error) {
//       console.error("Connection error:", error);
//       alert(`Error: ${error.message}`);
//     }
//   };

//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     const reader = new FileReader();
//     reader.onload = (event) => {
//       const content = event.target.result;
//       const hash = CryptoJS.SHA256(content).toString();
//       console.log("File hash generated:", hash);
//       setFileHash(hash);
//     };
//     reader.readAsArrayBuffer(file);
//   };

//   const notarize = async () => {
//     try {
//       console.log("Attempting to notarize file hash:", fileHash);
      
//       if (!contract) throw new Error("Contract not connected");
//       if (!fileHash) throw new Error("No file selected");
  
//       // Convert the hex string to bytes32 format
//       const bytes32Hash = ethers.utils.hexZeroPad('0x' + fileHash, 32);
//       console.log("Formatted hash:", bytes32Hash);
  
//       const tx = await contract.notarizeFile(bytes32Hash);
//       console.log("Transaction sent:", tx.hash);
      
//       await tx.wait();
//       console.log("Transaction confirmed!");
//       alert("File notarized on blockchain!");
  
//     } catch (error) {
//       console.error("Notarization error:", error);
//       alert(`Error: ${error.message}`);
//     }
//   };

//   const verify = async () => {
//     try {
//       console.log("Verifying file hash:", fileHash);
      
//       if (!contract) throw new Error("Contract not connected");
//       if (!fileHash) throw new Error("No file selected");
  
//       // Convert the hex string to bytes32 format
//       const bytes32Hash = ethers.utils.hexZeroPad('0x' + fileHash, 32);
  
//       const [timestamp, owner] = await contract.verifyFile(bytes32Hash);
//       console.log("Verification result:", { timestamp, owner });
  
//       if (timestamp != 0) {
//         const result = `File notarized on ${new Date(timestamp * 1000)} by ${owner}`;
//         setVerificationResult(result);
//         console.log(result);
//       } else {
//         setVerificationResult("File not found on blockchain.");
//         console.log("File not found on blockchain.");
//       }
  
//     } catch (error) {
//       console.error("Verification error:", error);
//       alert(`Error: ${error.message}`);
//     }
//   };

//   return (
//     <div>
//       <h1>Proof-of-Existence Notary</h1>
      
//       <button onClick={connectContract}>
//         {isConnected ? "✔ Contract Connected" : "Connect Contract"}
//       </button>
      
//       <input type="file" onChange={handleFileUpload} />
//       <button onClick={notarize}>Notarize File</button>
//       <button onClick={verify}>Verify File</button>
      
//       <p>{verificationResult}</p>
      
//       <div style={{ marginTop: '20px', color: 'gray' }}>
//         <strong>Debug Info:</strong>
//         <p>File Hash: {fileHash || "None"}</p>
//         <p>Contract: {contract ? "Connected" : "Not Connected"}</p>
//       </div>
//     </div>
//   );
// }

// export default App;






// 4th time:only choose file is working ,connect contract ,notarize file and verify file options are not working
// import { useState } from "react";
// import { ethers } from "ethers"; // This will use v5.8.0
// import CryptoJS from "crypto-js";

// function App() {
//   const [fileHash, setFileHash] = useState("");
//   const [contract, setContract] = useState(null);
//   const [verificationResult, setVerificationResult] = useState("");

//   // Replace with your contract address
//   const contractAddress = "0xfb7a5d0B78153167cbbEe671429C08D280f6aD0A";
//   const contractABI = [
//     {
//       "inputs": [
//         {
//           "internalType": "bytes32",
//           "name": "fileHash",
//           "type": "bytes32"
//         }
//       ],
//       "name": "notarizeFile",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "bytes32",
//           "name": "",
//           "type": "bytes32"
//         }
//       ],
//       "name": "documents",
//       "outputs": [
//         {
//           "internalType": "bytes32",
//           "name": "hash",
//           "type": "bytes32"
//         },
//         {
//           "internalType": "uint256",
//           "name": "timestamp",
//           "type": "uint256"
//         },
//         {
//           "internalType": "address",
//           "name": "owner",
//           "type": "address"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "bytes32",
//           "name": "fileHash",
//           "type": "bytes32"
//         }
//       ],
//       "name": "verifyFile",
//       "outputs": [
//         {
//           "internalType": "uint256",
//           "name": "",
//           "type": "uint256"
//         },
//         {
//           "internalType": "address",
//           "name": "",
//           "type": "address"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     }
//   ];

//   const connectContract = async () => {
//     if (!window.ethereum) {
//       alert("Please install MetaMask!");
//       return;
//     }
//     // Ethers v5 syntax
//     const provider = new ethers.providers.Web3Provider(window.ethereum);
//     const signer = provider.getSigner();
//     const contract = new ethers.Contract(contractAddress, contractABI, signer);
//     setContract(contract);
//   };

//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     const reader = new FileReader();
//     reader.onload = (event) => {
//       const content = event.target.result;
//       const hash = CryptoJS.SHA256(content).toString();
//       setFileHash(hash);
//     };
//     reader.readAsArrayBuffer(file);
//   };

//   const notarize = async () => {
//     if (contract && fileHash) {
//       try {
//         await contract.notarizeFile(fileHash);
//         alert("File notarized on blockchain!");
//       } catch (err) {
//         alert(`Error: ${err.message}`);
//       }
//     }
//   };

//   const verify = async () => {
//     if (contract && fileHash) {
//       try {
//         const [timestamp, owner] = await contract.verifyFile(fileHash);
//         if (timestamp != 0) {
//           setVerificationResult(`File notarized on ${new Date(timestamp * 1000)} by ${owner}`);
//         } else {
//           setVerificationResult("File not found on blockchain.");
//         }
//       } catch (err) {
//         alert(`Error: ${err.message}`);
//       }
//     }
//   };

//   return (
//     <div>
//       <h1>Proof-of-Existence Notary</h1>
//       <button onClick={connectContract}>Connect Contract</button>
//       <input type="file" onChange={handleFileUpload} />
//       <button onClick={notarize}>Notarize File</button>
//       <button onClick={verify}>Verify File</button>
//       <p>{verificationResult}</p>
//     </div>
//   );
// }

// export default App;






//3rd time:"downgrading the code to work with ethers v5."
// import { useState } from "react";
// import { ethers } from "ethers";
// import CryptoJS from "crypto-js";

// function App() {
//   const [fileHash, setFileHash] = useState("");
//   const [contract, setContract] = useState(null);
//   const [verificationResult, setVerificationResult] = useState("");

//   // Replace with your contract address
//   const contractAddress = "0xfb7a5d0B78153167cbbEe671429C08D280f6aD0A";
//   const contractABI = [
//     {
//       "inputs": [
//         {
//           "internalType": "bytes32",
//           "name": "fileHash",
//           "type": "bytes32"
//         }
//       ],
//       "name": "notarizeFile",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "bytes32",
//           "name": "",
//           "type": "bytes32"
//         }
//       ],
//       "name": "documents",
//       "outputs": [
//         {
//           "internalType": "bytes32",
//           "name": "hash",
//           "type": "bytes32"
//         },
//         {
//           "internalType": "uint256",
//           "name": "timestamp",
//           "type": "uint256"
//         },
//         {
//           "internalType": "address",
//           "name": "owner",
//           "type": "address"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "bytes32",
//           "name": "fileHash",
//           "type": "bytes32"
//         }
//       ],
//       "name": "verifyFile",
//       "outputs": [
//         {
//           "internalType": "uint256",
//           "name": "",
//           "type": "uint256"
//         },
//         {
//           "internalType": "address",
//           "name": "",
//           "type": "address"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     }
//   ];

//   const connectContract = async () => {
//     // Ethers v6 uses window.ethereum directly
//     if (!window.ethereum) {
//       alert("Please install MetaMask!");
//       return;
//     }
//     const provider = new ethers.BrowserProvider(window.ethereum);
//     const signer = await provider.getSigner();
//     const contract = new ethers.Contract(contractAddress, contractABI, signer);
//     setContract(contract);
//   };

//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     const reader = new FileReader();
//     reader.onload = (event) => {
//       const content = event.target.result;
//       const hash = CryptoJS.SHA256(content).toString();
//       setFileHash(hash);
//     };
//     reader.readAsArrayBuffer(file);
//   };

//   const notarize = async () => {
//     if (contract && fileHash) {
//       try {
//         await contract.notarizeFile(fileHash);
//         alert("File notarized on blockchain!");
//       } catch (err) {
//         alert(`Error: ${err.message}`);
//       }
//     }
//   };

//   const verify = async () => {
//     if (contract && fileHash) {
//       try {
//         const [timestamp, owner] = await contract.verifyFile(fileHash);
//         if (timestamp != 0) {
//           setVerificationResult(`File notarized on ${new Date(timestamp * 1000)} by ${owner}`);
//         } else {
//           setVerificationResult("File not found on blockchain.");
//         }
//       } catch (err) {
//         alert(`Error: ${err.message}`);
//       }
//     }
//   };

//   return (
//     <div>
//       <h1>Proof-of-Existence Notary</h1>
//       <button onClick={connectContract}>Connect Contract</button>
//       <input type="file" onChange={handleFileUpload} />
//       <button onClick={notarize}>Notarize File</button>
//       <button onClick={verify}>Verify File</button>
//       <p>{verificationResult}</p>
//     </div>
//   );
// }

// export default App;





// 2nd time:there was some issue with "BrowserProvider was renamed to BrowserProvider in newer versions of Ethers.js (v6+)"
// import { useState } from "react";
// import { ethers } from "ethers";
// import CryptoJS from "crypto-js";

// function App() {
//   const [fileHash, setFileHash] = useState("");
//   const [contract, setContract] = useState(null);
//   const [verificationResult, setVerificationResult] = useState("");

//   // Replace with your contract address
//   const contractAddress = "0xfb7a5d0B78153167cbbEe671429C08D280f6aD0A";
//   const contractABI = [
//     {
//       "inputs": [
//         {
//           "internalType": "bytes32",
//           "name": "fileHash",
//           "type": "bytes32"
//         }
//       ],
//       "name": "notarizeFile",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "bytes32",
//           "name": "",
//           "type": "bytes32"
//         }
//       ],
//       "name": "documents",
//       "outputs": [
//         {
//           "internalType": "bytes32",
//           "name": "hash",
//           "type": "bytes32"
//         },
//         {
//           "internalType": "uint256",
//           "name": "timestamp",
//           "type": "uint256"
//         },
//         {
//           "internalType": "address",
//           "name": "owner",
//           "type": "address"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "bytes32",
//           "name": "fileHash",
//           "type": "bytes32"
//         }
//       ],
//       "name": "verifyFile",
//       "outputs": [
//         {
//           "internalType": "uint256",
//           "name": "",
//           "type": "uint256"
//         },
//         {
//           "internalType": "address",
//           "name": "",
//           "type": "address"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     }
//   ];

//   const connectContract = async () => {
//     const provider = new ethers.BrowserProvider(window.ethereum);
//     const signer = await provider.getSigner();
//     const contract = new ethers.Contract(contractAddress, contractABI, signer);
//     setContract(contract);
//   };

//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     const reader = new FileReader();
//     reader.onload = (event) => {
//       const content = event.target.result;
//       const hash = CryptoJS.SHA256(content).toString();
//       setFileHash(hash);
//     };
//     reader.readAsArrayBuffer(file);
//   };

//   const notarize = async () => {
//     if (contract && fileHash) {
//       await contract.notarizeFile(fileHash);
//       alert("File notarized on blockchain!");
//     }
//   };

//   const verify = async () => {
//     if (contract && fileHash) {
//       const [timestamp, owner] = await contract.verifyFile(fileHash);
//       if (timestamp != 0) {
//         setVerificationResult(`File notarized on ${new Date(timestamp * 1000)} by ${owner}`);
//       } else {
//         setVerificationResult("File not found on blockchain.");
//       }
//     }
//   };

//   return (
//     <div>
//       <h1>Proof-of-Existence Notary</h1>
//       <button onClick={connectContract}>Connect Contract</button>
//       <input type="file" onChange={handleFileUpload} />
//       <button onClick={notarize}>Notarize File</button>
//       <button onClick={verify}>Verify File</button>
//       <p>{verificationResult}</p>
//     </div>
//   );
// }

// export default App;





// 1st time:was given already  
// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
