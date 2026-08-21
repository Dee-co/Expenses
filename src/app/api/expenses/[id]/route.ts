import { supabase } from "@/lib/supabase";
import { Expense } from "@/lib/types";
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .eq("id", Number(id))
    .single();
  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return Response.json({ error: "Expense not found" }, { status: 404 });
  }
  const { error: deleteError } = await supabase
    .from("expenses")
    .delete()
    .eq("id", Number(id));
  if (deleteError) {
    return Response.json({ error: deleteError.message }, { status: 500 });
  }
  return Response.json({ message: "Expense Deleted Successfully", data });
}
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .eq("id", Number(id))
    .single();
  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return Response.json({ error: "Expense not found" }, { status: 404 });
  }
  return Response.json({ data }, { status: 200 });
}
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
type ExpenseUpdate = Partial<Expense>;
  const body:ExpenseUpdate = await request.json();

  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .eq("id", Number(id))
    .single();
  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return Response.json({ error: "Expense not found" }, { status: 404 });
  }

  const { data: updatedExpense, error: updateError } = await supabase
    .from("expenses")
    .update(body)
    .eq("id", Number(id))
    .select()
    .single();
  if (updateError) {
    return Response.json({ error: updateError.message }, { status: 500 });
  }

  return Response.json({
    message: "Expense updated successfully",
    expense: updatedExpense,
  });
}
