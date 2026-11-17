"use client";

import { useState } from "react";
import Image from "next/image";
import { Mail, Globe } from "lucide-react";
import type { TeamMember } from "@/types/public";

interface TeamMemberCardProps {
  member: TeamMember;
}

export function TeamMemberCard({ member }: TeamMemberCardProps) {
  const [imgSrc, setImgSrc] = useState(
    member.avatar || member.image || "/images/placeholders/team-1.jpg"
  );

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/90 bg-white/90 shadow-card card-hover-effect">
      {/* Portrait Photo Container */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-surface">
        <Image
          src={imgSrc}
          alt={member.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          onError={() => setImgSrc("/images/placeholders/team-1.jpg")}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Member Name and Role Overlay */}
        <div className="absolute bottom-4 inset-x-4 z-10 text-white">
          <span className="inline-block rounded-full bg-primary/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-xs backdrop-blur-xs mb-1">
            {member.role}
          </span>
          <h3 className="text-xl font-extrabold tracking-tight text-white leading-snug">
            {member.name}
          </h3>
        </div>
      </div>

      {/* Bio and Social Links */}
      <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed flex-1">
          {member.bio}
        </p>

        {member.social && (
          <div className="mt-5 flex items-center justify-between border-t border-border/80 pt-4">
            <span className="text-xs font-medium text-neutral">Leadership Connect</span>
            <div className="flex items-center gap-2">
              {member.social.linkedin && (
                <a
                  href={member.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-xl bg-surface text-text-secondary transition-all duration-200 hover:bg-primary hover:text-white"
                  aria-label={`${member.name} LinkedIn Profile`}
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64a1.66 1.66 0 1 0 0 3.32 1.66 1.66 0 0 0 0-3.32Z" />
                  </svg>
                </a>
              )}
              {member.social.email && (
                <a
                  href={`mailto:${member.social.email}`}
                  className="flex h-8 w-8 items-center justify-center rounded-xl bg-surface text-text-secondary transition-all duration-200 hover:bg-primary hover:text-white"
                  aria-label={`Email ${member.name}`}
                >
                  <Mail className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
