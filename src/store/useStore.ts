import { create } from 'zustand'
import type { Member, SuggestAction, Staff, FollowStatus, StaffDailyDetail, TimelineEventType } from '@/types'
import { mockMembers, mockActions, mockStaff } from '@/data/mock'
import { FEEDBACK_TAGS } from '@/types'

interface AppState {
  members: Member[]
  actions: SuggestAction[]
  staffList: Staff[]

  toggleAction: (actionId: string) => void
  updateMember: (memberId: string, patch: Partial<Member>) => void
  saveMemberFollow: (
    memberId: string,
    status: FollowStatus,
    feedbackTags: string[],
    feedbackText: string
  ) => void

  getContactedCount: () => number
  getArrivedCount: () => number
  getRedeemedCount: () => number
  getBalanceActiveCount: () => number
  getChronicNearbyCount: () => number
  getExpiringSoonCount: () => number
  getOverallCompletionRate: () => number

  getMemberAvatar: (memberName: string) => string
  getStaffArrivedCount: (staffId: string) => number
  getStaffContactCount: (staffId: string) => number
  getStaffRedeemedCount: (staffId: string) => number
  getStaffSatisfactionNotes: (staffId: string) => string[]
  getStaffDailyDetail: (staffId: string) => StaffDailyDetail

  getFilteredCounts: (filter: { staffId?: string }) => {
    contacted: number
    arrived: number
    redeemed: number
    total: number
  }
}

const statusToTimelineType: Record<FollowStatus, TimelineEventType | null> = {
  pending: null,
  contacted: 'status_contacted',
  arrived: 'status_arrived',
  redeemed: 'status_redeemed',
  unneeded: 'status_unneeded'
}

