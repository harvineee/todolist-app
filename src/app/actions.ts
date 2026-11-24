"use server";

import { revalidatePath } from "next/cache";
import { getSupabase } from "@/lib/supabase";

function parseId(value: FormDataEntryValue | null): number {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) throw new Error("Invalid id");
  return id;
}

export async function addTodo(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim().slice(0, 500);
  if (!title) return;
  const { error } = await getSupabase().from("todos").insert({ title });
  if (error) throw new Error(error.message);
  revalidatePath("/");
}

export async function toggleTodo(formData: FormData) {
  const id = parseId(formData.get("id"));
  const done = formData.get("done") === "true";
  const { error } = await getSupabase()
    .from("todos")
    .update({ done: !done })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
}

export async function deleteTodo(formData: FormData) {
  const id = parseId(formData.get("id"));
  const { error } = await getSupabase().from("todos").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
}

export async function clearCompleted() {
  const { error } = await getSupabase().from("todos").delete().eq("done", true);
  if (error) throw new Error(error.message);
  revalidatePath("/");
}
