// 2nd time:this is working well with 8th and 9th time of app.js 
import React from 'react';
import { createRoot } from 'react-dom/client';
import { ThirdwebProvider } from '@thirdweb-dev/react';
import { Sepolia } from '@thirdweb-dev/chains';
import App from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ThirdwebProvider 
      activeChain={Sepolia}
      clientId="6d612d1e9f38199cd6a995d9624b4a3b"
      supportedChains={[Sepolia]}
    >
      <App />
    </ThirdwebProvider>
  </React.StrictMode>
);

reportWebVitals();





//1st time:i have intergrated ifsp in this code but the problem is that the file hash isnt on blockchain and its only generating ipfs link which is working fine so in the above code im changing the blockchain part also
// import React from 'react';
// import { createRoot } from 'react-dom/client';
// import { ThirdwebProvider } from '@thirdweb-dev/react';
// import App from './App';
// import './index.css';
// import reportWebVitals from './reportWebVitals';


// const activeChain = "sepolia"; 

// const container = document.getElementById('root');
// const root = createRoot(container);

// root.render(
//   <React.StrictMode>
//     <ThirdwebProvider 
//       activeChain={activeChain}
//       clientId="6d612d1e9f38199cd6a995d9624b4a3b" // Optional (get from thirdweb dashboard)
//     >
//       <App />
//     </ThirdwebProvider>
//   </React.StrictMode>
// );

// // Web vitals reporting (optional)
// reportWebVitals();






// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
