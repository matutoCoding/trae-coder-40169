import React, { useState, useMemo } from 'react'
import { View, Text, ScrollView, Button, Image, Input, Textarea } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import { mockMembers, mockStaff } from '@/data/mock'
import type { Member, FollowStatus, MemberCategory } from '@/types'
import { MEMBER_CATEGORY_OPTIONS, FOLLOW_STATUS_OPTIONS, FEEDBACK_TAGS } from '@/types'

interface DraftState {
  status: FollowStatus
  feedbackTags: string[]
  feedbackText: string
}

const FollowPage: React.FC = () => {
  const [members, setMembers] = useState<Member[]>(mockMembers)
  const [searchText, setSearchText] = useState('')
  const [activeCategory, setActiveCategory] = useState<MemberCategory | 'all'>('all')
  const [activeStatus, setActiveStatus] = useState<FollowStatus | 'all'>('all')
  const [expandedCard, setExpandedCard] = useState<string | null>(null)
  const [drafts, setDrafts] = useState<Record<string, DraftState>>({})

  const getDraft = (memberId: string): DraftState => {
    if (drafts[memberId]) return drafts[memberId]
    const m = members.find(x => x.id === memberId)
    return {
      status: m?.followStatus || 'pending',
      feedbackTags: m?.feedbackTags || [],
      feedbackText: m?.feedback || ''
    }
  }

  const updateDraft = (memberId: string, patch: Partial<DraftState>) => {
    setDrafts(prev => ({
      ...prev,
      [memberId]: { ...getDraft(memberId), ...patch }
    }))
  }

  const filteredMembers = useMemo(() => {
    return members.filter(m => {
      if (searchText && !m.name.includes(searchText) && !m.phone.includes(searchText)) {
        return false
      }
      if (activeCategory !== 'all' && m.category !== activeCategory) {
        return false
      }
      if (activeStatus !== 'all' && m.followStatus !== activeStatus) {
        return false
      }
      return true
    })
  }, [members, searchText, activeCategory, activeStatus])

  const summaryCounts = useMemo(() => ({
    contacted: members.filter(m => m.followStatus === 'contacted').length,
    arrived: members.filter(m => m.followStatus === 'arrived').length,
    redeemed: members.filter(m => m.followStatus === 'redeemed').length
  }), [members])

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: members.length }
    FOLLOW_STATUS_OPTIONS.forEach(opt => {
      counts[opt.value] = members.filter(m => m.followStatus === opt.value).length
    })
    return counts
  }, [members])

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: members.length }
    MEMBER_CATEGORY_OPTIONS.forEach(opt => {
      counts[opt.value] = members.filter(m => m.category === opt.value).length
    })
    return counts
  }, [members])

  const toggleExpand = (id: string) => {
    setExpandedCard(prev => (prev === id ? null : id))
  }

  const handleTagToggle = (memberId: string, tag: string) => {
    const draft = getDraft(memberId)
    const hasTag = draft.feedbackTags.includes(tag)
    updateDraft(memberId, {
      feedbackTags: hasTag
        ? draft.feedbackTags.filter(t => t !== tag)
        : [...draft.feedbackTags, tag]
    })
  }

  const handleStatusChange = (memberId: string, status: FollowStatus) => {
    const draft = getDraft(memberId)
    if (draft.status === status && status === 'pending') {
      updateDraft(memberId, { status: 'pending' })
    } else {
      updateDraft(memberId, { status })
    }
  }

  const handleSave = (memberId: string) => {
    const draft = getDraft(memberId)
    setMembers(prev =>
      prev.map(m =>
        m.id === memberId
          ? {
              ...m,
              followStatus: draft.status,
              feedbackTags: draft.feedbackTags,
              feedback: draft.feedbackText,
              lastContactDate: new Date().toISOString().split('T')[0],
              arrivedDate: draft.status === 'arrived' || draft.status === 'redeemed'
                ? new Date().toISOString().split('T')[0]
                : m.arrivedDate,
              redeemedDate: draft.status === 'redeemed'
                ? new Date().toISOString().split('T')[0]
                : m.redeemedDate
            }
          : m
      )
    )
    setDrafts(prev => {
      const next = { ...prev }
      delete next[memberId]
      return next
    })
    const statusLabel = FOLLOW_STATUS_OPTIONS.find(o => o.value === draft.status)?.label || draft.status
    Taro.showToast({ title: `已标记为${statusLabel}`, icon: 'success' })
    const member = members.find(m => m.id === memberId)
    console.log(`[Follow] 更新会员 ${member?.name} 状态为: ${draft.status}, 反馈标签: ${draft.feedbackTags.join(', ')}`)
  }

  const getStaffName = (staffId?: string) => {
    if (!staffId) return '未分配'
    const staff = mockStaff.find(s => s.id === staffId)
    return staff?.name || '未分配'
  }

  const renderExtraInfo = (member: Member) => {
    const rows: { label: string; value: string; highlight?: boolean }[] = []
    if (member.balance) {
      rows.push({ label: '个账余额', value: `¥${member.balance.toLocaleString()}`, highlight: true })
    }
    if (member.chronicDisease) {
      rows.push({ label: '慢病类型', value: member.chronicDisease })
    }
    if (member.nextPurchaseDate) {
      rows.push({ label: '下次购药', value: member.nextPurchaseDate, highlight: true })
    }
    if (member.benefitExpireDate) {
      rows.push({ label: '权益到期', value: member.benefitExpireDate, highlight: true })
    }
    if (member.lastContactDate) {
      rows.push({ label: '上次联系', value: member.lastContactDate })
    }
    rows.push({ label: '负责店员', value: getStaffName(member.assignedStaffId) })
    return rows
  }

  const followStatusList: FollowStatus[] = ['contacted', 'arrived', 'redeemed', 'unneeded']

  return (
    <View className={styles.page}>
      <View className={styles.stickyHeader}>
        <View className={styles.searchBar}>
          <View className={styles.searchInputWrap}>
            <Text className={styles.searchIcon}>🔍</Text>
            <Input
              className={styles.searchInput}
              placeholder='搜索会员姓名或手机号'
              value={searchText}
              onInput={e => setSearchText(e.detail.value)}
            />
          </View>
          <Button className={styles.filterBtn}>⚙️</Button>
        </View>

        <View className={styles.filterTabs}>
          <ScrollView scrollX className={styles.tabsRow}>
            <Button
              className={classnames(styles.tabItem, activeCategory === 'all' && styles.active)}
              onClick={() => setActiveCategory('all')}
            >
              全部 ({categoryCounts.all})
            </Button>
            {MEMBER_CATEGORY_OPTIONS.map(opt => (
              <Button
                key={opt.value}
                className={classnames(styles.tabItem, activeCategory === opt.value && styles.active)}
                onClick={() => setActiveCategory(opt.value)}
              >
                {opt.label} ({categoryCounts[opt.value] || 0})
              </Button>
            ))}
          </ScrollView>
        </View>

        <View className={styles.statusTabs}>
          <View className={styles.statusList}>
            <Button
              className={classnames(styles.statusItem, activeStatus === 'all' && styles.active)}
              onClick={() => setActiveStatus('all')}
            >
              <View className={styles.statusDot} style={{ background: activeStatus === 'all' ? '#fff' : '#86909C' }} />
              <Text>全部状态</Text>
              <View className={styles.countBadge}>{statusCounts.all}</View>
            </Button>
            {FOLLOW_STATUS_OPTIONS.map(opt => (
              <Button
                key={opt.value}
                className={classnames(styles.statusItem, activeStatus === opt.value && styles.active)}
                onClick={() => setActiveStatus(opt.value)}
                style={activeStatus !== opt.value ? { color: opt.color } : undefined}
              >
                <View className={styles.statusDot} />
                <Text>{opt.label}</Text>
                <View className={styles.countBadge}>{statusCounts[opt.value] || 0}</View>
              </Button>
            ))}
          </View>
        </View>
      </View>

      <ScrollView scrollY className={styles.content} style={{ paddingBottom: '200rpx' }}>
        {filteredMembers.length > 0 ? (
          <View className={styles.memberList}>
            {filteredMembers.map(member => {
              const draft = getDraft(member.id)
              const isExpanded = expandedCard === member.id
              const hasFeedback = (member.feedbackTags?.length || 0) > 0 || member.feedback
              const categoryOpt = MEMBER_CATEGORY_OPTIONS.find(o => o.value === member.category)

              return (
                <View key={member.id} className={styles.memberCard}>
                  <View className={styles.cardTop}>
                    <View className={styles.memberInfo}>
                      <Image className={styles.avatar} src={member.avatar} mode='aspectFill' />
                      <View className={styles.infoMain}>
                        <View className={styles.nameRow}>
                          <Text className={styles.name}>{member.name}</Text>
                          <Text className={styles.phone}>{member.phone}</Text>
                          {categoryOpt && (
                            <View
                              className={classnames(styles.categoryTag, styles[member.category])}
                            >
                              <Text>{categoryOpt.label}</Text>
                            </View>
                          )}
                        </View>
                        <View className={styles.descRow}>
                          <Text>{member.categoryDesc}</Text>
                        </View>
                      </View>
                    </View>

                    <View className={styles.extraInfo}>
                      {renderExtraInfo(member).map((row, idx) => (
                        <View key={idx} className={styles.extraRow}>
                          <Text className={styles.extraLabel}>{row.label}</Text>
                          <Text className={classnames(styles.extraValue, row.highlight && styles.highlight)}>
                            {row.value}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  <View className={styles.statusSection}>
                    <Text className={styles.sectionLabel}>跟进状态</Text>
                    <View className={styles.statusOptions}>
                      {followStatusList.map(s => {
                        const opt = FOLLOW_STATUS_OPTIONS.find(o => o.value === s)!
                        const isActive = draft.status === s
                        return (
                          <Button
                            key={s}
                            className={classnames(
                              styles.statusOption,
                              isActive && styles.active,
                              isActive && styles[s]
                            )}
                            onClick={() => handleStatusChange(member.id, s)}
                          >
                            <Text>{opt.label}</Text>
                          </Button>
                        )
                      })}
                    </View>
                  </View>

                  <View className={styles.feedbackSection}>
                    <View className={styles.feedbackHeader}>
                      <Text className={styles.feedbackLabel}>
                        📝 顾客反馈 {hasFeedback && !isExpanded && '（已记录）'}
                      </Text>
                      <Button
                        className={styles.toggleBtn}
                        onClick={() => toggleExpand(member.id)}
                      >
                        {isExpanded ? '收起' : (hasFeedback ? '查看/修改' : '展开记录')}
                      </Button>
                    </View>

                    {isExpanded && (
                      <>
                        {hasFeedback && (
                          <View className={styles.savedFeedback} style={{ marginBottom: '24rpx' }}>
                            {(member.feedbackTags?.length || 0) > 0 && (
                              <View className={styles.savedTags}>
                                {member.feedbackTags!.map(tag => (
                                  <View key={tag} className={styles.savedTag}>
                                    <Text>{tag}</Text>
                                  </View>
                                ))}
                              </View>
                            )}
                            {member.feedback && (
                              <Text className={styles.savedText}>{member.feedback}</Text>
                            )}
                          </View>
                        )}

                        <View className={styles.tagGroup}>
                          {FEEDBACK_TAGS.map(tag => (
                            <Button
                              key={tag}
                              className={classnames(
                                styles.tagChip,
                                draft.feedbackTags.includes(tag) && styles.selected
                              )}
                              onClick={() => handleTagToggle(member.id, tag)}
                            >
                              <Text>
                                {draft.feedbackTags.includes(tag) && '✓ '}
                                {tag}
                              </Text>
                            </Button>
                          ))}
                        </View>

                        <View className={styles.textareaWrap}>
                          <Textarea
                            className={styles.feedbackTextarea}
                            placeholder='输入详细反馈内容，例如：顾客想了解处方药购买流程...'
                            value={draft.feedbackText}
                            maxlength={200}
                            onInput={e => updateDraft(member.id, { feedbackText: e.detail.value })}
                          />
                          <View className={styles.textareaCount}>
                            <Text>{draft.feedbackText.length}/200</Text>
                          </View>
                        </View>
                      </>
                    )}
                  </View>

                  <View className={styles.cardFooter}>
                    <Button
                      className={styles.saveBtn}
                      onClick={() => handleSave(member.id)}
                    >
                      保存跟进记录
                    </Button>
                  </View>
                </View>
              )
            })}
          </View>
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>🔍</Text>
            <Text className={styles.emptyTitle}>未找到匹配的会员</Text>
            <Text className={styles.emptyDesc}>试试调整筛选条件或搜索关键词</Text>
          </View>
        )}
      </ScrollView>

      <View className={styles.summaryBar}>
        <View className={styles.summaryItem}>
          <Text className={classnames(styles.summaryNum, styles.contacted)}>
            {summaryCounts.contacted}
          </Text>
          <Text className={styles.summaryLab}>已联系</Text>
        </View>
        <View className={styles.summaryItem}>
          <Text className={classnames(styles.summaryNum, styles.arrived)}>
            {summaryCounts.arrived}
          </Text>
          <Text className={styles.summaryLab}>已到店</Text>
        </View>
        <View className={styles.summaryItem}>
          <Text className={classnames(styles.summaryNum, styles.redeemed)}>
            {summaryCounts.redeemed}
          </Text>
          <Text className={styles.summaryLab}>已核销</Text>
        </View>
      </View>
    </View>
  )
}

export default FollowPage
