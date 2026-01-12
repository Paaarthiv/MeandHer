import React from 'react';
import Hero from './components/Hero';
import Story from './components/Story';
import Gallery from './components/Gallery';
import Moments from './components/Moments';
import { Quote, Footer } from './components/Ending';
import MusicPlayer from './components/MusicPlayer';

function App() {
  return (
    <div className="app-container">
      <MusicPlayer />
      <Hero />
      <Story />
      <Moments />
      <Gallery />
      <Quote />
      <Footer />
    </div>
  );
}

export default App;
