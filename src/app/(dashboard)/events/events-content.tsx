"use client"

import { useEffect, useState, useCallback } from "react"
import { Plus, Pencil, Trash2, Search, Calendar, MapPin, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Modal } from "@/components/ui/modal"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Table } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loading } from "@/components/ui/loading"
import { EmptyState } from "@/components/ui/empty-state"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import {
  getEventsAction,
  createEventAction,
  updateEventAction,
  deleteEventAction,
} from "@/actions/event-actions"
import type { EventData } from "@/types"

export function EventsContent() {
  const [events, setEvents] = useState<EventData[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null)
  const [editingEvent, setEditingEvent] = useState<EventData | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const loadEvents = useCallback(async () => {
    const data = await getEventsAction()
    setEvents(data as EventData[])
    setLoading(false)
  }, [])

  useEffect(() => {
    loadEvents()
  }, [loadEvents])

  const filtered = events.filter((e) =>
    e.title.toLowerCase().includes(search.toLowerCase())
  )

  async function handleSave(formData: FormData) {
    setSaving(true)
    setError("")
    const data = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      date: formData.get("date") as string,
      location: formData.get("location") as string,
    }

    try {
      if (editingEvent) {
        await updateEventAction(editingEvent.id, data)
      } else {
        await createEventAction(data)
      }
      setModalOpen(false)
      setEditingEvent(null)
      loadEvents()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar evento")
    }

    setSaving(false)
  }

  function handleEdit(event: EventData) {
    setEditingEvent(event)
    setModalOpen(true)
  }

  function handleView(event: EventData) {
    setSelectedEvent(event)
    setDetailOpen(true)
  }

  async function handleDelete(id: string) {
    if (confirm("Tem certeza que deseja excluir este evento?")) {
      await deleteEventAction(id)
      loadEvents()
    }
  }

  function handleNew() {
    setEditingEvent(null)
    setModalOpen(true)
  }

  if (loading) return <Loading />

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumb
        items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Eventos" }]}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            Eventos
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            {events.length} evento(s)
          </p>
        </div>
        <Button onClick={handleNew}>
          <Plus className="h-4 w-4" />
          Novo Evento
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
              placeholder="Pesquisar eventos..."
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-neutral-200 bg-white text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500 transition-colors"
            />
          </div>
        </div>

        {events.length === 0 ? (
          <EmptyState
            title="Nenhum evento cadastrado"
            description="Crie eventos para sua igreja."
            action={{ label: "Criar Evento", onClick: handleNew }}
          />
        ) : (
          <Table
            columns={[
              {
                key: "title",
                header: "Título",
                render: (e) => {
                  const event = e as unknown as EventData
                  return (
                    <span className="font-medium text-neutral-900 dark:text-neutral-100">
                      {event.title}
                    </span>
                  )
                },
              },
              {
                key: "date",
                header: "Data",
                render: (e) => {
                  const event = e as unknown as EventData
                  const date = new Date(event.date)
                  const isPast = date < new Date()
                  return (
                    <Badge variant={isPast ? "default" : "success"}>
                      {date.toLocaleDateString("pt-BR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </Badge>
                  )
                },
              },
              {
                key: "location",
                header: "Local",
              },
              {
                key: "actions",
                header: "",
                className: "w-24 text-right",
                render: (e) => {
                  const event = e as unknown as EventData
                  return (
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={(ev) => { ev.stopPropagation(); handleEdit(event) }}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 dark:hover:text-neutral-300 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(ev) => { ev.stopPropagation(); handleDelete(event.id) }}
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
            onRowClick={(e) => handleView(e as unknown as EventData)}
          />
        )}
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingEvent(null) }}
        title={editingEvent ? "Editar Evento" : "Novo Evento"}
      >
        <form action={handleSave} className="space-y-4">
          <Input
            label="Título"
            name="title"
            defaultValue={editingEvent?.title || ""}
            required
          />
          <Input
            label="Data"
            name="date"
            type="datetime-local"
            min={new Date().toISOString().slice(0, 16)}
            defaultValue={
              editingEvent?.date
                ? new Date(editingEvent.date).toISOString().slice(0, 16)
                : ""
            }
            required
          />
          <Input
            label="Local"
            name="location"
            defaultValue={editingEvent?.location || ""}
          />
          {error && (
            <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}
          <Textarea
            label="Descrição"
            name="description"
            defaultValue={editingEvent?.description || ""}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => { setModalOpen(false); setEditingEvent(null) }}
            >
              Cancelar
            </Button>
            <Button type="submit" loading={saving}>
              {editingEvent ? "Salvar" : "Criar"}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={detailOpen}
        onClose={() => { setDetailOpen(false); setSelectedEvent(null) }}
        title="Detalhes do Evento"
        size="sm"
      >
        {selectedEvent && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900">
              <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-sm font-medium text-neutral-600 dark:text-neutral-300">
                {selectedEvent.title.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-neutral-900 dark:text-neutral-100">{selectedEvent.title}</p>
                <p className="text-xs text-neutral-500">
                  Criado em {new Date(selectedEvent.createdAt).toLocaleDateString("pt-BR")}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-neutral-400 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-neutral-500 mb-0.5">Data</p>
                  <span className="text-neutral-700 dark:text-neutral-300">
                    {new Date(selectedEvent.date).toLocaleDateString("pt-BR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
              {selectedEvent.location && (
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-neutral-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-neutral-500 mb-0.5">Local</p>
                    <span className="text-neutral-700 dark:text-neutral-300">
                      {selectedEvent.location}
                    </span>
                  </div>
                </div>
              )}
              {selectedEvent.description && (
                <div className="flex gap-3 text-sm pt-2 border-t border-neutral-100 dark:border-neutral-800">
                  <FileText className="h-4 w-4 text-neutral-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-neutral-500 mb-1">Descrição</p>
                    <p className="text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap">
                      {selectedEvent.description}
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
