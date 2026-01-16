'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Comment {
  id: string
  authorSport: string | null
  authorDivision: string | null
  isVerifiedAthlete: boolean
  isOP: boolean
  content: string
  upvotes: number
  createdAt: string
}

interface Post {
  id: string
  authorSport: string
  authorDivision: string
  authorConference: string | null
  isVerifiedAthlete: boolean
  title: string
  content: string
  category: string
  upvotes: number
  downvotes: number
  viewCount: number
  isPinned: boolean
  createdAt: string
  comments: Comment[]
  _count: { comments: number }
}

const categories = [
  { value: '', label: 'All', icon: '🏠' },
  { value: 'DEALS', label: 'Deals', icon: '💰' },
  { value: 'COMPLIANCE', label: 'Compliance', icon: '📋' },
  { value: 'AGENTS', label: 'Agents', icon: '🤝' },
  { value: 'BRAND_REVIEWS', label: 'Brand Reviews', icon: '⭐' },
  { value: 'TRANSFERS', label: 'Transfers', icon: '🔄' },
  { value: 'SCHOOL_LIFE', label: 'School Life', icon: '🎓' },
  { value: 'ADVICE', label: 'Advice', icon: '💡' },
  { value: 'GENERAL', label: 'General', icon: '💬' },
]

export default function WaterCoolerPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [expandedPost, setExpandedPost] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    fetchPosts()
  }, [selectedCategory])

  async function fetchPosts() {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedCategory) params.set('category', selectedCategory)

      const response = await fetch(`/api/water-cooler?${params}`)
      const data = await response.json()
      setPosts(data.posts)
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    } finally {
      setLoading(false)
    }
  }

  function timeAgo(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (seconds < 60) return 'just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
    return `${Math.floor(seconds / 604800)}w ago`
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Hero */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-sm text-emerald-400 mb-6">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          Anonymous athlete discussions
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Water Cooler
        </h1>
        <p className="text-xl text-white/50 max-w-2xl">
          Verified athletes discussing NIL, compliance, and college sports. 100% anonymous.
        </p>
      </div>

      {/* Start a Discussion CTA */}
      <div className="mb-8 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-white/10 rounded-2xl p-6 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold mb-1">Start a discussion</h3>
          <p className="text-white/50 text-sm">
            Share your experiences and get advice from verified athletes.
          </p>
        </div>
        <button
          className="px-6 py-3 bg-gradient-to-r from-emerald-400 to-emerald-500 text-black rounded-xl font-semibold hover:from-emerald-300 hover:to-emerald-400 transition-all"
        >
          Create Post
        </button>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === cat.value
                ? 'bg-white text-black'
                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span className="mr-2">{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-white/50">Loading discussions...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 text-white/50">No posts found</div>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className={`bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden transition-all ${
                post.isPinned ? 'border-emerald-500/30' : ''
              }`}
            >
              {/* Post Header */}
              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-sm font-bold">
                      {post.authorSport.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{post.authorSport}</span>
                        {post.isVerifiedAthlete && (
                          <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded">
                            Verified
                          </span>
                        )}
                        {post.isPinned && (
                          <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded">
                            Pinned
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-white/40">
                        {post.authorConference || post.authorDivision} · {timeAgo(post.createdAt)}
                      </div>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-white/5 rounded-full text-xs text-white/40">
                    {categories.find(c => c.value === post.category)?.icon} {post.category.replace('_', ' ')}
                  </span>
                </div>

                {/* Post Content */}
                <h2 className="text-xl font-semibold mb-3">{post.title}</h2>
                <p className="text-white/70 leading-relaxed">{post.content}</p>

                {/* Post Actions */}
                <div className="flex items-center gap-6 mt-6 pt-4 border-t border-white/5">
                  <button className="flex items-center gap-2 text-white/40 hover:text-emerald-400 transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                    <span className="font-medium">{post.upvotes}</span>
                  </button>
                  <button className="flex items-center gap-2 text-white/40 hover:text-red-400 transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                    className="flex items-center gap-2 text-white/40 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>{post._count.comments} comments</span>
                  </button>
                  <span className="text-white/20 text-sm ml-auto">{post.viewCount} views</span>
                </div>
              </div>

              {/* Comments Section */}
              {expandedPost === post.id && post.comments.length > 0 && (
                <div className="border-t border-white/10 bg-white/[0.02]">
                  <div className="p-6 space-y-4">
                    {post.comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs">
                          {comment.authorSport?.charAt(0) || '?'}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium">
                              {comment.authorSport || 'Anonymous'}
                            </span>
                            {comment.isVerifiedAthlete && (
                              <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] rounded">
                                Verified
                              </span>
                            )}
                            {comment.isOP && (
                              <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] rounded">
                                OP
                              </span>
                            )}
                            <span className="text-white/30 text-xs">{timeAgo(comment.createdAt)}</span>
                          </div>
                          <p className="text-sm text-white/70">{comment.content}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <button className="text-white/30 hover:text-emerald-400 text-xs flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                              </svg>
                              {comment.upvotes}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

    </div>
  )
}
