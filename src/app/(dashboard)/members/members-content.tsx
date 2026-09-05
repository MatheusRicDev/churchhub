"use client"

import { useEffect, useState, useCallback } from "react"
import { Plus, Pencil, Trash2, Search, Phone, Calendar, User, Mail, MapPin, Heart, Church, BookOpen, Users, Link, Unlink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Table } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Pagination } from "@/components/ui/pagination"
import { Loading } from "@/components/ui/loading"
import { Modal } from "@/components/ui/modal"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { EmptyState } from "@/components/ui/empty-state"
import {
  getMembersAction,
  createMemberAction,
  updateMemberAction,
  deleteMemberAction,
} from "@/actions/member-actions"
import {
  getFamilyRelationsAction,
  createFamilyRelationAction,
  deleteFamilyRelationAction,
} from "@/actions/family-actions"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import type { MemberData, FamilyRelationData } from "@/types"

const ITEMS_PER_PAGE = 10

const maritalOptions = [
  { value: "solteiro", label: "Solteiro(a)" },
  { value: "casado", label: "Casado(a)" },
  { value: "divorciado", label: "Divorciado(a)" },
  { value: "viuvo", label: "Viúvo(a)" },
]

const genderOptions = [
  { value: "masculino", label: "Masculino" },
  { value: "feminino", label: "Feminino" },
]

