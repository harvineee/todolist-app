import { Suspense } from "react";
import { connection } from "next/server";
import { getSupabase, type Todo } from "@/lib/supabase";
import { addTodo, clearCompleted, deleteTodo, toggleTodo } from "./actions";
import styles from "./page.module.css";

async function TodoList() {
  await connection();
  const { data, error } = await getSupabase()
    .from("todos")
    .select("id, title, done, created_at")
    .order("done", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    return <p className={styles.error}>Couldn&apos;t load to-dos: {error.message}</p>;
  }

  const todos = (data ?? []) as Todo[];
  const remaining = todos.filter((t) => !t.done).length;
  const completed = todos.length - remaining;

  if (todos.length === 0) {
    return <p className={styles.empty}>Nothing to do yet. Add your first task above.</p>;
  }

  return (
    <>
      <ul className={styles.list}>
        {todos.map((todo) => (
          <li key={todo.id} className={todo.done ? `${styles.item} ${styles.done}` : styles.item}>
            <form action={toggleTodo}>
              <input type="hidden" name="id" value={todo.id} />
              <input type="hidden" name="done" value={String(todo.done)} />
              <button
                type="submit"
                className={styles.check}
                aria-label={todo.done ? `Mark "${todo.title}" as not done` : `Mark "${todo.title}" as done`}
              >
                {todo.done ? "✓" : ""}
              </button>
            </form>
            <span className={styles.title}>{todo.title}</span>
            <form action={deleteTodo}>
              <input type="hidden" name="id" value={todo.id} />
              <button type="submit" className={styles.delete} aria-label={`Delete "${todo.title}"`}>
                ×
              </button>
            </form>
          </li>
        ))}
      </ul>
      <div className={styles.footer}>
        <span>
          {remaining} left · {completed} done
        </span>
        {completed > 0 && (
          <form action={clearCompleted}>
            <button type="submit" className={styles.clear}>
              Clear completed
            </button>
          </form>
        )}
      </div>
    </>
  );
}

export default function Home() {
  return (
    <main className={styles.main}>
      <h1 className={styles.heading}>To-do</h1>
      <form action={addTodo} className={styles.addForm}>
        <input
          name="title"
          placeholder="What needs doing?"
          maxLength={500}
          required
          autoComplete="off"
          autoFocus
          className={styles.input}
        />
        <button type="submit" className={styles.addButton}>
          Add
        </button>
      </form>
      <Suspense fallback={<p className={styles.empty}>Loading…</p>}>
        <TodoList />
      </Suspense>
    </main>
  );
}
