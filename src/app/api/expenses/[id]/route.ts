import { authenticateRequest } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import {
  deleteCloudinaryFile,
  uploadBufferToCloudinary,
} from "@/lib/cloudinaryHelpers";
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = authenticateRequest(request);
    const { id } = await params;
    const expenseId = Number(id);
    const { data, error } = await supabaseAdmin
      .from("expenses")
      .select(`id,bill_url`)
      .eq("id", expenseId)
      .eq("user_id", userId)
      .single();
    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
    if (!data) {
      return Response.json({ error: "Expense not found" }, { status: 404 });
    }
    await deleteCloudinaryFile(data.bill_url);
    const { error: deleteError } = await supabaseAdmin
      .from("expenses")
      .delete()
      .eq("id", expenseId)
      .eq("user_id", userId);
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
  try {
    const { userId } = authenticateRequest(request);
    const { id } = await params;
    const expenseId = Number(id);
    if (!Number.isInteger(expenseId)) {
      return Response.json({ error: "Invalid expense ID" }, { status: 400 });
    }
    const formData = await request.formData();
    const title = formData.get("title") as string | null;
    const amountValue = formData.get("amount") as string | null;
    const category_id = formData.get("category_id") as string | null;
    const note = formData.get("note") as string | null;
    const bill = formData.get("bill");
    const billRemoved = formData.get("billRemoved") === "true";
    if (!title?.trim() || !amountValue || !category_id) {
      return Response.json(
        { error: "Title, amount and category are required" },
        { status: 400 }
      );
    }
    const amount = Number(amountValue);
    if (!Number.isFinite(amount) || amount <= 0) {
      return Response.json(
        { error: "Amount must be a valid positive number" },
        { status: 400 }
      );
    }
    const { data: existingExpense, error: existingExpenseError } =
      await supabaseAdmin
        .from("expenses")
        .select("id, bill_url")
        .eq("id", expenseId)
        .eq("user_id", userId)
        .single();
    if (existingExpenseError || !existingExpense) {
      return Response.json({ error: "Expense not found" }, { status: 404 });
    }
    const oldBillUrl: string | null = existingExpense.bill_url;
    let billUrl: string | null = oldBillUrl;
    let uploadedNewBill = false;
    if (billRemoved) {
      billUrl = null;
    }
    if (bill instanceof File && bill.size > 0) {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "application/pdf",
      ];
      if (!allowedTypes.includes(bill.type)) {
        return Response.json(
          { error: "Only JPG, PNG, WEBP and PDF files are allowed" },
          { status: 400 }
        );
      }
      const maxFileSize = 5 * 1024 * 1024;
      if (bill.size > maxFileSize) {
        return Response.json(
          { error: "File size must be less than 5 MB" },
          { status: 400 }
        );
      }
      try {
        const buffer = Buffer.from(await bill.arrayBuffer());
        const uploadResult = await uploadBufferToCloudinary(
          buffer,
          `expenses_bill/${userId}`
        );
        billUrl = uploadResult.secure_url;
        uploadedNewBill = true;
      } catch (cloudinaryError) {
        console.error("CLOUDINARY UPLOAD ERROR:", cloudinaryError);
        return Response.json(
          { error: "Cloudinary upload failed. Please try again." },
          { status: 500 }
        );
      }
    }
    const updateData = {
      title: title.trim(),
      amount,
      category_id,
      note: note?.trim() || null,
      bill_url: billUrl,
    };
    const { data: updatedExpense, error: updateError } = await supabaseAdmin
      .from("expenses")
      .update(updateData)
      .eq("id", expenseId)
      .eq("user_id", userId)
      .select()
      .single();
    if (updateError) {
      console.error("SUPABASE UPDATE ERROR:", updateError);
      if (uploadedNewBill) {
        await deleteCloudinaryFile(billUrl);
      }
      return Response.json({ error: updateError.message }, { status: 500 });
    }
    if (oldBillUrl && oldBillUrl !== billUrl) {
      await deleteCloudinaryFile(oldBillUrl);
    }
    return Response.json(
      {
        message: "Expense updated successfully",
        expense: updatedExpense,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PATCH EXPENSE ERROR:", error);
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Something went wrong",
      },
      { status: 500 }
    );
  }
}
