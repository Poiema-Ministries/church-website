// Copyright 2025 Poiema Ministries. All Rights Reserved.

import { TeamMember } from '../common/types/models';
import { client } from '../../sanity/lib/client';
import { teamMembersQuery } from '../../sanity/lib/queries';
import TeamMemberItem from './team-member-item';

// Disable caching for this page since team members update frequently
export const revalidate = 0;
export const dynamic = 'force-dynamic';

// Team definitions with display names and query values
const TEAMS = [
  { displayName: 'Worship Team', queryValue: 'Worship' },
  { displayName: 'Welcoming Team', queryValue: 'Welcoming' },
  { displayName: "Heaven's Kitchen", queryValue: "Heaven's Kitchen" },
  { displayName: 'Community Group Leaders', queryValue: 'Community Group' },
  { displayName: 'Media Team', queryValue: 'Media' },
  { displayName: 'Maintenance Team', queryValue: 'Maintenance' },
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
      <div className='flex flex-col items-start w-full max-w-xl px-4 sm:px-6 md:px-8'>
        <h1 className='text-4xl font-bold text-center mt-10 px-4 md:px-0'>
          Meet Our Teams
        </h1>
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
              {/* Team Heading */}
              <h2 className='text-1xl sm:text-2xl md:text-3xl font-bold text-primary-black px-4 md:px-0'>
                {team.displayName}
              </h2>

              {/* Horizontal Scrollable Grid - Shows 4 members at a time */}
              <div className='w-full overflow-x-auto overflow-y-hidden scrollbar-hide pb-2'>
                <div className='flex gap-4 sm:gap-6 md:gap-8 w-max'>
                  {members.map((member) => (
                    <div
                      key={member._id}
                      className='flex-shrink-0 w-[calc((100vw-2rem-3*1rem)/4)] sm:w-[calc((100vw-4rem-3*1.5rem)/4)] md:w-[calc((100vw-8rem-3*2rem)/4)] xl:w-64'
                    >
                      <TeamMemberItem teamMember={member} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
