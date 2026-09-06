import { authenticateRequest } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
export async function GET(request: Request) {
  try {
    const { userId } = authenticateRequest(request);
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);
    const search = searchParams.get("search") || "";
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    let query = supabaseAdmin
      .from("expenses")
      .select(
        `
          id,
          title,
          amount,
          note,
          expense_date,
          bill_url,
          category:categories(id,name)
        `,
        { count: "exact" }
      )
      .eq("user_id", userId);
    if (search) {
      query = query.or(`title.ilike.%${search}%,note.ilike.%${search}%`);
    }
    if (startDate) {
      query = query.gte("expense_date", startDate);
    }
    if (endDate) {
      query = query.lte("expense_date", endDate);
    }
    query = query
      .order("expense_date", { ascending: false })
      .range(from, to);

    const { data, error, count } = await query
    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
    return Response.json({
      expenses: data,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });

  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Unauthorized",
      },
      { status: 401 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = authenticateRequest(request);
    const formData = await request.formData();
    const file = formData.get("bill") as File | null;
    const title = formData.get("title") as string;
    const amount = formData.get("amount") as string;
    const category_id = formData.get("category_id") as string;
    const note = formData.get("note") as string;
    if (!title || !amount || !category_id) {
      return Response.json(
        { error: "Title, amount and category are required" },
        { status: 400 }
      );
    }
    let bill_url = null;
    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const result = await cloudinary.uploader.upload(
        `data:${file.type};base64,${buffer.toString("base64")}`,
        {
          folder: `expenses_bill/${userId}`,
        }
      );
      bill_url = result.secure_url;
    }
    const { data: expense, error: expenseError } = await supabaseAdmin
      .from("expenses")
      .insert({
        title,
        amount: Number(amount),
        user_id: userId,
        category_id,
        note,
        expense_date: new Date().toISOString().split("T")[0],
        bill_url,
      })
      .select()
      .single();
    if (expenseError) {
      return Response.json({ error: expenseError.message }, { status: 500 });
    }
    return Response.json(
      {
        message: "Expense created successfully",
        expense,
      },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Unauthorized",
      },
      { status: 401 }
    );
  }
}
