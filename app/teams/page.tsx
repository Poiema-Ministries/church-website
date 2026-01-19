// Copyright 2025 Poiema Ministries. All Rights Reserved.

import type { Metadata } from 'next';
import { TeamMember } from '../common/types/models';
import { client } from '../../sanity/lib/client';
import { teamMembersQuery } from '../../sanity/lib/queries';
import TeamMemberItem from './team-member-item';
import ScrollableTeamSection from './scrollable-team-section';

// Disable caching for this page since team members update frequently
export const revalidate = 0;
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Meet Our Teams',
  description:
    'Meet the dedicated team members serving at Poiema Ministries. Our teams include Worship, Welcoming, Media, Outreach, and more, all working together to serve our community.',
  openGraph: {
    title: 'Meet Our Teams | Poiema Ministries',
    description:
      'Meet the dedicated team members serving at Poiema Ministries. Our teams include Worship, Welcoming, Media, Outreach, and more, all working together to serve our community.',
  },
};

// Team definitions with display names, query values, and descriptions
const TEAMS = [
  {
    displayName: 'Worship Team',
    queryValue: 'Worship',
    description:
      'The Worship Team leads our congregation in musical praise, using their God-given talents to honor and glorify our Lord. Through heartfelt worship, they create a sacred atmosphere that draws hearts closer to Christ.',
  },
  {
    displayName: 'Welcoming Team',
    queryValue: 'Welcoming',
    description:
      "The Welcoming Team provides a warm and hospitable first impression for visitors and new members, guiding them to our worship services each Sunday morning. They exemplify Christ's love through their genuine care and commitment to helping everyone feel valued and included in our church family.",
  },
  {
    displayName: "Heaven's Kitchen",
    queryValue: "Heaven's Kitchen",
    description:
      "Heaven's Kitchen ministers to our congregation by preparing and serving lunch following our worship services. This team demonstrates Christ's love through service, fostering fellowship and nurturing our community around the table.",
  },
  {
    displayName: 'Community Group Leaders',
    queryValue: 'Community Group',
    description:
      "Community Group Leaders facilitate discipleship and spiritual growth by organizing small group discussions that deepen understanding of God's Word. They cultivate meaningful relationships and create spaces for prayer, accountability, and Christian fellowship, with groups organized annually to support our members' faith journeys.",
  },
  {
    displayName: 'Media/Backstage Team',
    queryValue: 'Media',
    description:
      'The Media/Backstage Team ensures excellence in our worship services by managing all technical aspects, including audio, livestream, ProPresenter, photography, and videography. Through their dedicated service behind the scenes, they help remove distractions so our congregation can fully focus on worshiping and connecting with God.',
  },
  {
    displayName: 'Maintenance Team',
    queryValue: 'Maintenance',
    description:
      'The Maintenance Team serves faithfully by maintaining our church facilities, ensuring everything is clean, organized, and prepared for worship. Their commitment to stewardship honors God and creates a welcoming environment where our community can gather to grow in faith and fellowship.',
  },
  {
    displayName: 'Outreach Team',
    queryValue: 'Event',
    description:
      "The Outreach Team organizes events and initiatives that extend our ministry beyond our church walls, sharing the Gospel message with our broader community. They serve as ambassadors of Christ's love, demonstrating God's grace through service and creating opportunities for others to experience His transformative power.",
  },
] as const;

function filterMembersByTeam(
  members: TeamMember[],
  teamValue: string,
): TeamMember[] {
  return members.filter((member) => member.team?.includes(teamValue));
}

export default async function Teams() {
  const teamMembers: TeamMember[] = await client.fetch(teamMembersQuery);

  return (
    <div className='flex flex-col w-full min-h-screen gap-8 sm:gap-10 md:gap-12'>
      <div className='flex flex-col items-center md:items-start w-full max-w-xl px-4 sm:px-6 md:px-8'>
        <h1 className='text-4xl font-bold text-center mt-10'>Meet Our Teams</h1>
      </div>

      <div className='flex flex-col w-full gap-12 sm:gap-14 md:gap-16 px-4 sm:px-6 md:px-8 pb-8 sm:pb-10 md:pb-12'>
        {TEAMS.map((team) => {
          const members = filterMembersByTeam(teamMembers, team.queryValue);

          if (members.length === 0) {
            return null;
          }

          return (
            <div
              key={team.queryValue}
              className='flex flex-col w-full gap-6 sm:gap-8'
            >
              {/* Team Heading and Description */}
              <div className='flex flex-col gap-2 sm:gap-3 px-4 md:px-0 items-center md:items-start'>
                <h2 className='text-1xl sm:text-2xl md:text-3xl font-bold text-primary-black text-center md:text-left'>
                  {team.displayName}
                </h2>
                <p className='text-sm sm:text-base md:text-lg text-primary-black/80 leading-relaxed max-w-2xl text-center md:text-left'>
                  {team.description}
                </p>
              </div>

              {/* Horizontal Scrollable Grid - Shows ~2.5 members on mobile for bigger images */}
              <div className='px-4 md:px-0'>
                <ScrollableTeamSection>
                {members.map((member) => (
                  <div
                    key={member._id}
                    className='flex-shrink-0 w-[calc((100vw-4rem-2*1rem)/2.5)] sm:w-[calc((100vw-5rem-2*1.25rem)/2.5)] md:w-[calc((100vw-4rem-3*1.5rem)/4)] lg:w-[calc((100vw-4rem-3*2rem)/4)] xl:w-80 snap-start'
                  >
                    <TeamMemberItem teamMember={member} />
                  </div>
                ))}
                </ScrollableTeamSection>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
