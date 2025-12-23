// App.tsx
'use client';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import GlobalBackground from './components/GlobalBackground';
import NavBar from './components/NavBar';
import AccessibilityButton from "./components/accessibility/AccessibilityButton";
import AccInlineMagnifier from "./components/accessibility/features/AccMagnifier";
import AccMagnifierLite from "./components/AccMagnifierUltra";

import SquidlyHero from './components/SquidlyHero';
import  BrowserSection  from './components/BrowserSection';
import StepsSection from './components/StepsSection';
import VideoTextSection from './components/VideoTextSection';
import TestimonialsSection from './components/TestimonialsSection';
import ImageCompareSection from './components/ImageCompareSection';
import PrivacySection from './components/PrivacySection';
import FooterinfoSection from './components/FooterInfoSection';
import TrySquidlySection from './components/TrySquidlySection';
import NewsletterModal from "./components/NewsletterModal";
// 新建的定价页组件（我已放在 Canvas）
import PricingPage from './Subpages/PricePage';
import ContactPage from './Subpages/ContactPage';
import WhyChooseSquidlySection from './components/WhyChooseSquidlySection';
import TrustedBySection from './components/TrustedBySection';
import AboutPage from './Subpages/AboutPage/AboutPage';
import FeaturePage from './Subpages/FeaturePage/FeaturePage';
import ProductPage from './Subpages/ProductPage/ProductPage';

function Home() {
    return (
        <>

            <NewsletterModal />
            {/* 给锚点留ID，NavBar的 /#product /#modes /#contact 会滚动到这里 */}

            <div id="product">
                <SquidlyHero />
                <BrowserSection />
            </div>
            <TrustedBySection />
            <div id="modes">
                <ImageCompareSection />
            </div>
            <VideoTextSection />
            <TestimonialsSection />
            <WhyChooseSquidlySection />
            <StepsSection />
            <PrivacySection />
            <div id="contact">{/* 你后面可以塞联系表单/页脚 */}</div>


            <div id="contact"></div>

        </>
    );
}

export default function App() {
    return (
        <div className="min-h-screen relative">
            <BrowserRouter>
                <NavBar />
                <AccessibilityButton /> {/* ✅ 全站可见 */}
                <AccMagnifierLite/>

                <div className="pt-20"></div>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/pricing" element={<PricingPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/feature" element={<FeaturePage />} />
                    <Route path="/product" element={<ProductPage />} />
                </Routes>
            </BrowserRouter>
            <TrySquidlySection />
            <FooterinfoSection />
        </div>
    );
}