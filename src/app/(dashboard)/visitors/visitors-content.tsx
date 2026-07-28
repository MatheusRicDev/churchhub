"use client"

import { useEffect, useState, useCallback } from "react"
import { Plus, Pencil, Trash2, Search, Smartphone, Calendar, User, Phone, MessageSquare, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Modal } from "@/components/ui/modal"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Table } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loading } from "@/components/ui/loading"
import { EmptyState } from "@/components/ui/empty-state"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import {
  getVisitorsAction,
  createVisitorAction,
  updateVisitorAction,
  deleteVisitorAction,
} from "@/actions/visitor-actions"
import type { VisitorData } from "@/types"

export function VisitorsContent() {
  const [visitors, setVisitors] = useState<VisitorData[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedVisitor, setSelectedVisitor] = useState<VisitorData | null>(null)
  const [editingVisitor, setEditingVisitor] = useState<VisitorData | null>(null)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState("")

  const loadVisitors = useCallback(async () => {
    const data = await getVisitorsAction()
    setVisitors(data as VisitorData[])
    setLoading(false)
  }, [])

  useEffect(() => {
    loadVisitors()
  }, [loadVisitors])

  const filtered = visitors.filter((v) =>
    v.name.toLowerCase().includes(search.toLowerCase())
  )

  async function handleSave(formData: FormData) {
    setSaving(true)
    setFormError("")
    const data = {
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      phoneWhatsApp: formData.get("phoneWhatsApp") === "on",
      invitedBy: formData.get("invitedBy") as string,
      address: formData.get("address") as string,
      number: formData.get("number") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      observations: formData.get("observations") as string,
    }

    if (!data.name?.trim()) {
      setFormError("Nome é obrigatório")
      setSaving(false)
      return
    }

    try {
      if (editingVisitor) {
        await updateVisitorAction(editingVisitor.id, data)
      } else {
        await createVisitorAction(data)
      }

      setSaving(false)
      setModalOpen(false)
      setEditingVisitor(null)
      loadVisitors()
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Erro ao salvar")
      setSaving(false)
    }
  }

  function handleEdit(visitor: VisitorData) {
    setEditingVisitor(visitor)
    setModalOpen(true)
  }

  function handleView(visitor: VisitorData) {
    setSelectedVisitor(visitor)
    setDetailOpen(true)
  }

  async function handleDelete(id: string) {
    if (confirm("Tem certeza que deseja excluir este visitante?")) {
      await deleteVisitorAction(id)
      loadVisitors()
    }
  }

  function handleNew() {
    setEditingVisitor(null)
    setModalOpen(true)
  }

  if (loading) return <Loading />

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumb
        items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Visitantes" }]}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            Visitantes
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            {visitors.length} visitante(s)
          </p>
        </div>
        <Button onClick={handleNew}>
          <Plus className="h-4 w-4" />
          Novo Visitante
        </Button>
      </div>

      <Card>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar por nome..."
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-neutral-200 bg-white text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500 transition-colors"
            />
          </div>
        </div>

        {visitors.length === 0 ? (
          <EmptyState
            title="Nenhum visitante registrado"
            description="Registre os visitantes da sua igreja."
            action={{ label: "Registrar Visitante", onClick: handleNew }}
          />
        ) : (
          <Table
            columns={[
              {
                key: "name",
                header: "Nome",
                render: (v) => {
                  const visitor = v as unknown as VisitorData
                  return (
                    <span className="font-medium text-neutral-900 dark:text-neutral-100">
                      {visitor.name}
                    </span>
                  )
                },
              },
              {
                key: "phone",
                header: "Telefone",
                render: (v) => {
                  const visitor = v as unknown as VisitorData
                  return (
                    <span className="flex items-center gap-1.5">
                      {visitor.phone || "-"}
                      {visitor.phoneWhatsApp && (
                        <svg className="h-3.5 w-3.5 text-emerald-500" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                      )}
                    </span>
                  )
                },
              },
              { key: "invitedBy", header: "Convidado por" },
              {
                key: "firstVisit",
                header: "1ª Visita",
                render: (v) => {
                  const visitor = v as unknown as VisitorData
                  return new Date(visitor.firstVisit).toLocaleDateString("pt-BR")
                },
              },
              {
                key: "actions",
                header: "",
                className: "w-28 text-right",
                render: (v) => {
                  const visitor = v as unknown as VisitorData
                  return (
                    <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleEdit(visitor)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 dark:hover:text-neutral-300 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(visitor.id)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )
                },
              },
            ]}
            data={filtered as unknown as Record<string, unknown>[]}
            onRowClick={(v) => handleView(v as unknown as VisitorData)}
          />
        )}
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingVisitor(null) }}
        title={editingVisitor ? "Editar Visitante" : "Novo Visitante"}
      >
        <form action={handleSave} className="space-y-4">
          <Input
            label="Nome"
            name="name"
            defaultValue={editingVisitor?.name || ""}
            required
          />
          <Input
            label="Telefone"
            name="phone"
            defaultValue={editingVisitor?.phone || ""}
          />
          <Checkbox
            label="É WhatsApp"
            name="phoneWhatsApp"
            defaultChecked={editingVisitor?.phoneWhatsApp || false}
          />
          <Input
            label="Convidado por"
            name="invitedBy"
            defaultValue={editingVisitor?.invitedBy || ""}
          />
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
            defaultValue={editingVisitor?.address || ""}
          />
          <Input
            label="Número"
            name="number"
            defaultValue={editingVisitor?.number || ""}
          />
          <Input
            label="Cidade"
            name="city"
            defaultValue={editingVisitor?.city || ""}
          />
          <Input
            label="Estado"
            name="state"
            defaultValue={editingVisitor?.state || ""}
          />
          {formError && (
            <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">{formError}</p>
          )}
          <Textarea
            label="Observações"
            name="observations"
            defaultValue={editingVisitor?.observations || ""}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => { setModalOpen(false); setEditingVisitor(null) }}
            >
              Cancelar
            </Button>
            <Button type="submit" loading={saving}>
              {editingVisitor ? "Salvar" : "Registrar"}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={detailOpen}
        onClose={() => { setDetailOpen(false); setSelectedVisitor(null) }}
        title="Detalhes do Visitante"
        size="sm"
      >
        {selectedVisitor && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900">
              <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-sm font-medium text-neutral-600 dark:text-neutral-300">
                {selectedVisitor.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-neutral-900 dark:text-neutral-100">{selectedVisitor.name}</p>
                <p className="text-xs text-neutral-500">
                  Visitante desde {new Date(selectedVisitor.firstVisit).toLocaleDateString("pt-BR")}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-neutral-400 flex-shrink-0" />
                <span className="text-neutral-700 dark:text-neutral-300">
                  {selectedVisitor.phone || "Não informado"}
                </span>
                {selectedVisitor.phoneWhatsApp && (
                  <Badge variant="success">WhatsApp</Badge>
                )}
              </div>
              <div className="flex items-center gap-3 text-sm">
                <User className="h-4 w-4 text-neutral-400 flex-shrink-0" />
                <span className="text-neutral-700 dark:text-neutral-300">
                  {selectedVisitor.invitedBy
                    ? `Convidado por ${selectedVisitor.invitedBy}`
                    : "Sem convite"}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-neutral-400 flex-shrink-0" />
                <span className="text-neutral-700 dark:text-neutral-300">
                  Primeira visita: {new Date(selectedVisitor.firstVisit).toLocaleDateString("pt-BR")}
                </span>
              </div>
              {(selectedVisitor.address || selectedVisitor.number || selectedVisitor.city || selectedVisitor.state) && (
                <div className="flex gap-3 text-sm pt-2 border-t border-neutral-100 dark:border-neutral-800">
                  <MapPin className="h-4 w-4 text-neutral-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-neutral-500 mb-1">Endereço</p>
                    <p className="text-neutral-700 dark:text-neutral-300">
                      {[selectedVisitor.address, selectedVisitor.number].filter(Boolean).join(", ")}
                      {selectedVisitor.city && ` - ${selectedVisitor.city}`}
                      {selectedVisitor.state && `, ${selectedVisitor.state}`}
                    </p>
                  </div>
                </div>
              )}
              {selectedVisitor.observations && (
                <div className="flex gap-3 text-sm pt-2 border-t border-neutral-100 dark:border-neutral-800">
                  <MessageSquare className="h-4 w-4 text-neutral-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-neutral-500 mb-1">Observações</p>
                    <p className="text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap">
                      {selectedVisitor.observations}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
