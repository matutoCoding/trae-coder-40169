import { Member, SuggestAction, Staff, TimelineEvent, FollowStatus } from '@/types'

const buildInitialTimeline = (
  memberId: string,
  status: FollowStatus,
  lastContactDate?: string,
  arrivedDate?: string,
  redeemedDate?: string
): TimelineEvent[] => {
  const events: TimelineEvent[] = []
  const baseTime = new Date('2026-06-22 09:00:00').getTime()

  if (status !== 'pending') {
    events.push({
      id: `${memberId}-contact`,
      type: 'status_contacted',
      timestamp: baseTime - 3600000,
      status: 'contacted',
      description: lastContactDate ? `于${lastContactDate}首次联系` : '首次联系'
    })
  }

  if (arrivedDate) {
    events.push({
      id: `${memberId}-arrive`,
      type: 'status_arrived',
      timestamp: baseTime + 7200000,
      status: 'arrived',
      description: `于${arrivedDate}到店`
    })
  }

  if (redeemedDate) {
    events.push({
      id: `${memberId}-redeem`,
      type: 'status_redeemed',
      timestamp: baseTime + 14400000,
      status: 'redeemed',
      description: `于${redeemedDate}完成核销`
    })
  }

  if (status === 'unneeded') {
    events.push({
      id: `${memberId}-unneeded`,
      type: 'status_unneeded',
      timestamp: baseTime + 10800000,
      status: 'unneeded',
      description: '标记为暂不需要'
    })
  }

  return events
}

export const mockMembers: Member[] = [
  {
    id: '1',
    name: '张阿姨',
    phone: '138****1234',
    avatar: 'https://picsum.photos/id/64/200/200',
    category: 'balance',
    categoryDesc: '医保个账余额活跃',
    balance: 3850,
    followStatus: 'pending',
    feedbackTags: [],
    assignedStaffId: 's1',
    timeline: buildInitialTimeline('1', 'pending')
  },
  {
    id: '2',
    name: '李大爷',
    phone: '139****5678',
    avatar: 'https://picsum.photos/id/91/200/200',
    category: 'chronic',
    categoryDesc: '高血压购药周期临近',
    chronicDisease: '高血压',
    nextPurchaseDate: '2026-06-25',
    followStatus: 'contacted',
    feedback: '需要确认药品库存',
    feedbackTags: ['想了解具体药品'],
    assignedStaffId: 's1',
    lastContactDate: '2026-06-22',
    timeline: buildInitialTimeline('2', 'contacted', '2026-06-22')
  },
  {
    id: '3',
    name: '王大姐',
    phone: '137****9012',
    avatar: 'https://picsum.photos/id/177/200/200',
    category: 'expiring',
    categoryDesc: '健康体检权益7天过期',
    benefitExpireDate: '2026-06-29',
    followStatus: 'arrived',
    feedback: '预约了本周六到店体检',
    feedbackTags: ['预约药师咨询'],
    assignedStaffId: 's2',
    arrivedDate: '2026-06-22',
    lastContactDate: '2026-06-21',
    timeline: buildInitialTimeline('3', 'arrived', '2026-06-21', '2026-06-22')
  },
  {
    id: '4',
    name: '刘叔',
    phone: '136****3456',
    avatar: 'https://picsum.photos/id/338/200/200',
    category: 'chronic',
    categoryDesc: '糖尿病用药即将用完',
    chronicDisease: '糖尿病',
    nextPurchaseDate: '2026-06-26',
    followStatus: 'redeemed',
    feedback: '已购买二甲双胍，满意服务',
    feedbackTags: [],
    assignedStaffId: 's2',
    arrivedDate: '2026-06-22',
    redeemedDate: '2026-06-22',
    lastContactDate: '2026-06-20',
    satisfaction: 5,
    timeline: buildInitialTimeline('4', 'redeemed', '2026-06-20', '2026-06-22', '2026-06-22')
  },
  {
    id: '5',
    name: '陈阿姨',
    phone: '135****7890',
    avatar: 'https://picsum.photos/id/1027/200/200',
    category: 'expiring',
    categoryDesc: '免费测血糖权益3天过期',
    benefitExpireDate: '2026-06-25',
    followStatus: 'pending',
    feedbackTags: [],
    assignedStaffId: 's1',
    timeline: buildInitialTimeline('5', 'pending')
  },
  {
    id: '6',
    name: '赵哥',
    phone: '134****2345',
    avatar: 'https://picsum.photos/id/64/200/200',
    category: 'balance',
    categoryDesc: '医保个账余额5200元',
    balance: 5200,
    followStatus: 'contacted',
    feedback: '想给爸妈买钙片和维生素',
    feedbackTags: ['想给父母买药'],
    assignedStaffId: 's3',
    lastContactDate: '2026-06-22',
    timeline: buildInitialTimeline('6', 'contacted', '2026-06-22')
  },
  {
    id: '7',
    name: '孙姨',
    phone: '133****6789',
    avatar: 'https://picsum.photos/id/177/200/200',
    category: 'expiring',
    categoryDesc: '中医理疗权益10天过期',
    benefitExpireDate: '2026-07-02',
    followStatus: 'unneeded',
    feedback: '最近在外地，暂不需要',
    feedbackTags: [],
    assignedStaffId: 's3',
    lastContactDate: '2026-06-21',
    timeline: buildInitialTimeline('7', 'unneeded', '2026-06-21')
  },
  {
    id: '8',
    name: '周大爷',
    phone: '132****0123',
    avatar: 'https://picsum.photos/id/338/200/200',
    category: 'chronic',
    categoryDesc: '冠心病药物需要续方',
    chronicDisease: '冠心病',
    nextPurchaseDate: '2026-06-24',
    followStatus: 'pending',
    feedbackTags: [],
    assignedStaffId: 's2',
    timeline: buildInitialTimeline('8', 'pending')
  },
  {
    id: '9',
    name: '吴姐',
    phone: '131****4567',
    avatar: 'https://picsum.photos/id/91/200/200',
    category: 'balance',
    categoryDesc: '医保个账余额8600元',
    balance: 8600,
    followStatus: 'arrived',
    feedback: '不清楚哪些保健品可以用个账支付',
    feedbackTags: ['不清楚个账支付范围', '担心不能报销'],
    assignedStaffId: 's1',
    arrivedDate: '2026-06-22',
    lastContactDate: '2026-06-22',
    satisfaction: 4,
    timeline: buildInitialTimeline('9', 'arrived', '2026-06-22', '2026-06-22')
  },
  {
    id: '10',
    name: '郑叔',
    phone: '130****8901',
    avatar: 'https://picsum.photos/id/1027/200/200',
    category: 'balance',
    categoryDesc: '医保个账余额2100元',
    balance: 2100,
    followStatus: 'pending',
    feedbackTags: [],
    assignedStaffId: 's3',
    timeline: buildInitialTimeline('10', 'pending')
  },
  {
    id: '11',
    name: '黄阿姨',
    phone: '159****2345',
    avatar: 'https://picsum.photos/id/64/200/200',
    category: 'chronic',
    categoryDesc: '高血脂药物用完需购买',
    chronicDisease: '高血脂',
    nextPurchaseDate: '2026-06-27',
    followStatus: 'pending',
    feedbackTags: [],
    assignedStaffId: 's1',
    timeline: buildInitialTimeline('11', 'pending')
  },
  {
    id: '12',
    name: '徐哥',
    phone: '158****6789',
    avatar: 'https://picsum.photos/id/338/200/200',
    category: 'expiring',
    categoryDesc: '会员积分兑换权益5天过期',
    benefitExpireDate: '2026-06-27',
    followStatus: 'contacted',
    feedback: '需要了解可兑换的商品目录',
    feedbackTags: ['价格有疑问'],
    assignedStaffId: 's2',
    lastContactDate: '2026-06-22',
    timeline: buildInitialTimeline('12', 'contacted', '2026-06-22')
  }
]

