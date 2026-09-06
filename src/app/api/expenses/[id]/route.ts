import { authenticateRequest } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { Expense } from "@/lib/types";
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const {userId} = authenticateRequest(request)
    const { id } = await params;
    const { data, error } = await supabaseAdmin
      .from("expenses")
      .select(`id,bill_url`)
      .eq("id", Number(id))
      .single();
    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
    if (!data) {
      return Response.json({ error: "Expense not found" }, { status: 404 });
    }
    if (data.bill_url) {
      const url = new URL(data.bill_url);
      const parts = url.pathname.split("/");
      const uploadIndex = parts.indexOf("upload");
      if (uploadIndex !== -1) {
        let publicId = parts.slice(uploadIndex + 1).join("/");
        if (publicId.startsWith("v")) {
          publicId = publicId.replace(/^v\d+\//, "");
        }
        publicId = publicId.replace(/\.[^/.]+$/, "");
        await cloudinary.uploader.destroy(publicId);
      }
    }
    const { error: deleteError } = await supabaseAdmin
      .from("expenses")
      .delete()
      .eq("id", Number(id));
    if (deleteError) {
      return Response.json({ error: deleteError.message }, { status: 500 });
    }
    return Response.json({ message: "Expense Deleted Successfully", data });
  } catch (error) {
     return Response.json(
      {
        error: error instanceof Error ? error.message : "Unauthorized",
      },
      { status: 401 }
    );
  }
}
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { data, error } = await supabaseAdmin
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
  const body: ExpenseUpdate = await request.json();

  const { data, error } = await supabaseAdmin
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

  const { data: updatedExpense, error: updateError } = await supabaseAdmin
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
