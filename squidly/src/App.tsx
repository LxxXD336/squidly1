// src/App.tsx
import './index.css'
import HeroVideoCall from './hero'   // 你现在的文件名是 hero.tsx
import HoverNav from "./HoverNav";
import VideoTextSection from './VideoTextSection';
import ImageCompareSection from './ImageCompareSection';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start">
      <HoverNav />
      <HeroVideoCall />
      <VideoTextSection />
      <ImageCompareSection />
      
    </div>
  )
}
