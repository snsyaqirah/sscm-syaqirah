import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChargeListTable } from "@/features/charges/ChargeListTable";
import { ChargeFormDialog } from "@/features/charges/ChargeFormDialog";
import { DeleteChargeDialog } from "@/features/charges/DeleteChargeDialog";
import { useCharges } from "@/hooks/useCharges";
import type { Charge } from "@/types/charge";
import { Plus } from "lucide-react";

function App() {
  const { charges, addCharge, updateCharge, deleteCharge } = useCharges();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingCharge, setEditingCharge] = useState<Charge | null>(null);
  const [deletingCharge, setDeletingCharge] = useState<Charge | null>(null);

  const handleAddCharge = () => {
    setEditingCharge(null);
    setIsFormOpen(true);
  };

  const handleEditCharge = (charge: Charge) => {
    setEditingCharge(charge);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (chargeId: string) => {
    const charge = charges.find((c) => c.charge_id === chargeId);
    if (charge) {
      setDeletingCharge(charge);
      setIsDeleteDialogOpen(true);
    }
  };

  const handleFormSubmit = (charge: Charge) => {
    if (editingCharge) {
      updateCharge(charge.charge_id, charge);
    } else {
      addCharge(charge);
    }
  };

  const handleDeleteConfirm = () => {
    if (deletingCharge) {
      deleteCharge(deletingCharge.charge_id);
      setIsDeleteDialogOpen(false);
      setDeletingCharge(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-3xl font-bold">
                  Swim School Charge Management
                </CardTitle>
                <CardDescription className="mt-2">
                  Record and manage swim class charges for students. View all charges, add new ones, or update existing records.
                </CardDescription>
              </div>
              <Button onClick={handleAddCharge} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Charge
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ChargeListTable
              charges={charges}
              onEdit={handleEditCharge}
              onDelete={handleDeleteClick}
            />
          </CardContent>
        </Card>

        <ChargeFormDialog
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          onSubmit={handleFormSubmit}
          editingCharge={editingCharge}
          existingCharges={charges}
        />

        <DeleteChargeDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          charge={deletingCharge}
          onConfirm={handleDeleteConfirm}
        />
      </div>
    </div>
  );
}

export default App;
