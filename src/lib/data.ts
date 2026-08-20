import type { Expense } from "./types";

export let expenses: Expense[] = [
  { id: 1, amount: 1000, category: "food", date: "2026-08-18" }
];
let nextId:number = 2;
export function getNextId():number{
    return nextId++
};