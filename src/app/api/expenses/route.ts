import { expenses,getNextId } from "@/lib/data"
import {Expense} from "@/lib/types"
export async function GET() {
    return Response.json({expenses})
}
export async function POST(req:Request){
    const body = await req.json();
     console.log("Raw body:", JSON.stringify(body));
  console.log("amount:", body.amount, "category:", body.category, "date:", body.date);
    const newExpanse:Expense = {
        id:getNextId(),
        amount:body.amount,
        category:body.category,
        date:body.date,
        note:body.note
    }
    expenses.push(newExpanse);
    return Response.json(newExpanse,{status:201})
}