export const useAppStore = create<AppState>((set, get) => ({
  members: [...mockMembers],
  actions: [...mockActions],
  staffList: [...mockStaff],

  toggleAction: (actionId: string) => {
    set(state => ({
      actions: state.actions.map(a =>
        a.id === actionId ? { ...a, completed: !a.completed } : a
      )
    }))
  },

  updateMember: (memberId: string, patch: Partial<Member>) => {
    set(state => ({
      members: state.members.map(m =>
        m.id === memberId ? { ...m, ...patch } : m
      )
    }))
  },

  saveMemberFollow: (memberId, status, feedbackTags, feedbackText) => {
    const today = new Date().toISOString().split('T')[0]
    const now = Date.now()
    const existing = get().members.find(m => m.id === memberId)
    if (!existing) return

    const prevStatus = existing.followStatus
    const prevTags = existing.feedbackTags || []
    const prevText = existing.feedback || ''

    const newTimeline = [...existing.timeline]

    if (status !== prevStatus) {
      const timelineType = statusToTimelineType[status]
      if (timelineType) {
        const descMap: Record<string, string> = {
          status_contacted: '完成电话/企微联系',
          status_arrived: '会员已到店',
          status_redeemed: '完成权益核销',
          status_unneeded: '会员暂不需要'
        }
        newTimeline.push({
          id: `${memberId}-${timelineType}-${now}`,
          type: timelineType,
          timestamp: now,
          status,
          description: descMap[timelineType] || '状态更新'
        })
      }
    }

    const tagsChanged =
      feedbackTags.length !== prevTags.length ||
      feedbackTags.some(t => !prevTags.includes(t)) ||
      prevTags.some(t => !feedbackTags.includes(t))
    const textChanged = feedbackText !== prevText

    if (tagsChanged || textChanged) {
      const tagStr = feedbackTags.length > 0 ? `标签：${feedbackTags.join('、')}` : ''
      const textStr = feedbackText ? `备注：${feedbackText}` : ''
      const desc = [tagStr, textStr].filter(Boolean).join('，') || '更新反馈记录'
      newTimeline.push({
        id: `${memberId}-feedback-${now}`,
        type: 'feedback_update',
        timestamp: now,
        feedbackTags,
        feedbackText,
        description: desc
      })
    }

    set(state => ({
      members: state.members.map(m =>
        m.id === memberId
          ? {
              ...m,
              followStatus: status,
              feedbackTags,
              feedback: feedbackText,
              lastContactDate: status !== 'pending' ? today : m.lastContactDate,
              arrivedDate:
                status === 'arrived' || status === 'redeemed'
                  ? today
                  : m.arrivedDate,
              redeemedDate: status === 'redeemed' ? today : m.redeemedDate,
              timeline: newTimeline
            }
          : m
      )
    }))
  },

  getContactedCount: () => {
    return get().members.filter(m => m.followStatus !== 'pending').length
  },

  getArrivedCount: () => {
    return get().members.filter(m =>
      m.followStatus === 'arrived' || m.followStatus === 'redeemed'
    ).length
  },

  getRedeemedCount: () => {
    return get().members.filter(m => m.followStatus === 'redeemed').length
  },

  getBalanceActiveCount: () => {
    return get().members.filter(m => m.category === 'balance').length
  },

  getChronicNearbyCount: () => {
    return get().members.filter(m => m.category === 'chronic').length
  },

  getExpiringSoonCount: () => {
    return get().members.filter(m => m.category === 'expiring').length
  },

  getOverallCompletionRate: () => {
    const members = get().members
    const completed = members.filter(m => m.followStatus !== 'pending').length
    return members.length > 0 ? Math.round((completed / members.length) * 100) : 0
  },

  getMemberAvatar: (memberName: string) => {
    const member = get().members.find(m => m.name === memberName)
    return member?.avatar || 'https://picsum.photos/id/64/200/200'
  },

  getStaffContactCount: (staffId: string) => {
    return get().members.filter(m =>
      m.assignedStaffId === staffId &&
      m.followStatus !== 'pending'
    ).length
  },

  getStaffArrivedCount: (staffId: string) => {
    return get().members.filter(m =>
      m.assignedStaffId === staffId &&
      (m.followStatus === 'arrived' || m.followStatus === 'redeemed')
    ).length
  },

  getStaffRedeemedCount: (staffId: string) => {
    return get().members.filter(m =>
      m.assignedStaffId === staffId &&
      m.followStatus === 'redeemed'
    ).length
  },

  getStaffSatisfactionNotes: (staffId: string) => {
    return get().members
      .filter(m =>
        m.assignedStaffId === staffId &&
        m.feedback &&
        m.followStatus !== 'pending'
      )
      .map(m => `${m.name}：${m.feedback}`)
  },

  getStaffDailyDetail: (staffId: string) => {
    const staff = get().staffList.find(s => s.id === staffId)!
    const staffMembers = get().members.filter(m => m.assignedStaffId === staffId)
    const contactCount = staffMembers.filter(m => m.followStatus !== 'pending').length
    const arrivedCount = staffMembers.filter(m =>
      m.followStatus === 'arrived' || m.followStatus === 'redeemed'
    ).length
    const redeemedCount = staffMembers.filter(m => m.followStatus === 'redeemed').length
    const satisfactionNotes = staffMembers
      .filter(m => m.feedback && m.followStatus !== 'pending')
      .map(m => `${m.name}：${m.feedback}`)

    const tagCountMap: Record<string, number> = {}
    FEEDBACK_TAGS.forEach(t => { tagCountMap[t] = 0 })
    staffMembers.forEach(m => {
      m.feedbackTags?.forEach(t => {
        if (tagCountMap[t] !== undefined) tagCountMap[t] += 1
      })
    })
    const topFeedbackTags = FEEDBACK_TAGS
      .map(tag => ({ tag, count: tagCountMap[tag] }))
      .filter(i => i.count > 0)
      .sort((a, b) => b.count - a.count)

    return {
      staff,
      contactCount,
      arrivedCount,
      redeemedCount,
      satisfactionNotes,
      members: staffMembers,
      topFeedbackTags
    }
  },

  getFilteredCounts: (filter) => {
    const { staffId } = filter
    const list = get().members.filter(m => !staffId || m.assignedStaffId === staffId)
    return {
      contacted: list.filter(m => m.followStatus !== 'pending').length,
      arrived: list.filter(m => m.followStatus === 'arrived' || m.followStatus === 'redeemed').length,
      redeemed: list.filter(m => m.followStatus === 'redeemed').length,
      total: list.length
    }
  }
}))
