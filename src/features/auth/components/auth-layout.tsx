"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ShieldCheck,
  Users,
  Sparkles,
  HeartHandshake,
  CheckCircle2,
  Star,
} from "lucide-react";

import signUpImges from "../../../../public/images/placeholders/images.jpg"
import Image from "next/image";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({
  children,
  title,
  subtitle,
}: AuthLayoutProps) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#EAE6F7] px-4 py-6 sm:px-6 sm:py-10 lg:px-8">

      {/* Background Decorations */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#8B7CF6]/20 blur-[100px]" />

      <div className="pointer-events-none absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-[#B5A9FF]/30 blur-[110px]" />

      <div className="pointer-events-none absolute right-[12%] top-[12%] h-5 w-5 rounded-full bg-[#7561F5] shadow-xl shadow-[#7561F5]/30" />

      <div className="pointer-events-none absolute bottom-[10%] left-[10%] h-7 w-7 rounded-full bg-white/80 shadow-xl shadow-[#7561F5]/10" />

      {/* Main Authentication Card */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1100px] flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_30px_90px_-25px_rgba(63,45,150,0.25)] lg:min-h-[680px] lg:flex-row">

        {/* ========================================= */}
        {/* LEFT SIDE - AUTHENTICATION FORM */}
        {/* ========================================= */}

        <section className="relative flex flex-1 flex-col justify-between bg-white p-6 sm:p-10 lg:w-1/2 lg:p-12 xl:p-14">

          {/* Header */}
          <div className="flex items-center justify-between gap-3">

            {/* Logo */}
            <Link
              href="/"
              className="group flex items-center gap-2.5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#7561F5] to-[#5136DC] text-white shadow-lg shadow-[#7561F5]/30 transition-transform duration-300 group-hover:scale-105">
                <span className="text-sm font-black tracking-tight">
                  BD
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-lg font-extrabold tracking-tight text-gray-900">
                  BDSisters<span className="text-[#7561F5]">.org</span>
                </span>

                <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#8275D9]">
                  Sisterhood Network
                </span>
              </div>
            </Link>

            {/* Back Button */}
            <Link
              href="/"
              className="group inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#F5F3FF] px-3.5 py-2 text-[11px] font-semibold text-[#7164BA] transition-all duration-200 hover:bg-[#EDE9FF] hover:text-[#5B46F6]"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span className="hidden sm:inline">Back to website</span>
              <span className="sm:hidden">Back</span>
            </Link>
          </div>

          {/* Form Content */}
          <div className="mx-auto my-auto w-full max-w-[390px] py-10 lg:py-12">

            {/* Heading */}
            <div className="mb-8">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#F1EEFF] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#7561F5]">
                <Sparkles className="h-3 w-3" />
                Welcome to BDSisters
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-[34px]">
                {title}
              </h1>

              <p className="mt-2.5 text-sm leading-6 text-gray-500">
                {subtitle}
              </p>
            </div>

            {/* Existing Login / Register Form */}
            {children}

          </div>

          {/* Footer */}
          <div className="pt-5">

            <p className="text-center text-[10px] leading-5 text-gray-400 lg:text-left">
              Chartered by{" "}
              <strong className="font-bold text-gray-600">
                Muhsina Organization
              </strong>
              . Dedicated to the advancement of Bangladeshi women globally.
            </p>

            <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[10px] font-medium text-gray-400 lg:justify-start">

              <Link
                href="/privacy"
                className="transition-colors hover:text-[#7561F5]"
              >
                Privacy Policy
              </Link>

              <span className="text-gray-300">•</span>

              <Link
                href="/terms"
                className="transition-colors hover:text-[#7561F5]"
              >
                Terms of Service
              </Link>

              <span className="text-gray-300">•</span>

              <Link
                href="/contact"
                className="transition-colors hover:text-[#7561F5]"
              >
                Contact Support
              </Link>

            </div>
          </div>
        </section>

        {/* ========================================= */}
        {/* RIGHT SIDE - VISUAL SHOWCASE */}
        {/* ========================================= */}

        <section className="relative hidden flex-1 flex-col justify-between overflow-hidden bg-gradient-to-br from-[#7965FA] via-[#654BEF] to-[#4226CB] p-10 text-white lg:flex lg:w-1/2 xl:p-12">

          {/* Decorative Background Elements */}
          <div className="pointer-events-none absolute -right-32 -top-32 h-[450px] w-[450px] rounded-full bg-white/[0.09] blur-3xl" />

          <div className="pointer-events-none absolute -bottom-40 -left-32 h-[450px] w-[450px] rounded-full bg-[#A99AFF]/30 blur-3xl" />

          <div className="pointer-events-none absolute right-10 top-1/3 h-64 w-64 rounded-full bg-[#9C8BFF]/20 blur-[80px]" />

          {/* Decorative Circles */}
          <div className="pointer-events-none absolute right-12 top-16 h-32 w-32 rounded-full bg-white/[0.05]" />

          <div className="pointer-events-none absolute bottom-28 left-10 h-24 w-24 rounded-full bg-white/[0.06]" />

          {/* Top Content */}
          <div className="relative z-10 flex items-center justify-between gap-3">

            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-[10px] font-bold tracking-wide text-white shadow-lg shadow-[#3720AD]/10 backdrop-blur-xl">
              <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
              A Community That Empowers
            </div>

            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-white/85">
              <ShieldCheck className="h-4 w-4 text-emerald-300" />
              Safe Community
            </div>

          </div>

          {/* Center Showcase */}
          <div className="relative z-10 my-auto py-10">

            {/* Main Visual Card */}
            <div className="relative mx-auto max-w-[390px]">

              {/* Floating Decoration */}
              <div className="absolute -left-5 top-[35%] z-20 flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-xl shadow-[#2D1B9D]/20">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              </div>

              <div className="absolute -right-4 top-10 z-20 h-16 w-16 rounded-2xl bg-white/15 shadow-xl shadow-[#2D1B9D]/10 backdrop-blur-xl" />

              {/* Image Container */}
              <div className="relative mx-auto h-[290px] w-full max-w-[340px] overflow-hidden rounded-[30px] bg-white/15 p-3 shadow-2xl shadow-[#24128B]/30 backdrop-blur-sm">

                <div className="relative h-full w-full overflow-hidden rounded-[23px] bg-gradient-to-br from-[#B6A8FF] to-[#7861F4]">

                  {/* Main Image */}
                  <Image
                    src={signUpImges}
                    alt="Professional woman representing the BDSisters community"
                    width={400}
                    height={400}
                    className="h-full w-full object-cover object-center"
                  />

                  {/* Image Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#28146F]/60 via-transparent to-transparent" />

                  {/* Floating Label */}
                  <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/20 p-3 shadow-xl shadow-black/10 backdrop-blur-xl">
                    <div className="flex items-center gap-2.5">

                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#654BEF] shadow-md">
                        <HeartHandshake className="h-5 w-5" />
                      </div>

                      <div>
                        <p className="text-xs font-bold text-white">
                          Together We Grow
                        </p>

                        <p className="text-[10px] text-white/80">
                          Connect. Empower. Inspire.
                        </p>
                      </div>

                    </div>
                  </div>

                </div>
              </div>

              {/* Floating Notification */}
              <div className="absolute -bottom-5 -right-2 z-20 flex items-center gap-2.5 rounded-2xl bg-white px-4 py-3 shadow-2xl shadow-[#24128B]/25 sm:-right-8">

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                </div>

                <div>
                  <p className="text-xs font-bold text-gray-900">
                    You're Welcome Here!
                  </p>

                  <p className="text-[10px] text-gray-500">
                    Your journey starts today.
                  </p>
                </div>

              </div>
            </div>

            {/* Heading */}
            <div className="mx-auto mt-12 max-w-md text-center">

              <h2 className="text-2xl font-extrabold leading-tight tracking-tight text-white xl:text-3xl">
                A Stronger Sisterhood.
                <br />
                A Brighter Future.
              </h2>

              <p className="mx-auto mt-3 max-w-sm text-xs leading-6 text-white/75">
                Discover opportunities, build meaningful connections,
                grow your business, and become part of a community
                that believes in your potential.
              </p>

            </div>

            {/* Impact Stats */}
            <div className="mx-auto mt-8 grid max-w-md grid-cols-3 gap-3">

              <div className="rounded-2xl bg-white/10 p-3 text-center shadow-lg shadow-[#2D1B9D]/10 backdrop-blur-xl">
                <Users className="mx-auto mb-2 h-5 w-5 text-white/90" />

                <p className="text-lg font-extrabold text-white">
                  50K+
                </p>

                <p className="text-[10px] font-medium text-white/65">
                  Sisters
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-3 text-center shadow-lg shadow-[#2D1B9D]/10 backdrop-blur-xl">
                <HeartHandshake className="mx-auto mb-2 h-5 w-5 text-white/90" />

                <p className="text-lg font-extrabold text-white">
                  64
                </p>

                <p className="text-[10px] font-medium text-white/65">
                  Districts
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-3 text-center shadow-lg shadow-[#2D1B9D]/10 backdrop-blur-xl">
                <Sparkles className="mx-auto mb-2 h-5 w-5 text-white/90" />

                <p className="text-lg font-extrabold text-white">
                  1.2K+
                </p>

                <p className="text-[10px] font-medium text-white/65">
                  Businesses
                </p>
              </div>

            </div>
          </div>

          {/* Bottom Footer */}
          <div className="relative z-10 flex items-center justify-between gap-3 text-[10px] font-medium text-white/65">
            <span>Safe · Respectful · Transformative</span>

            <span>
              © {new Date().getFullYear()} BDSisters.org
            </span>
          </div>

        </section>
      </div>
    </main>
  );
}