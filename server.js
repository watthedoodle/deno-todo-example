import { Hono } from "https://deno.land/x/hono/mod.ts"
import { serveStatic } from "https://deno.land/x/hono/middleware.ts"
import { v4 } from "https://deno.land/std@0.82.0/uuid/mod.ts"

const app = new Hono()
var todo = []

// api
app.get("/api/all", async (c) => {
    console.log("==> getting all the todo data")
    return c.json(todo)
})

app.post("/api/add", async (c) => {
    console.log("==> adding new task")
    const data = await c.req.json()
    if(data["task"] != "") {
        const id = v4.generate()
        todo.push({
            id: id,
            task: data["task"]
        })
        console.log(`==> adding new task ID -> ${id}`)
    }
    return c.json({action: "ok"})
})

app.post("/api/remove", async (c) => {
    const data = await c.req.json()
    console.log(`==> removing task -> ${data["id"]}`)
    todo = todo.filter(x => x.id != data["id"])
    return c.json({action: "ok"})
})

app.get("/*", serveStatic({root: "./public"}))
Deno.serve({port: 8080}, app.fetch)