'use client';

import { Link, NavLink } from 'react-router-dom';

/**
 * NavBar — extracted from SquidlyHero style, standalone & sticky
 * - Uses the same visual language (brand left, center links, CTA right)
 * - Pricing goes to /pricing (react-router-dom)
 * - Other links point to home anchors (/#product etc.)
 */
export default function NavBar() {
    return (
        <header className="fixed inset-x-0 top-0 z-50">
            <div className="mx-auto max-w-7xl px-6">
                <div className="mt-3 rounded-2xl bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/55 ring-1 ring-black/5 shadow-[0_8px_30px_rgba(2,8,23,.06)]">
                    <div className="h-14 px-4 flex items-center justify-between">
                        {/* Brand */}
                        <Link to="/" className="text-[20px] font-extrabold tracking-tight text-slate-900">Squidly</Link>

                        {/* Links */}
                        <nav className="hidden md:flex items-center gap-8 text-[15px] text-slate-700">
                            <NavLink
                                to="/pricing"
                                className={({ isActive }) =>
                                    `transition-colors ${isActive ? 'text-[#6F57FF] font-semibold' : ''}`
                                }
                            >
                                Pricing
                            </NavLink>
                            <NavLink
                                to="/contact"
                                className={({ isActive }) =>
                                    `transition-colors ${isActive ? 'text-[#6F57FF] font-semibold' : ''}`
                                }
                            >
                                Contact
                            </NavLink>
                            <NavLink
                                to="/about"
                                className={({ isActive }) =>
                                    `transition-colors ${isActive ? 'text-[#6F57FF] font-semibold' : ''}`
                                }
                            >
                                About
                            </NavLink>
                            <NavLink
                                to="/feature"
                                className={({ isActive }) =>
                                    `transition-colors ${isActive ? 'text-[#6F57FF] font-semibold' : ''}`
                                }
                            >
                                Feature
                            </NavLink>
                            <NavLink
                                to="/product"
                                className={({ isActive }) =>
                                    `transition-colors ${isActive ? 'text-[#6F57FF] font-semibold' : ''}`
                                }
                            >
                                Product
                            </NavLink>
                        </nav>

                        {/* CTA */}
                        <a
                            href="/#book"
                            className="rounded-full bg-[#BFD2FF] text-[#1e40af] px-5 h-10 inline-grid place-items-center font-semibold"
                        >
                            Book a call
                        </a>
                    </div>
                </div>
            </div>
        </header>
    );
}
