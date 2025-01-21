import { useState, useEffect } from "react"
import { ClientForm, type Client } from "@/components/ClientForm"
import { ClientList } from "@/components/ClientList"
import { useToast } from "@/components/ui/use-toast"

export default function Dashboard() {
  const [clients, setClients] = useState<Client[]>([])
  const { toast } = useToast()

  // Load clients from localStorage when component mounts
  useEffect(() => {
    const savedClients = localStorage.getItem("currentClients")
    if (savedClients) {
      try {
        setClients(JSON.parse(savedClients))
        console.log("Loaded clients from localStorage:", JSON.parse(savedClients))
      } catch (error) {
        console.error("Error loading clients from localStorage:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load saved clients"
        })
      }
    }
  }, [])

  // Save clients to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("currentClients", JSON.stringify(clients))
    console.log("Saved clients to localStorage:", clients)
  }, [clients])

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