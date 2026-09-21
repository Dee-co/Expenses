export interface ParsedBill {
  title: string;
  amount: number | null;
  category: string;
  note: string;
  date: string;
}

export function parseBillText(text: string): ParsedBill {
const amountMatches = [
  ...text.matchAll(
    /(?:total|grand total)[^\d]*(\d+(?:\.\d{1,2})?)/gi,
  ),
];

const amount =
  amountMatches.length > 0
    ? Number(
        amountMatches[amountMatches.length - 1][1],
      )
    : null;
  const dateMatch = text.match(
    /(\d{2}\/\d{2}\/\d{4})/,
  );

  const shopMatch = text.match(
    /#\d+\s+([^\n]+)/,
  );

  return {
    title: "Grocery Shopping",
    amount,
    category: "Food",
    note: shopMatch?.[1]?.trim() || "",
    date: dateMatch?.[1] || "",
  };
}