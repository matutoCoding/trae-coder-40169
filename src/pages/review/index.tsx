import React, { useMemo } from 'react'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import Taro, { usePullDownRefresh } from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import { mockMembers, mockStaff, mockDailyStats } from '@/data/mock'
import { FEEDBACK_TAGS } from '@/types'

const ReviewPage: React.FC = () => {
  usePullDownRefresh(() => {
    Taro.showToast({ title: '数据已更新', icon: 'success' })
    setTimeout(() => Taro.stopPullDownRefresh(), 500)
    console.log('[Review] 下拉刷新班后复盘数据')
  })

  const todayDate = useMemo(() => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1
    const day = now.getDate()
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
    return `${year}年${month}月${day}日 ${weekdays[now.getDay()]}`
  }, [])

  const sortedStaff = useMemo(() => {
    return [...mockStaff].sort((a, b) => b.arrivedCount - a.arrivedCount)
  }, [])

  const feedbackStats = useMemo(() => {
    const stats: Record<string, number> = {}
    FEEDBACK_TAGS.forEach(tag => { stats[tag] = 0 })

    mockMembers.forEach(member => {
      member.feedbackTags?.forEach(tag => {
        if (stats[tag] !== undefined) {
          stats[tag] += 1
        }
      })
    })

    const topFeedback = FEEDBACK_TAGS
      .map(tag => ({ tag, count: stats[tag] }))
      .filter(item => item.count > 0)
      .sort((a, b) => b.count - a.count)

    const maxCount = topFeedback.length > 0 ? topFeedback[0].count : 1

    const quickStats = {
      payment: stats['不清楚个账支付范围'] || 0,
      parents: stats['想给父母买药'] || 0,
      reimburse: stats['担心不能报销'] || 0,
      other: Object.values(stats).reduce((sum, v) => sum + v, 0)
        - (stats['不清楚个账支付范围'] || 0)
        - (stats['想给父母买药'] || 0)
        - (stats['担心不能报销'] || 0)
    }

    return { topFeedback, maxCount, quickStats }
  }, [])

  const totalTasks = mockMembers.length
  const completedTasks = mockMembers.filter(m => m.followStatus !== 'pending').length
  const overallRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const contactRate = totalTasks > 0
    ? Math.round((mockDailyStats.totalContacted / totalTasks) * 100)
    : 0
  const arriveRate = mockDailyStats.totalContacted > 0
    ? Math.round((mockDailyStats.totalArrived / mockDailyStats.totalContacted) * 100)
    : 0
  const redeemRate = mockDailyStats.totalArrived > 0
    ? Math.round((mockDailyStats.totalRedeemed / mockDailyStats.totalArrived) * 100)
    : 0

  const getRankClass = (index: number) => {
    if (index === 0) return styles.rank1
    if (index === 1) return styles.rank2
    if (index === 2) return styles.rank3
    return ''
  }

  const getRankText = (index: number) => {
    if (index === 0) return '🏆 今日最佳'
    if (index === 1) return '🥈 第二名'
    if (index === 2) return '🥉 第三名'
    return `第${index + 1}名`
  }

  const getFeedbackBarColor = (idx: number) => {
    const colors = [styles.blue, styles.orange, styles.green, styles.purple, styles.gray]
    return colors[Math.min(idx, colors.length - 1)]
  }

  const pendingCount = mockMembers.filter(m => m.followStatus === 'pending').length
  const needTomorrow = pendingCount > 0

  return (
    <ScrollView scrollY className={styles.page}>
      <View className={styles.header}>
        <View className={styles.headerTop}>
          <View className={styles.headerTitle}>
            <View className={styles.dateIcon}>
              <Text>📊</Text>
            </View>
            <View className={styles.headerText}>
              <Text className={styles.mainTitle}>今日经营复盘</Text>
              <Text className={styles.subTitle}>{todayDate}</Text>
            </View>
          </View>
          <View className={styles.scoreBadge}>
            <Text className={styles.scoreNum}>{mockDailyStats.completionRate}</Text>
            <Text className={styles.scoreLabel}>综合评分</Text>
          </View>
        </View>

        <View className={styles.statsGrid}>
          <View className={styles.statCard}>
            <Text className={classnames(styles.statValue, styles.green)}>
              {mockDailyStats.balanceActiveCount}
            </Text>
            <Text className={styles.statName}>余额活跃会员</Text>
          </View>
          <View className={styles.statCard}>
            <Text className={classnames(styles.statValue, styles.orange)}>
              {mockDailyStats.chronicNearbyCount}
            </Text>
            <Text className={styles.statName}>慢病临近会员</Text>
          </View>
          <View className={styles.statCard}>
            <Text className={classnames(styles.statValue, styles.purple)}>
              {mockDailyStats.expiringSoonCount}
            </Text>
            <Text className={styles.statName}>权益快过期</Text>
          </View>
        </View>
      </View>

      <View className={styles.content}>
        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>任务完成度</Text>
            <Text className={styles.sectionHint}>
              {completedTasks}/{totalTasks} 已跟进
            </Text>
          </View>

          <View className={styles.overallProgress}>
            <View className={styles.overallHeader}>
              <Text className={styles.overallLabel}>
                <Text>🎯</Text>
                <Text>整体跟进完成率</Text>
              </Text>
              <Text className={styles.overallValue}>{overallRate}%</Text>
            </View>
            <View className={styles.overallTrack}>
              <View
                className={styles.overallFill}
                style={{ width: `${overallRate}%` }}
              />
            </View>
            <Text className={styles.overallTips}>
              今日共 <Text className={styles.highlight}>{totalTasks}</Text> 位目标会员，
              已跟进 <Text className={styles.highlight}>{completedTasks}</Text> 位，
              还差 <Text className={styles.highlight}>{pendingCount}</Text> 位未处理
            </Text>
          </View>

          <View className={styles.progressCard}>
            <View className={styles.progressRow}>
              <View className={styles.progressLabel}>
                <Text className={styles.progressName}>📞 联系转化率</Text>
                <Text className={styles.progressValue}>
                  {mockDailyStats.totalContacted}/{totalTasks} ({contactRate}%)
                </Text>
              </View>
              <View className={styles.progressTrack}>
                <View
                  className={classnames(styles.progressFill, styles.green)}
                  style={{ width: `${contactRate}%` }}
                />
              </View>
            </View>

            <View className={styles.progressRow}>
              <View className={styles.progressLabel}>
                <Text className={styles.progressName}>🏪 到店转化率</Text>
                <Text className={styles.progressValue}>
                  {mockDailyStats.totalArrived}/{mockDailyStats.totalContacted} ({arriveRate}%)
                </Text>
              </View>
              <View className={styles.progressTrack}>
                <View
                  className={classnames(styles.progressFill, styles.orange)}
                  style={{ width: `${arriveRate}%` }}
                />
              </View>
            </View>

            <View className={styles.progressRow}>
              <View className={styles.progressLabel}>
                <Text className={styles.progressName}>💳 核销转化率</Text>
                <Text className={styles.progressValue}>
                  {mockDailyStats.totalRedeemed}/{mockDailyStats.totalArrived} ({redeemRate}%)
                </Text>
              </View>
              <View className={styles.progressTrack}>
                <View
                  className={classnames(styles.progressFill, styles.purple)}
                  style={{ width: `${redeemRate}%` }}
                />
              </View>
            </View>
          </View>
        </View>

        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>店员业绩榜</Text>
            <Text className={styles.sectionHint}>按到店人数排序</Text>
          </View>

          <View className={styles.staffList}>
            {sortedStaff.map((staff, idx) => (
              <View key={staff.id} className={styles.staffCard}>
                <View className={styles.staffHeader}>
                  <Image className={styles.staffAvatar} src={staff.avatar} mode='aspectFill' />
                  <View className={styles.staffInfo}>
                    <View className={styles.staffNameRow}>
                      <Text className={styles.staffName}>{staff.name}</Text>
                      <View className={styles.staffRole}>
                        <Text>{staff.role}</Text>
                      </View>
                      <View className={classnames(styles.rankBadge, getRankClass(idx))}>
                        <Text>{getRankText(idx)}</Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View className={styles.staffStats}>
                  <View className={styles.staffStat}>
                    <Text className={classnames(styles.staffStatVal, styles.blue)}>
                      {staff.contactCount}
                    </Text>
                    <Text className={styles.staffStatName}>联系数</Text>
                  </View>
                  <View className={styles.staffStat}>
                    <Text className={classnames(styles.staffStatVal, styles.green)}>
                      {staff.arrivedCount}
                    </Text>
                    <Text className={styles.staffStatName}>到店数</Text>
                  </View>
                  <View className={styles.staffStat}>
                    <Text className={classnames(styles.staffStatVal, styles.gray)}>
                      {staff.satisfactionNotes.length}
                    </Text>
                    <Text className={styles.staffStatName}>好评数</Text>
                  </View>
                </View>

                <View className={styles.notesSection}>
                  <Text className={styles.notesTitle}>
                    <Text>💬</Text>
                    <Text>会员满意度备注（{staff.satisfactionNotes.length}条）</Text>
                  </Text>
                  {staff.satisfactionNotes.length > 0 ? (
                    <View className={styles.notesList}>
                      {staff.satisfactionNotes.map((note, nIdx) => (
                        <View key={nIdx} className={styles.noteItem}>
                          <Text className={styles.noteText}>{note}</Text>
                        </View>
                      ))}
                    </View>
                  ) : (
                    <View className={styles.emptyNotes}>
                      <Text className={styles.emptyNotesText}>暂无满意度备注</Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>顾客反馈分析</Text>
            <Text className={styles.sectionHint}>今日收集</Text>
          </View>

          <View className={styles.feedbackStats}>
            <View className={styles.feedbackSummary}>
              <View className={classnames(styles.feedbackItem, styles.payment)}>
                <Text className={classnames(styles.feedbackCount, styles.blue)}>
                  {feedbackStats.quickStats.payment}
                </Text>
                <Text className={styles.feedbackLabel}>不清楚支付范围</Text>
              </View>
              <View className={classnames(styles.feedbackItem, styles.parents)}>
                <Text className={classnames(styles.feedbackCount, styles.orange)}>
                  {feedbackStats.quickStats.parents}
                </Text>
                <Text className={styles.feedbackLabel}>想给父母买药</Text>
              </View>
              <View className={classnames(styles.feedbackItem, styles.reimburse)}>
                <Text className={classnames(styles.feedbackCount, styles.green)}>
                  {feedbackStats.quickStats.reimburse}
                </Text>
                <Text className={styles.feedbackLabel}>担心不能报销</Text>
              </View>
              <View className={classnames(styles.feedbackItem, styles.other)}>
                <Text className={classnames(styles.feedbackCount, styles.purple)}>
                  {feedbackStats.quickStats.other}
                </Text>
                <Text className={styles.feedbackLabel}>其他反馈</Text>
              </View>
            </View>

            {feedbackStats.topFeedback.length > 0 && (
              <View className={styles.feedbackBars}>
                {feedbackStats.topFeedback.map((item, idx) => {
                  const percent = feedbackStats.maxCount > 0
                    ? (item.count / feedbackStats.maxCount) * 100
                    : 0
                  return (
                    <View key={item.tag} className={styles.feedbackBarRow}>
                      <Text className={styles.feedbackBarLabel}>{item.tag}</Text>
                      <View className={styles.feedbackBarTrack}>
                        <View
                          className={classnames(styles.feedbackBarFill, getFeedbackBarColor(idx))}
                          style={{ width: `${Math.max(percent, 8)}%` }}
                        />
                      </View>
                      <Text className={styles.feedbackBarVal}>{item.count}次</Text>
                    </View>
                  )
                })}
              </View>
            )}
          </View>
        </View>

        {needTomorrow && (
          <View className={styles.section}>
            <View className={styles.reminderCard}>
              <View className={styles.reminderIcon}>
                <Text>📌</Text>
              </View>
              <View className={styles.reminderContent}>
                <Text className={styles.reminderTitle}>明日重点提醒</Text>
                <Text className={styles.reminderDesc}>
                  还有 {pendingCount} 位会员今日未完成跟进，
                  建议明天一早优先处理「权益快过期」的会员，
                  避免权益过期导致会员不满。陈阿姨的测血糖权益仅剩3天，请特别关注。
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  )
}

export default ReviewPage