export const mockActions: SuggestAction[] = [
  {
    id: 'a1',
    memberId: '5',
    memberName: '陈阿姨',
    type: 'phone',
    typeDesc: '电话关怀',
    title: '电话提醒陈阿姨',
    description: '免费测血糖权益3天后过期，提醒尽快使用',
    priority: 'high',
    completed: false
  },
  {
    id: 'a2',
    memberId: '8',
    memberName: '周大爷',
    type: 'phone',
    typeDesc: '电话关怀',
    title: '电话联系周大爷',
    description: '冠心病药物需要续方，确认是否需要预留药品',
    priority: 'high',
    completed: false
  },
  {
    id: 'a3',
    memberId: '6',
    memberName: '赵哥',
    type: 'wechat',
    typeDesc: '企微提醒',
    title: '企微发送保健品清单',
    description: '赵哥想给父母买钙片和维生素，发送推荐清单',
    priority: 'medium',
    completed: false
  },
  {
    id: 'a4',
    memberId: '11',
    memberName: '黄阿姨',
    type: 'appointment',
    typeDesc: '药师预约',
    title: '预约用药咨询',
    description: '高血脂用药指导，建议预约到店咨询药师',
    priority: 'medium',
    completed: false
  },
  {
    id: 'a5',
    memberId: '10',
    memberName: '郑叔',
    type: 'wechat',
    typeDesc: '企微提醒',
    title: '发送夏季健康提醒',
    description: '郑叔有医保余额，推荐防暑降温药品',
    priority: 'low',
    completed: false
  },
  {
    id: 'a6',
    memberId: '1',
    memberName: '张阿姨',
    type: 'phone',
    typeDesc: '电话关怀',
    title: '电话回访张阿姨',
    description: '上次购买药品的使用情况，了解是否有不良反应',
    priority: 'medium',
    completed: false
  }
]

export const mockStaff: Staff[] = [
  {
    id: 's1',
    name: '李小芳',
    avatar: 'https://picsum.photos/id/64/200/200',
    role: '执业药师'
  },
  {
    id: 's2',
    name: '王大明',
    avatar: 'https://picsum.photos/id/91/200/200',
    role: '资深店员'
  },
  {
    id: 's3',
    name: '张小美',
    avatar: 'https://picsum.photos/id/177/200/200',
    role: '店员'
  }
]
