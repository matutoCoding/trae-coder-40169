import { create } from 'zustand'
import type { Member, SuggestAction, Staff, FollowStatus } from '@/types'
import { mockMembers, mockActions, mockStaff } from '@/data/mock'

interface AppState {
  members: Member[]
  actions: SuggestAction[]
  staffList: Staff[]

  toggleAction: (actionId: string) => void
  updateMember: (memberId: string, patch: Partial<Member>) => void
  getContactedCount: () => number
  getArrivedCount: () => number
  getRedeemedCount: () => number
  getBalanceActiveCount: () => number
  getChronicNearbyCount: () => number
  getExpiringSoonCount: () => number
  getStaffById: (staffId: string) => Staff | undefined
  getMemberAvatar: (memberName: string) => string
  getStaffArrivedCount: (staffId: string) => number
  getStaffContactCount: (staffId: string) => number
  getStaffSatisfactionNotes: (staffId: string) => string[]
  getOverallCompletionRate: () => number
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

  getContactedCount: () => {
    return get().members.filter(m => m.followStatus === 'contacted').length
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

  getStaffById: (staffId: string) => {
    return get().staffList.find(s => s.id === staffId)
  },

  getMemberAvatar: (memberName: string) => {
    const member = get().members.find(m => m.name === memberName)
    return member?.avatar || 'https://picsum.photos/id/64/200/200'
  },

  getStaffArrivedCount: (staffId: string) => {
    return get().members.filter(m =>
      m.assignedStaffId === staffId &&
      (m.followStatus === 'arrived' || m.followStatus === 'redeemed')
    ).length
  },

  getStaffContactCount: (staffId: string) => {
    return get().members.filter(m =>
      m.assignedStaffId === staffId &&
      m.followStatus !== 'pending'
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

  getOverallCompletionRate: () => {
    const members = get().members
    const completed = members.filter(m => m.followStatus !== 'pending').length
    return members.length > 0 ? Math.round((completed / members.length) * 100) : 0
  }
}))
