import React from 'react';

const steps = [
  {
    step: 1,
    title: 'Use Firefox Browser',
    description: 'This application currently works best on  <a href="https://www.mozilla.org/firefox/" target="_blank" rel="noopener noreferrer">Firefox</a>',
    link: '',
    linkText: ''
  },
  {
    step: 2,
    title: 'Install MetaMask',
    description: '<a href="https://metamask.io/download" target="_blank" rel="noopener noreferrer">Install MetaMask</a> to connect your Sepolia wallet',
    link: '',
    linkText: ''
  },
  {
    step: 3,
    title: 'Change to Sepolia Test Network',
    description: 'Open the extension and click the top left icon (Select a network). Scroll all the way down to the bottom and toggle over "Show test networks" and click on Sepolia',
  },
  {
    step: 4,
    title: 'Get Sepolia ETH',
    description: 'Copy your account address from the top of your MetaMask extension (like 0xd3....). <a href="https://sepolia-faucet.pk910.de/" target="_blank" rel="noopener noreferrer">Use a Sepolia faucet</a> to obtain testnet Sepolia ETH which will allow you to save your ideas to the blockchain',
    link: '',
    linkText: ''
  },
  {
    step: 5,
    title: 'Start Using TimeStamp',
    description: 'You\'re all set start using TimeStamp!',
  },
  
];

const HowToUse: React.FC = () => {
  return (
    <div className="container py-5" style={{ marginLeft: '40px' }}>
      <h1 style={{ color: '#043264', fontSize: '2.5rem' }}>How to Use TimeProof</h1>
      <div className="d-flex flex-column align-items-start text-start">
        {steps.map(({ step, title, description }) => (
          <div key={step} style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <div
                style={{
                  backgroundColor: '#043264',
                  color: '#fff',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  marginRight: '20px',
                  flexShrink: 0,
                  fontSize: '1.25rem',
                  marginTop: '20px',
                }}
              >
                {step}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#043264' }}>{title}:</div>
                  <div dangerouslySetInnerHTML={{ __html: description }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowToUse;
