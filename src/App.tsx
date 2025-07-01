import './App.css';
import Landing from './components/Landing';
import Submit from './components/Submit';
import Verify from './components/Verify';
import Header from './components/Header';
import CursorHalo from './components/CursorHalo';
import HowToUse from './components/HowToUse';

function App() {

  return (
    <div className="background-particles">
      <CursorHalo />
      <Header />
      <div id="landing"><Landing /></div>
      <HowToUse />
      <div id="submit"><Submit /></div>
      <div id="verify"><Verify /></div>
    </div>
  );
}

export default App;