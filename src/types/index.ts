export type MemberCategory = 'balance' | 'chronic' | 'expiring'

export type FollowStatus = 'pending' | 'contacted' | 'arrived' | 'redeemed' | 'unneeded'

export type TimelineEventType =
  | 'status_contacted'
  | 'status_arrived'
  | 'status_redeemed'
  | 'status_unneeded'
  | 'feedback_update'

export interface TimelineEvent {
  id: string
  type: TimelineEventType
  timestamp: number
  status?: FollowStatus
  feedbackText?: string
  feedbackTags?: string[]
  description: string
}

export interface Member {
  id: string
  name: string
  phone: string
  avatar: string
  category: MemberCategory
  categoryDesc: string
  balance?: number
  chronicDisease?: string
  nextPurchaseDate?: string
  benefitExpireDate?: string
  lastContactDate?: string
  followStatus: FollowStatus
  feedback?: string
  feedbackTags?: string[]
  assignedStaffId?: string
  arrivedDate?: string
  redeemedDate?: string
  satisfaction?: number
  timeline: TimelineEvent[]
}

export type ActionType = 'phone' | 'wechat' | 'appointment'

export interface SuggestAction {
  id: string
  memberId: string
  memberName: string
  type: ActionType
  typeDesc: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  completed: boolean
}

export interface Staff {
  id: string
  name: string
  avatar: string
  role: string
}

export interface StaffDailyDetail {
  staff: Staff
  contactCount: number
  arrivedCount: number
  redeemedCount: number
  satisfactionNotes: string[]
  members: Member[]
  topFeedbackTags: { tag: string; count: number }[]
}

export const FOLLOW_STATUS_OPTIONS: { value: FollowStatus; label: string; color: string }[] = [
  { value: 'pending', label: '待跟进', color: '#86909C' },
  { value: 'contacted', label: '已联系', color: '#1677FF' },
  { value: 'arrived', label: '已到店', color: '#2BA471' },
  { value: 'redeemed', label: '已核销', color: '#722ED1' },
  { value: 'unneeded', label: '暂不需要', color: '#86909C' }
]

export const TIMELINE_EVENT_LABEL: Record<TimelineEventType, { label: string; icon: string; color: string }> = {
  status_contacted: { label: '已联系', icon: '📞', color: '#1677FF' },
  status_arrived: { label: '已到店', icon: '🏪', color: '#2BA471' },
  status_redeemed: { label: '已核销', icon: '💳', color: '#722ED1' },
  status_unneeded: { label: '暂不需要', icon: '⏸️', color: '#86909C' },
  feedback_update: { label: '更新反馈', icon: '📝', color: '#FA8C16' }
}

export const MEMBER_CATEGORY_OPTIONS: { value: MemberCategory; label: string; color: string; bgColor: string }[] = [
  { value: 'balance', label: '余额活跃', color: '#2BA471', bgColor: '#E6F7EC' },
  { value: 'chronic', label: '慢病临近', color: '#FF8A3D', bgColor: '#FFF4E6' },
  { value: 'expiring', label: '权益快过期', color: '#F53F3F', bgColor: '#FFECE8' }
]

export const FEEDBACK_TAGS = [
  '不清楚个账支付范围',
  '想给父母买药',
  '担心不能报销',
  '想了解具体药品',
  '需要配送服务',
  '价格有疑问',
  '预约药师咨询',
  '其他需求'
]
