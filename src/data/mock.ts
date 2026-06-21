import { Member, SuggestAction, Staff, DailyStats } from '@/types'

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
    assignedStaffId: 's1'
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
    lastContactDate: '2026-06-22'
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
    lastContactDate: '2026-06-21'
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
    satisfaction: 5
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
    assignedStaffId: 's1'
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
    lastContactDate: '2026-06-22'
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
    lastContactDate: '2026-06-21'
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
    assignedStaffId: 's2'
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
    satisfaction: 4
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
    assignedStaffId: 's3'
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
    assignedStaffId: 's1'
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
    lastContactDate: '2026-06-22'
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
    role: '执业药师',
    arrivedCount: 3,
    contactCount: 12,
    satisfactionNotes: [
      '吴姐：专业解答了个账支付范围问题，非常满意',
      '李大爷：电话提醒很及时，药品预留好了',
      '王大姐：体检预约安排很周到'
    ]
  },
  {
    id: 's2',
    name: '王大明',
    avatar: 'https://picsum.photos/id/91/200/200',
    role: '资深店员',
    arrivedCount: 2,
    contactCount: 8,
    satisfactionNotes: [
      '刘叔：购买糖尿病药物服务很周到',
      '周大爷：耐心讲解了用药注意事项'
    ]
  },
  {
    id: 's3',
    name: '张小美',
    avatar: 'https://picsum.photos/id/177/200/200',
    role: '店员',
    arrivedCount: 1,
    contactCount: 5,
    satisfactionNotes: [
      '赵哥：企微回复很及时，推荐的产品很合适'
    ]
  }
]

export const mockDailyStats: DailyStats = {
  date: '2026-06-22',
  balanceActiveCount: 4,
  chronicNearbyCount: 4,
  expiringSoonCount: 4,
  totalContacted: 5,
  totalArrived: 3,
  totalRedeemed: 1,
  completionRate: 68,
  staffList: mockStaff
}
