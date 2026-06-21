import React, { useState, useMemo } from 'react'
import { View, Text, ScrollView, Button, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import { mockMembers, mockActions, mockDailyStats } from '@/data/mock'
import type { MemberCategory, SuggestAction, ActionType } from '@/types'
import { MEMBER_CATEGORY_OPTIONS } from '@/types'

interface CategoryInfo {
  key: MemberCategory
  label: string
  icon: string
  desc: string
  tips: string[]
  count: number
}

const BusinessPage: React.FC = () => {
  const [actions, setActions] = useState<SuggestAction[]>(mockActions)
  const todayDate = useMemo(() => {
    const now = new Date()
    const month = now.getMonth() + 1
    const day = now.getDate()
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    return `${month}月${day}日 ${weekdays[now.getDay()]}`
  }, [])

  const categories: CategoryInfo[] = useMemo(() => {
    const balanceCount = mockMembers.filter(m => m.category === 'balance').length
    const chronicCount = mockMembers.filter(m => m.category === 'chronic').length
    const expiringCount = mockMembers.filter(m => m.category === 'expiring').length

    return [
      {
        key: 'balance',
        label: '医保个账余额活跃',
        icon: '💰',
        desc: '近30天个账消费活跃的会员',
        tips: [
          `张阿姨：余额 ¥3,850，上次购药10天前`,
          `赵哥：余额 ¥5,200，近期未消费`,
          `吴姐：余额 ¥8,600，可推荐保健品`
        ],
        count: balanceCount
      },
      {
        key: 'chronic',
        label: '慢病购药周期临近',
        icon: '💊',
        desc: '慢性病用药即将需要续购的会员',
        tips: [
          `李大爷：高血压药3天后用完`,
          `刘叔：糖尿病二甲双胍即将用完`,
          `周大爷：冠心病药物需要续方`
        ],
        count: chronicCount
      },
      {
        key: 'expiring',
        label: '权益快过期',
        icon: '⏰',
        desc: '会员权益7天内即将过期',
        tips: [
          `陈阿姨：免费测血糖 3天后过期`,
          `王大姐：健康体检 7天后过期`,
          `徐哥：积分兑换权益 5天后过期`
        ],
        count: expiringCount
      }
    ]
  }, [])

  const handleActionComplete = (actionId: string) => {
    setActions(prev =>
      prev.map(a =>
        a.id === actionId ? { ...a, completed: !a.completed } : a
      )
    )
    const action = actions.find(a => a.id === actionId)
    if (action && !action.completed) {
      Taro.showToast({ title: `已完成${action.typeDesc}`, icon: 'success' })
      console.log(`[Business] 完成建议动作: ${action.title}`)
    }
  }

  const handleViewList = (category: MemberCategory) => {
    const option = MEMBER_CATEGORY_OPTIONS.find(o => o.value === category)
    Taro.showToast({ title: `查看${option?.label}会员`, icon: 'none' })
    console.log(`[Business] 查看会员列表: ${category}`)
    Taro.switchTab({ url: '/pages/follow/index' }).catch(e => console.error('[Business] 跳转失败:', e))
  }

  const handleQuickAction = (action: ActionType) => {
    const map = {
      phone: '电话关怀功能',
      wechat: '企微提醒功能',
      appointment: '预约咨询功能'
    }
    Taro.showToast({ title: map[action], icon: 'none' })
    console.log(`[Business] 快速操作: ${action}`)
  }

  const getMemberAvatar = (memberName: string) => {
    const member = mockMembers.find(m => m.name === memberName)
    return member?.avatar || `https://picsum.photos/id/64/200/200`
  }

  const completedCount = actions.filter(a => a.completed).length

  return (
    <ScrollView scrollY className={styles.page} refresherEnabled onRefreshToRefresh={() => {
      Taro.showToast({ title: '刷新成功', icon: 'success' })
      setTimeout(() => Taro.stopPullDownRefresh(), 500)
    }}>
      <View className={styles.header}>
        <View className={styles.topRow}>
          <View className={styles.storeInfo}>
            <View className={styles.storeIcon}>
              <Text>🏥</Text>
            </View>
            <View className={styles.storeText}>
              <Text className={styles.storeName}>康泰大药房</Text>
              <Text className={styles.dateText}>{todayDate}</Text>
            </View>
          </View>
          <View className={styles.weatherBadge}>
            <Text>☀️ 26°C</Text>
          </View>
        </View>

        <View className={styles.statsSummary}>
          <View className={styles.summaryItem}>
            <Text className={styles.summaryNum}>{mockDailyStats.totalContacted}</Text>
            <Text className={styles.summaryLabel}>已联系</Text>
          </View>
          <View className={styles.summaryItem}>
            <Text className={styles.summaryNum}>{mockDailyStats.totalArrived}</Text>
            <Text className={styles.summaryLabel}>已到店</Text>
          </View>
          <View className={styles.summaryItem}>
            <Text className={styles.summaryNum}>{completedCount}/{actions.length}</Text>
            <Text className={styles.summaryLabel}>任务完成</Text>
          </View>
        </View>
      </View>

      <View className={styles.content}>
        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>今日重点人群</Text>
          </View>

          <View className={styles.categoryCards}>
            {categories.map(cat => (
              <View key={cat.key} className={styles.categoryCard}>
                <View className={styles.cardHeader}>
                  <View className={styles.cardLeft}>
                    <View className={classnames(styles.cardIcon, styles[cat.key])}>
                      <Text>{cat.icon}</Text>
                    </View>
                    <View className={styles.cardInfo}>
                      <Text className={styles.cardTitle}>{cat.label}</Text>
                      <Text className={styles.cardDesc}>{cat.desc}</Text>
                    </View>
                  </View>
                  <View className={classnames(styles.countBadge, styles[cat.key])}>
                    <Text className={classnames(styles.countNum, styles[cat.key])}>{cat.count}</Text>
                    <Text className={styles.countUnit}>人</Text>
                  </View>
                </View>

                <View className={styles.cardTips}>
                  {cat.tips.map((tip, idx) => (
                    <View key={idx} className={styles.tipItem}>
                      <View className={classnames(styles.tipDot, styles[cat.key])} />
                      <Text>{tip}</Text>
                    </View>
                  ))}
                </View>

                <View className={styles.cardActions}>
                  <Button
                    className={classnames(styles.actionBtn, styles.primary)}
                    onClick={() => handleQuickAction('phone')}
                  >
                    电话关怀
                  </Button>
                  <Button
                    className={classnames(styles.actionBtn, styles.secondary)}
                    onClick={() => handleViewList(cat.key)}
                  >
                    查看详情
                  </Button>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>建议动作 · 今日待办</Text>
            <View className={styles.sectionAction}>
              <Text>{completedCount}/{actions.length} 已完成</Text>
            </View>
          </View>

          {actions.length > 0 ? (
            <View className={styles.actionList}>
              {actions.map(action => (
                <View
                  key={action.id}
                  className={classnames(
                    styles.actionCard,
                    styles[action.priority],
                    action.completed && styles.completed
                  )}
                >
                  <View className={styles.actionCardHeader}>
                    <View className={classnames(styles.actionTypeBadge, styles[action.type])}>
                      <Text>
                        {action.type === 'phone' && '📞 '}
                        {action.type === 'wechat' && '💬 '}
                        {action.type === 'appointment' && '📅 '}
                        {action.typeDesc}
                      </Text>
                    </View>
                    <View className={classnames(styles.priorityBadge, styles[action.priority])}>
                      <Text>
                        {action.priority === 'high' && '🔥 紧急'}
                        {action.priority === 'medium' && '⚡ 优先'}
                        {action.priority === 'low' && '📌 常规'}
                      </Text>
                    </View>
                  </View>

                  <View className={styles.actionContent}>
                    <Text className={styles.actionTitle}>{action.title}</Text>
                    <Text className={styles.actionDesc}>{action.description}</Text>
                  </View>

                  <View className={styles.actionFooter}>
                    <View className={styles.memberTag}>
                      <Image className={styles.memberAvatar} src={getMemberAvatar(action.memberName)} mode='aspectFill' />
                      <Text className={styles.memberName}>{action.memberName}</Text>
                    </View>
                    <Button
                      className={classnames(styles.doBtn, action.completed && styles.done)}
                      onClick={() => handleActionComplete(action.id)}
                    >
                      {action.completed ? '✓ 已完成' : '立即处理'}
                    </Button>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View className={styles.emptyState}>
              <Text className={styles.emptyIcon}>🎉</Text>
              <Text className={styles.emptyText}>今日任务已全部完成！</Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  )
}

export default BusinessPage
