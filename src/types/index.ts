export interface MemberData {
  id: string
  churchId: string
  name: string
  email: string | null
  phone: string | null
  phoneWhatsApp: boolean
  birthDate: Date | null
  gender: string | null
  maritalStatus: string | null
  baptized: boolean
  ministry: string | null
  address: string | null
  number: string | null
  complement: string | null
  city: string | null
  state: string | null
  notes: string | null
  createdAt: Date
  updatedAt: Date
}

export interface EventData {
  id: string
  churchId: string
  title: string
  description: string | null
  date: Date
  location: string | null
  createdAt: Date
}

export interface VisitorData {
  id: string
  churchId: string
  name: string
  phone: string | null
  phoneWhatsApp: boolean
  invitedBy: string | null
  address: string | null
  number: string | null
  city: string | null
  state: string | null
  firstVisit: Date
  observations: string | null
}

export interface DashboardStats {
  totalMembers: number
  totalVisitors: number
  totalEvents: number
  newMembersThisMonth: number
  membersGrowth: number
  visitorsGrowth: number
  eventsGrowth: number
  newMembersGrowth: number
}

export interface GrowthDataPoint {
  month: string
  members: number
}

export interface FamilyRelationData {
  id: string
  churchId: string
  fromId: string
  toId: string
  type: string
  createdAt: Date
  from?: MemberData
  to?: MemberData
}

export interface UpcomingEvent {
  id: string
  title: string
  date: Date
  location: string | null
}
