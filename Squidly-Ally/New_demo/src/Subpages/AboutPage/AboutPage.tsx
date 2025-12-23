import React from "react";
import HeroAbout from "./HeroAbout";
import TeamSection from "./teamsection";
import AutoScrollTags from "./AutoScrollTags";
import QuoteBillboard from "./QuoteBillboard";
import WhoWeSupportSection from "./WhoWeSupportSection";
import StatsSection from "./StatsSection";
import WhatWeDoSection from "./WhatWeDoSection";
import MissionImpactSection from "./MissionImpactSection";

const AboutPage: React.FC = () => {
  return (
    <main className="min-h-screen">
      <HeroAbout />
      <WhoWeSupportSection />
      <StatsSection />
      <WhatWeDoSection />
      <MissionImpactSection />
        <QuoteBillboard

            rightY="-1rem"
        />
        <AutoScrollTags
            items={[
                "Engineering",
                "Business Development",
                "Information technology",
                "Product Management",
            ]}
            duration={28}                 // 整个循环耗时(秒)，数值越小越快
            direction="left"              // 'left' 或 'right'
            size="text-5xl md:text-7xl"   // 调整字号
            gap="gap-20"                  // 词之间间距：gap-10/gap-16/gap-24...
            color="text-neutral-400/80"   // 颜色/透明度
            className="my-6"              // 外部上下间距
        />
        <TeamSection />
    </main>
  );
};

export default AboutPage;
