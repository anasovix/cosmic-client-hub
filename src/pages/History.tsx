import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"
import type { Client } from "@/components/ClientForm"

export default function History() {
  const [history, setHistory] = useState<Client[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("history") || "[]")
    setHistory(savedHistory)
  }, [])

  const clearHistory = () => {
    localStorage.setItem("history", "[]")
    setHistory([])
    toast({
      title: "Success",
      description: "History cleared successfully"
    })
  }

  const totalRevenue = history.reduce((sum, client) => sum + client.cost, 0)

  return (
    <div className="container max-w-4xl mx-auto p-4">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Daily History</h2>
          <div className="space-x-4">
            <span className="text-sm">
              Total Revenue: <span className="font-bold text-primary">{totalRevenue} DH</span>
            </span>
            <Button variant="destructive" size="sm" onClick={clearHistory}>
              Clear History
            </Button>
          </div>
        </div>

        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4">
            {history.map((client) => (
              <Card key={client.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{client.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {client.session === "30min" ? "30 Minutes" : "1 Hour"} - {client.cost} DH
                      {client.isPromo && " (Promo)"}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(client.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  )
}