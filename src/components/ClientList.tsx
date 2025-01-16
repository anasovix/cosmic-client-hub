import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Client } from "./ClientForm"
import { useToast } from "@/components/ui/use-toast"

type Props = {
  clients: Client[]
  onPayClient: (client: Client) => void
  onDeleteClient: (clientId: string) => void
}

export function ClientList({ clients, onPayClient, onDeleteClient }: Props) {
  const { toast } = useToast()
  
  const totalRevenue = clients.reduce((sum, client) => sum + client.cost, 0)

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Unpaid Clients</h2>
        <div className="text-sm">
          Total: <span className="font-bold text-primary">{totalRevenue} DH</span>
        </div>
      </div>

      <ScrollArea className="h-[300px] pr-4">
        <div className="space-y-4">
          {clients.map((client) => (
            <Card key={client.id} className="p-4 flex justify-between items-center">
              <div>
                <p className="font-medium">{client.name}</p>
                <p className="text-sm text-muted-foreground">
                  {client.session === "30min" ? "30 Minutes" : "1 Hour"} - {client.cost} DH
                  {client.isPromo && " (Promo)"}
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onPayClient(client)
                    toast({
                      title: "Success",
                      description: "Client marked as paid"
                    })
                  }}
                >
                  Pay
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    onDeleteClient(client.id)
                    toast({
                      title: "Success",
                      description: "Client removed"
                    })
                  }}
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </Card>
  )
}