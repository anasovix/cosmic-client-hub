import { useState } from "react"
import { ClientForm, type Client } from "@/components/ClientForm"
import { ClientList } from "@/components/ClientList"

export default function Dashboard() {
  const [clients, setClients] = useState<Client[]>([])

  const handleAddClient = (client: Client) => {
    setClients((prev) => [...prev, client])
  }

  const handlePayClient = (client: Client) => {
    setClients((prev) => prev.filter((c) => c.id !== client.id))
    // Store in localStorage for history
    const history = JSON.parse(localStorage.getItem("history") || "[]")
    localStorage.setItem("history", JSON.stringify([...history, client]))
  }

  const handleDeleteClient = (clientId: string) => {
    setClients((prev) => prev.filter((c) => c.id !== clientId))
  }

  return (
    <div className="container max-w-7xl mx-auto p-4 space-y-6 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-8">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold mb-4">Add New Client</h2>
        <ClientForm onAddClient={handleAddClient} />
      </div>
      
      <div>
        <ClientList
          clients={clients}
          onPayClient={handlePayClient}
          onDeleteClient={handleDeleteClient}
        />
      </div>
    </div>
  )
}