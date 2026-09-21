import { authenticateRequest } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";
import { uploadBufferToCloudinary } from "@/lib/cloudinaryHelpers";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
export async function GET(request: Request) {
  try {
    const { userId } = authenticateRequest(request);
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);
    const search = searchParams.get("search") || "";
    const categoryId = searchParams.get("categoryId") || "";
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const applyFilters = (query: any) => {
      query = query.eq("user_id", userId);
      if (categoryId) {
        query = query.eq("category_id", categoryId);
      }
      if (search) {
        query = query.or(`title.like.%${search}%,note.like.%${search}%`);
      }
      if (startDate) {
        query = query.gte("created_at", startDate);
      }
      if (endDate) {
        query = query.lte("created_at", endDate);
      }
      return query;
    };
    let query = applyFilters(
      supabaseAdmin.from("expenses").select(
        `id,
          title,
          category:categories(id,name),
          amount,
          note,
          bill_url,
          created_at`,
        { count: "exact" }
      )
    );
    query = query.order("created_at", { ascending: false }).range(from, to);
    const totalAmountQuery = applyFilters(
      supabaseAdmin.from("expenses").select("amount")
    );
    const [{ data, error, count }, { data: totalData, error: totalError }] =
      await Promise.all([query, totalAmountQuery]);
    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
    if (totalError) {
      return Response.json({ error: totalError?.message }, { status: 500 });
    }
    const totalAmount = (totalData ?? []).reduce(
      (sum: any, expense: any) => sum + Number(expense.amount),
      0
    );
    return Response.json(
      {
        expenses: data ?? [],
        totalAmount,
        pagination: {
          page,
          limit,
          total: count ?? 0,
          totalPages: Math.ceil((count ?? 0) / limit),
        },
      },
      { status: 200 }
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

export async function POST(request: Request) {
  try {
    const { userId } = authenticateRequest(request);

    const formData = await request.formData();

    const file = formData.get("bill");
    const title = formData.get("title") as string;
    const amount = formData.get("amount") as string;
    const category_id = formData.get("category_id") as string;
    const note = (formData.get("note") as string) || "";

    if (!title || !amount || !category_id) {
      return Response.json(
        {
          error: "Title, amount and category are required",
        },
        { status: 400 },
      );
    }

    let bill_url: string | null = null;

    // Upload bill without converting to base64
    if (file instanceof File && file.size > 0) {
      console.log("Bill upload started:", {
        name: file.name,
        type: file.type,
        size: file.size,
      });

      const buffer = Buffer.from(await file.arrayBuffer());

      const result = await uploadBufferToCloudinary(
        buffer,
        `expenses_bill/${userId}`,
      );

      bill_url = result.secure_url;

      console.log("Bill uploaded successfully");
    }

    const { data: expense, error: expenseError } =
      await supabaseAdmin
        .from("expenses")
        .insert({
          title,
          amount: Number(amount),
          user_id: userId,
          category_id,
          note,
          bill_url,
        })
        .select()
        .single();

    if (expenseError) {
      console.error("Supabase insert error:", expenseError);

      return Response.json(
        { error: expenseError.message },
        { status: 500 },
      );
    }

    return Response.json(
      {
        message: "Expense created successfully",
        expense,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("ADD EXPENSE ERROR:", {
      message: error?.message,
      code: error?.code,
      errno: error?.errno,
      syscall: error?.syscall,
      stack: error?.stack,
    });

    return Response.json(
      {
        error: error?.message || "Something went wrong",
      },
      { status: 500 },
    );
  }
}