export function MembersContent() {
  const [members, setMembers] = useState<MemberData[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<MemberData | null>(null)
  const [editingMember, setEditingMember] = useState<MemberData | null>(null)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState("")
  const [familyRelations, setFamilyRelations] = useState<FamilyRelationData[]>([])
  const [relationModalOpen, setRelationModalOpen] = useState(false)
  const [relationType, setRelationType] = useState("spouse")
  const [relationMemberId, setRelationMemberId] = useState("")
  const [savingRelation, setSavingRelation] = useState(false)

  const loadMembers = useCallback(async () => {
    const data = await getMembersAction()
    setMembers(data as MemberData[])
    setLoading(false)
  }, [])

  useEffect(() => {
    loadMembers()
  }, [loadMembers])

  const filtered = members.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    (m.email && m.email.toLowerCase().includes(search.toLowerCase()))
  )

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  )

  async function handleSave(formData: FormData) {
    setSaving(true)
    setFormError("")
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      phoneWhatsApp: formData.get("phoneWhatsApp") === "on",
      birthDate: formData.get("birthDate") as string,
      gender: formData.get("gender") as string,
      maritalStatus: formData.get("maritalStatus") as string,
      baptized: formData.get("baptized") === "on",
      ministry: formData.get("ministry") as string,
      address: formData.get("address") as string,
      number: formData.get("number") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      notes: formData.get("notes") as string,
    }

    try {
      if (editingMember) {
        await updateMemberAction(editingMember.id, data)
      } else {
        await createMemberAction(data)
      }

      setSaving(false)
      setModalOpen(false)
      setEditingMember(null)
      loadMembers()
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Erro ao salvar")
      setSaving(false)
    }
  }

  function handleEdit(member: MemberData) {
    setEditingMember(member)
    setModalOpen(true)
  }

  function handleView(member: MemberData) {
    setSelectedMember(member)
    setDetailOpen(true)
    getFamilyRelationsAction(member.id).then((rels) => {
      setFamilyRelations(rels as FamilyRelationData[])
    })
  }

  async function handleDelete(id: string) {
    if (confirm("Tem certeza que deseja excluir este membro?")) {
      await deleteMemberAction(id)
      loadMembers()
    }
  }

  function handleNew() {
    setEditingMember(null)
    setModalOpen(true)
  }

  async function handleAddRelation(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedMember || !relationMemberId) return
    setSavingRelation(true)
    await createFamilyRelationAction({
      fromId: selectedMember.id,
      toId: relationMemberId,
      type: relationType,
    })
    setSavingRelation(false)
    setRelationModalOpen(false)
    setRelationMemberId("")
    const rels = await getFamilyRelationsAction(selectedMember.id)
    setFamilyRelations(rels as FamilyRelationData[])
  }

  async function handleDeleteRelation(id: string) {
    await deleteFamilyRelationAction(id)
    if (selectedMember) {
      const rels = await getFamilyRelationsAction(selectedMember.id)
      setFamilyRelations(rels as FamilyRelationData[])
    }
  }

  const relationTypes = [
    { value: "spouse", label: "Cônjuge" },
    { value: "parent", label: "Pai/Mãe" },
    { value: "child", label: "Filho(a)" },
    { value: "sibling", label: "Irmão(ã)" },
  ]

  function formatRelation(rel: FamilyRelationData, memberId: string) {
    const isFrom = rel.fromId === memberId
    const other = isFrom ? rel.to : rel.from
    if (!other) return ""

    const labels: Record<string, string> = {
      spouse: isFrom ? "Cônjuge" : "Cônjuge",
      parent: isFrom ? "Pai/Mãe de" : "Filho(a) de",
      child: isFrom ? "Filho(a) de" : "Pai/Mãe de",
      sibling: isFrom ? "Irmão(ã) de" : "Irmão(ã) de",
    }

    return `${labels[rel.type] || rel.type} ${other.name}`
  }

  const otherMembers = members.filter((m) => m.id !== selectedMember?.id)

  if (loading) return <Loading />

  const formatAddress = (m: MemberData) => {
    const parts = [m.address, m.number, m.complement].filter(Boolean)
    return parts.length > 0 ? parts.join(", ") : null
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumb items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Membros" }]} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            Membros
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            {members.length} membro(s) cadastrado(s)
          </p>
        </div>
        <Button onClick={handleNew}>
          <Plus className="h-4 w-4" />
          Novo Membro
        </Button>
      </div>

      <Card>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              placeholder="Pesquisar por nome ou email..."
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-neutral-200 bg-white text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500 transition-colors"
            />
          </div>
        </div>

        {members.length === 0 ? (
          <EmptyState
            title="Nenhum membro cadastrado"
            description="Cadastre o primeiro membro da sua igreja."
            action={{ label: "Cadastrar Membro", onClick: handleNew }}
          />
        ) : (
          <>
            <Table
              columns={[
                {
                  key: "name",
                  header: "Nome",
                  render: (m) => {
                    const member = m as unknown as MemberData
                    return (
                      <span className="font-medium text-neutral-900 dark:text-neutral-100">
                        {member.name}
                      </span>
                    )
                  },
                },
                {
                  key: "email",
                  header: "Email",
                },
                {
                  key: "phone",
                  header: "Telefone",
                  render: (m) => {
                    const member = m as unknown as MemberData
                    return (
                      <span className="flex items-center gap-1.5">
                        {member.phone || "-"}
                        {member.phoneWhatsApp && (
                          <svg className="h-3.5 w-3.5 text-emerald-500" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                          </svg>
                        )}
                      </span>
                    )
                  },
                },
                {
                  key: "baptized",
                  header: "Batizado",
                  render: (m) => {
                    const member = m as unknown as MemberData
                    return (
                      <Badge variant={member.baptized ? "success" : "default"}>
                        {member.baptized ? "Sim" : "Não"}
                      </Badge>
                    )
                  },
                },
                {
                  key: "ministry",
                  header: "Ministério",
                },
                {
                  key: "actions",
                  header: "",
                  className: "w-24 text-right",
                  render: (m) => {
                    const member = m as unknown as MemberData
                    return (
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleEdit(member) }}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 dark:hover:text-neutral-300 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(member.id) }}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )
                  },
                },
              ]}
              data={paginated as unknown as Record<string, unknown>[]}
              onRowClick={(m) => handleView(m as unknown as MemberData)}
            />
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingMember(null) }}
        title={editingMember ? "Editar Membro" : "Novo Membro"}
        size="lg"
      >
        <form action={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nome"
              name="name"
              defaultValue={editingMember?.name || ""}
              required
            />
            <Input
              label="Email"
              name="email"
              type="email"
              defaultValue={editingMember?.email || ""}
            />
            <Input
              label="Telefone"
              name="phone"
              defaultValue={editingMember?.phone || ""}
            />
            <div className="flex items-end pb-2">
              <Checkbox
                label="WhatsApp"
                name="phoneWhatsApp"
                defaultChecked={editingMember?.phoneWhatsApp || false}
              />
            </div>
            <Input
              label="Data de Nascimento"
              name="birthDate"
              type="date"
              defaultValue={
                editingMember?.birthDate
                  ? new Date(editingMember.birthDate).toISOString().split("T")[0]
                  : ""
              }
            />
            <Select
              label="Gênero"
              name="gender"
              options={genderOptions}
              placeholder="Selecione..."
              defaultValue={editingMember?.gender || ""}
            />
            <Select
              label="Estado Civil"
              name="maritalStatus"
              options={maritalOptions}
              placeholder="Selecione..."
              defaultValue={editingMember?.maritalStatus || ""}
            />
            <Input
              label="Ministério"
              name="ministry"
              defaultValue={editingMember?.ministry || ""}
            />
            <div className="flex items-end pb-2">
              <Checkbox
                label="Batizado"
                name="baptized"
                defaultChecked={editingMember?.baptized || false}
              />
            </div>
            <Input
              label="CEP"
              name="cep"
              placeholder="00000-000"
              defaultValue=""
              onChange={async (e) => {
                const cep = e.target.value.replace(/\D/g, "")
                if (cep.length === 8) {
                  e.target.disabled = true
                  try {
                    const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
                    const data = await res.json()
                    if (!data.erro) {
                      const form = e.target.closest("form")
                      const g = (n: string) =>
                        form?.querySelector<HTMLInputElement>(`[name="${n}"]`)
                      const addr = g("address")
                      const city = g("city")
                      const state = g("state")
                      if (addr) addr.value = data.logradouro
                      if (city) city.value = data.localidade
                      if (state) state.value = data.uf
                      g("number")?.focus()
                    }
                  } finally {
                    e.target.disabled = false
                  }
                }
              }}
            />
            <Input
              label="Endereço"
              name="address"
              defaultValue={editingMember?.address || ""}
              required
            />
            <Input
              label="Número"
              name="number"
              defaultValue={editingMember?.number || ""}
            />
            <Input
              label="Complemento"
              name="complement"
              placeholder="Apto, Bloco, etc."
              defaultValue={editingMember?.complement || ""}
            />
            <Input
              label="Cidade"
              name="city"
              defaultValue={editingMember?.city || ""}
            />
            <Input
              label="Estado"
              name="state"
              defaultValue={editingMember?.state || ""}
            />
          </div>
          <Textarea
            label="Observações"
            name="notes"
            defaultValue={editingMember?.notes || ""}
          />
          {formError && (
            <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">{formError}</p>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => { setModalOpen(false); setEditingMember(null) }}
            >
              Cancelar
            </Button>
            <Button type="submit" loading={saving}>
              {editingMember ? "Salvar" : "Cadastrar"}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={detailOpen}
        onClose={() => { setDetailOpen(false); setSelectedMember(null) }}
        title="Detalhes do Membro"
        size="sm"
      >
        {selectedMember && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900">
              <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-sm font-medium text-neutral-600 dark:text-neutral-300">
                {selectedMember.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-neutral-900 dark:text-neutral-100">{selectedMember.name}</p>
                <p className="text-xs text-neutral-500">
                  Membro desde {new Date(selectedMember.createdAt).toLocaleDateString("pt-BR")}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-neutral-400 flex-shrink-0" />
                <span className="text-neutral-700 dark:text-neutral-300">
                  {selectedMember.email || "Não informado"}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-neutral-400 flex-shrink-0" />
                <span className="text-neutral-700 dark:text-neutral-300">
                  {selectedMember.phone || "Não informado"}
                </span>
                {selectedMember.phoneWhatsApp && (
                  <Badge variant="success">WhatsApp</Badge>
                )}
              </div>
              {selectedMember.birthDate && (
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-neutral-400 flex-shrink-0" />
                  <span className="text-neutral-700 dark:text-neutral-300">
                    {new Date(selectedMember.birthDate).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm">
                <User className="h-4 w-4 text-neutral-400 flex-shrink-0" />
                <span className="text-neutral-700 dark:text-neutral-300">
                  {selectedMember.gender === "masculino" ? "Masculino" : selectedMember.gender === "feminino" ? "Feminino" : "Não informado"}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Heart className="h-4 w-4 text-neutral-400 flex-shrink-0" />
                <span className="text-neutral-700 dark:text-neutral-300">
                  {selectedMember.maritalStatus
                    ? maritalOptions.find(o => o.value === selectedMember.maritalStatus)?.label || selectedMember.maritalStatus
                    : "Não informado"}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Church className="h-4 w-4 text-neutral-400 flex-shrink-0" />
                <span className="text-neutral-700 dark:text-neutral-300">
                  {selectedMember.ministry || "Nenhum"}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <BookOpen className="h-4 w-4 text-neutral-400 flex-shrink-0" />
                <Badge variant={selectedMember.baptized ? "success" : "default"}>
                  {selectedMember.baptized ? "Batizado" : "Não batizado"}
                </Badge>
              </div>
              {(selectedMember.address || selectedMember.number || selectedMember.city || selectedMember.state) && (
                <div className="flex gap-3 text-sm pt-2 border-t border-neutral-100 dark:border-neutral-800">
                  <MapPin className="h-4 w-4 text-neutral-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-neutral-500 mb-1">Endereço</p>
                    <p className="text-neutral-700 dark:text-neutral-300">
                      {formatAddress(selectedMember)}
                      {selectedMember.city && ` - ${selectedMember.city}`}
                      {selectedMember.state && `, ${selectedMember.state}`}
                    </p>
                  </div>
                </div>
              )}
              {selectedMember.notes && (
                <div className="flex gap-3 text-sm pt-2 border-t border-neutral-100 dark:border-neutral-800">
                  <div>
                    <p className="text-xs font-medium text-neutral-500 mb-1">Observações</p>
                    <p className="text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap">
                      {selectedMember.notes}
                    </p>
                  </div>
                </div>
              )}
              <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-neutral-500">Família</p>
                  <button
                    onClick={() => setRelationModalOpen(true)}
                    className="text-xs text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors cursor-pointer"
                  >
                    <Link className="h-3 w-3 inline mr-1" />
                    Adicionar
                  </button>
                </div>
                {familyRelations.length > 0 ? (
                  <div className="space-y-1.5">
                    {familyRelations.map((rel) => (
                      <div key={rel.id} className="flex items-center justify-between group">
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="h-3.5 w-3.5 text-neutral-400 flex-shrink-0" />
                          <span className="text-neutral-700 dark:text-neutral-300">
                            {formatRelation(rel, selectedMember.id)}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDeleteRelation(rel.id)}
                          className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-neutral-400 hover:text-red-500 transition-all cursor-pointer"
                        >
                          <Unlink className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-neutral-400">Nenhum familiar vinculado</p>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={relationModalOpen}
        onClose={() => { setRelationModalOpen(false); setRelationMemberId("") }}
        title="Adicionar Familiar"
        size="sm"
      >
        <form onSubmit={handleAddRelation} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Parentesco
            </label>
            <select
              value={relationType}
              onChange={(e) => setRelationType(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-neutral-200 bg-white text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 transition-colors"
            >
              {relationTypes.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Membro
            </label>
            <select
              value={relationMemberId}
              onChange={(e) => setRelationMemberId(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-neutral-200 bg-white text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 transition-colors"
            >
              <option value="">Selecione um membro...</option>
              {otherMembers.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => { setRelationModalOpen(false); setRelationMemberId("") }}
            >
              Cancelar
            </Button>
            <Button type="submit" loading={savingRelation} disabled={!relationMemberId}>
              Adicionar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
