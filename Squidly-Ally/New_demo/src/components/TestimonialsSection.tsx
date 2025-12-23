'use client';

import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

/**
 * Testimonials — Left image + Right auto vertical scroller
 * 右侧列自动上下滚动（hover 暂停）；左侧由原“视频卡片”改为“图片卡片”
 */

const ACCENT = '#6F57FF';

// ⬇️ 把这张图换成你项目里的实际路径（保持 object-contain/cover 效果都可以）
import leftImage from '../Photo/disable.png'; // ← 改成你的图片，如 ../../Photo/clients.jpg

// 右侧滚动卡片的数据（保持你原来的）
const TESTIMONIALS = [
  {
    type: 'comment',
    quote:
      "I know that no matter what happens, my classmate will always be here at the end of the day, and I feel safe learning together.",
    name: 'Fuad Ferdous',
    role: 'Student',
    avatar: '/images/avatars/fuad.jpg',
  },
  {
    type: 'comment',
    quote:
      "Started using Squidly yesterday and I'm blown away. Engaging, accessible, and inclusive for all my students.",
    name: 'Gabrielle Fisher',
    role: 'Special Ed Teacher',
    avatar: '/images/avatars/gabrielle.jpg',
  },
  {
    type: 'comment',
    quote:
      'Squidly opens up a whole new world of communication and access for people with complex needs.',
    name: 'Dr Annemarie Murphy',
    role: 'Senior Speech Pathologist',
    avatar: '/images/avatars/annemarie.jpg',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="relative mx-auto max-w-[1200px] px-6 py-20 lg:py-28">
      {/* Heading（按你截图文案） */}
      <div className="mx-auto max-w-4xl">
        <h2 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight text-[#1b1f27]">
          Loved by providers
          <br className="hidden sm:block" /> and their clients
        </h2>
        <p className="mt-3 text-[17px] leading-7 text-slate-600">
          Real voices from Clients, students and families
        </p>
      </div>

      {/* Grid: 左大右窄；右侧为滚动列 */}
      <div className="mt-10 grid gap-6 lg:grid-cols-3 lg:grid-rows-2">
        {/* 左侧图片：占 2x2（由原 VideoCard 改为 ImageCard） */}
        <ImageCard
          src={leftImage as unknown as string}
          alt="Clients and clinicians using Squidly"
          className="lg:col-span-2 lg:row-span-2"
        />

        {/* 右侧自动上下滚动列（占两行） —— 保持不变 */}
        <RightColumnScroller items={TESTIMONIALS} />
      </div>

      {/* 滚动动画 keyframes + hover 暂停 */}
      <style>{`
        @keyframes squidly-vscroll {
          0%   { transform: translateY(0); }
          100% { transform: translateY(-50%); } /* 列表复制两份后滚动一半实现无缝 */
        }
        .squidly-scroller:hover .squidly-auto-scroll {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}

/* ---------------- Left image card ---------------- */

function ImageCard({
  src,
  alt,
  className = '',
}: {
  src: string;
  alt?: string;
  className?: string;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0% -10% 0%' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`group relative overflow-hidden rounded-[44px] bg-white ring-1 ring-slate-200/80 shadow-[0_24px_60px_rgba(18,18,23,.06)] ${className}`}
      style={{ borderBottomLeftRadius: '160px' }}
    >
      <div className="absolute inset-0">
        <img
          src={src}
          alt={alt || 'Testimonials'}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>
      {/* 用占位 div 维持高度（与原视频卡一致） */}
      <div className="invisible h-[320px] lg:h-[520px]" />
    </motion.article>
  );
}

/* ---------------- Right auto-scroller ---------------- */

function RightColumnScroller({
  items,
}: {
  items: Array<{ quote: string; name: string; role: string; avatar?: string }>;
}) {
  // 复制一份，实现无缝循环
  const LOOP = [...items, ...items];

  // 展示高度：两张卡 + 间距（按视觉需要微调）
  const containerHeight = '600px';

  return (
    <div className="lg:col-span-1 lg:row-span-2">
      <div
        className="squidly-scroller relative overflow-hidden group"
        style={{ height: containerHeight, borderRadius: 0 }}
      >
        <motion.div
          className="squidly-auto-scroll flex flex-col gap-6 will-change-transform"
          style={{ animation: `squidly-vscroll 26s linear infinite alternate` }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.animationPlayState = 'paused';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.animationPlayState = 'running';
          }}
        >
          {LOOP.map((t, i) => (
            <CommentCard key={i} {...(t as any)} />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

/* ---------------- Cards ---------------- */

function CommentCard({
  quote,
  name,
  role,
  avatar,
}: {
  quote: string;
  name: string;
  role: string;
  avatar?: string;
}) {
  return (
    <article
      className="relative overflow-hidden rounded-[28px] ring-1 ring-[#D9CBFF]"
      style={{
        background: 'linear-gradient(180deg, #F6F0FF 0%, #E6D6FF 55%, #D9C7FF 100%)',
      }}
    >
      <div className="px-7 pb-8 pt-6">
        <Quote className="h-6 w-6" color={ACCENT} />
        <p className="mt-2 text-[18px] leading-8 text-[#1A1E27]">{quote}</p>

        <div className="mt-6 flex items-center gap-3">
          {avatar ? (
            <img src={avatar} alt={name} className="h-10 w-10 rounded-full object-cover" />
          ) : null}
          <div>
            <p className="text-[15px] font-semibold" style={{ color: ACCENT }}>
              {name}
            </p>
            <p className="text-[14px] text-slate-500">{role}</p>
          </div>
        </div>
      </div>
    </article>
  );
}
