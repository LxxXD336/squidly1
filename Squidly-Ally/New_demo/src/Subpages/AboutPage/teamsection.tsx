import React from "react";

const DEFAULT_IMG =
    "https://acorn.works/wp-content/uploads/2023/08/team-building-leadership.jpg";
const DEFAULT_LEAD =
    "We are a multidisciplinary team of engineers, designers, and researchers who believe in meaningful access to communication. Every feature is built with empathy, informed by lived experiences, and refined in collaboration with our community.";

export default function TeamSection({
                                        title = "Meet the Team",
                                        lead = DEFAULT_LEAD,
                                        imageSrc = DEFAULT_IMG,
                                        imageAlt = "Group photo of the team"
                                    }) {
    return (
        <section aria-labelledby="team-title" className="relative py-16 sm:py-20 lg:py-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid items-center gap-12 lg:grid-cols-12">
                    <div className="order-2 lg:order-1 lg:col-span-7">
                        <div className="relative overflow-hidden rounded-3xl shadow-2xl ring-1 ring-black/10">
                            <img
                                src={imageSrc}
                                alt={imageAlt}
                                className="h-[360px] w-full object-cover sm:h-[480px] lg:h-[640px]"
                                loading="lazy"
                            />
                        </div>
                    </div>

                    <div className="order-1 lg:order-2 lg:col-span-5">
                        <h2
                            id="team-title"
                            className="font-semibold tracking-tight text-5xl sm:text-6xl md:text-7xl lg:text-8xl"
                        >
                            {title}
                        </h2>
                        <p className="mt-10 text-xl sm:text-2xl leading-relaxed text-black/80">
                            {lead}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
