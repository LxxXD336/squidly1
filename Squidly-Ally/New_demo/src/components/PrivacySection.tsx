'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, UserCheck, Headphones, BadgeCheck, Lock } from 'lucide-react';

/**
 * PrivacySection
 * -------------------------------------------------------------
 * A four‑card "Privacy & Safety" block styled to match the
 * visual language of your StepsSection (violet accents, rings,
 * soft shadows, rounded corners, subtle motion).
 *
 * Drop this component anywhere in your page below the hero or
 * StepsSection.
 */
export default function PrivacySection() {
    const items = [
        {
            title: 'Trained and verified workers',
            body:
                'All workers undergo thorough checks (NDIS & police screenings) and maintain first‑aid/CPR certifications. They receive ongoing training to deliver the best support.',
            Icon: UserCheck,
        },
        {
            title: 'Dedicated customer support teams',
            body:
                'Our team provides timely help whenever you need it. We monitor and respond to incident reports 24/7 so issues are addressed with care and attention.',
            Icon: Headphones,
        },
        {
            title: 'Comprehensive insurance with every booking',
            body:
                'Every booking is covered by comprehensive insurance, including Workers Compensation, Medical Malpractice, and General & Products Liability.',
            Icon: BadgeCheck,
        },
        {
            title: 'We take your privacy and data security seriously',
            body:
                'Your data is protected using modern encryption, access controls, and robust policies and procedures. We continually review and improve our safeguards.',
            Icon: Lock,
        },
    ];

    return (
        <section className="relative mx-auto max-w-[1200px] px-6 py-20 lg:py-28">
            {/* Top headings */}
            <div className="text-center max-w-3xl mx-auto">
                <span className="inline-block rounded-full bg-[#F1EDFF] px-3 py-1 text-xs font-semibold text-[#6F57FF] ring-1 ring-[#E3DDFF]">Quality & safety</span>
                <h2 className="mt-4 text-4xl md:text-5xl font-extrabold leading-tight tracking-tight text-[#2A2F3A]">
                    Your privacy is our priority
                </h2>
                <p className="mt-3 text-[17px] leading-7 text-slate-600">
                    We maintain rigorous standards so your support is delivered safely — and your information stays protected.
                </p>
            </div>

            {/* Card grid */}
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {items.map(({ title, body, Icon }, idx) => (
                    <motion.article
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-10% 0% -10% 0%' }}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                        className="group relative overflow-hidden rounded-[20px] bg-white ring-1 ring-violet-200 shadow-[0_20px_60px_rgba(122,59,255,.10)] hover:shadow-[0_28px_80px_rgba(122,59,255,.18)] p-6"
                    >
                        {/* Accent blob / glow */}
                        <div
                            aria-hidden
                            className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-gradient-to-br from-violet-300/30 to-fuchsia-300/20 blur-2xl"
                        />

                        {/* Icon bubble */}
                        <div className="inline-grid place-items-center h-12 w-12 rounded-xl bg-[#6F57FF] shadow-[0_12px_28px_rgba(111,87,255,.32)] ring-1 ring-violet-300/60">
                            <Icon className="h-6 w-6 text-white" aria-hidden />
                        </div>

                        <h3 className="mt-4 text-[20px] font-semibold leading-snug text-neutral-900">{title}</h3>
                        <p className="mt-2 text-[15px] leading-7 text-neutral-700/90">{body}</p>

                        {/* Bottom bar accent to echo StepsSection */}
                        <div className="mt-5 h-1.5 w-24 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500" />
                    </motion.article>
                ))}
            </div>
        </section>
    );
}
