import React, { useEffect } from 'react';
import Weathers from './components/Weathers'
function App() {
  useEffect(() => {
    document.title = "Forecastly";
}, []);
  return (
    <div className="App">
        <Weathers/>
    </div>
  );
}

export default App;
