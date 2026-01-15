import { prisma } from '@/lib/db'
import { createClient } from '@/lib/supabase/server'
import { formatClassName } from '@/lib/utils/format'
import Link from 'next/link'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const athlete = await prisma.athlete.findFirst({
    where: { supabaseUserId: user?.id },
    include: {
      school: true,
      sport: true,
    },
  })

  if (!athlete) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
          <h1 className="text-xl font-medium text-slate-900 mb-2">Complete Your Profile</h1>
          <p className="text-slate-500 mb-6">
            Set up your athlete profile to get started with NIL tracking.
          </p>
          <Link
            href="/profile/edit"
            className="inline-block px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
          >
            Set Up Profile
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Your Profile</h1>
        <Link
          href="/profile/edit"
          className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200"
        >
          Edit Profile
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-800 to-slate-700">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-slate-600 rounded-full flex items-center justify-center text-3xl text-white font-bold">
              {athlete.firstName[0]}{athlete.lastName[0]}
            </div>
            <div className="text-white">
              <h2 className="text-2xl font-bold">
                {athlete.firstName} {athlete.lastName}
              </h2>
              <p className="text-slate-300">
                {athlete.sport?.name} • {athlete.school?.shortName}
              </p>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div>
            <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-3">
              Basic Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <InfoItem label="Email" value={athlete.email} />
              <InfoItem label="Class Year" value={formatClassName(athlete.classYear)} />
              <InfoItem label="Position" value={athlete.position || 'Not specified'} />
              <InfoItem label="Jersey Number" value={athlete.jerseyNumber || 'Not specified'} />
            </div>
          </div>

          {/* School Info */}
          <div>
            <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-3">
              School Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <InfoItem label="School" value={athlete.school?.name || 'Not specified'} />
              <InfoItem label="Sport" value={athlete.sport?.name || 'Not specified'} />
              <InfoItem label="Eligibility" value={athlete.eligibilityStatus} />
              <InfoItem
                label="International Student"
                value={athlete.isInternationalStudent ? 'Yes' : 'No'}
              />
            </div>
          </div>

          {/* Social Handles */}
          <div>
            <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-3">
              Social Media
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <SocialHandle
                platform="Instagram"
                handle={(athlete.socialHandles as Record<string, string>)?.instagram}
              />
              <SocialHandle
                platform="Twitter/X"
                handle={(athlete.socialHandles as Record<string, string>)?.twitter}
              />
              <SocialHandle
                platform="TikTok"
                handle={(athlete.socialHandles as Record<string, string>)?.tiktok}
              />
            </div>
          </div>

          {/* Open To */}
          {athlete.openTo && athlete.openTo.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-3">
                Open To
              </h3>
              <div className="flex flex-wrap gap-2">
                {athlete.openTo.map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                  >
                    {formatOpenTo(item)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Bio */}
          {athlete.bio && (
            <div>
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-3">
                Bio
              </h3>
              <p className="text-slate-600">{athlete.bio}</p>
            </div>
          )}
        </div>
      </div>

      {/* Sign Out */}
      <div className="mt-8 text-center">
        <form action="/api/auth/signout" method="POST">
          <button
            type="submit"
            className="text-slate-500 hover:text-slate-700 text-sm"
          >
            Sign Out
          </button>
        </form>
      </div>
    </div>
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-sm text-slate-500">{label}</div>
      <div className="font-medium text-slate-900">{value}</div>
    </div>
  )
}

function SocialHandle({ platform, handle }: { platform: string; handle?: string }) {
  return (
    <div>
      <div className="text-sm text-slate-500">{platform}</div>
      <div className="font-medium text-slate-900">
        {handle ? `@${handle}` : 'Not connected'}
      </div>
    </div>
  )
}

function formatOpenTo(item: string): string {
  const map: Record<string, string> = {
    social_posts: 'Social Posts',
    appearances: 'Appearances',
    autographs: 'Autographs',
    camps: 'Camps/Clinics',
    licensing: 'Licensing',
    merchandise: 'Merchandise',
  }
  return map[item] || item
}
