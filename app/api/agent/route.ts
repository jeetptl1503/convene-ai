import { NextResponse } from "next/server";
import { getClient, MODELS, embedText } from "@/lib/ai";
import { createServerClient } from "@/lib/supabase/server";
import { DEMO_EVENT_ID } from "@/lib/constants";
import { Type } from "@google/genai";

interface ActionRecord {
  type: string;
  summary: string;
  details?: Record<string, unknown>;
}

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const supabase = createServerClient();
    const actionsPerformed: ActionRecord[] = [];

    // Pre-fetch members and tasks for fast in-memory fuzzy matching
    const [membersRes, tasksRes] = await Promise.all([
      supabase.from("members").select("*").eq("event_id", DEMO_EVENT_ID),
      supabase.from("tasks").select("*").eq("event_id", DEMO_EVENT_ID),
    ]);

    const members = membersRes.data || [];
    const tasks = tasksRes.data || [];

    function findMember(name: string) {
      if (!name) return null;
      const q = name.trim().toLowerCase();
      return (
        members.find((m) => m.name.toLowerCase() === q) ||
        members.find((m) => m.name.toLowerCase().includes(q)) ||
        members.find((m) => q.includes(m.name.toLowerCase().split(" ")[0])) ||
        null
      );
    }

    function findTask(identifier: string) {
      if (!identifier) return null;
      const q = identifier.trim().toLowerCase();
      return (
        tasks.find((t) => t.id === identifier) ||
        tasks.find((t) => t.title.toLowerCase() === q) ||
        tasks.find((t) => t.title.toLowerCase().includes(q)) ||
        null
      );
    }

    // Define function declarations for Gemini
    const toolDeclarations = [
      {
        name: "list_tasks",
        description:
          "List tasks for the current event. Can filter by status ('todo', 'doing', 'done'), priority, or owner name.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING, description: "Filter by status: todo, doing, or done" },
            priority: { type: Type.STRING, description: "Filter by priority: low, medium, high, critical" },
            owner_name: { type: Type.STRING, description: "Filter by owner name" },
          },
        },
      },
      {
        name: "create_task",
        description:
          "Create a new task in the database for the event. Always provide a clear title.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Title of the task" },
            description: { type: Type.STRING, description: "Detailed description" },
            owner_name: { type: Type.STRING, description: "Name of the volunteer to assign" },
            deadline: { type: Type.STRING, description: "ISO 8601 deadline date string" },
            priority: { type: Type.STRING, description: "Priority: low, medium, high, critical" },
          },
          required: ["title"],
        },
      },
      {
        name: "assign_task",
        description:
          "Assign or reassign an existing task to a specific volunteer team member.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            task_title_or_id: { type: Type.STRING, description: "Task title or task UUID" },
            volunteer_name: { type: Type.STRING, description: "Name of the volunteer member" },
          },
          required: ["task_title_or_id", "volunteer_name"],
        },
      },
      {
        name: "update_task_status",
        description:
          "Update the status of an existing task to 'todo', 'doing', or 'done'.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            task_title_or_id: { type: Type.STRING, description: "Task title or task UUID" },
            status: { type: Type.STRING, description: "New status: todo, doing, done" },
          },
          required: ["task_title_or_id", "status"],
        },
      },
      {
        name: "set_deadline",
        description: "Set or update the deadline date for a specific task.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            task_title_or_id: { type: Type.STRING, description: "Task title or task UUID" },
            deadline: { type: Type.STRING, description: "ISO 8601 deadline string" },
          },
          required: ["task_title_or_id", "deadline"],
        },
      },
      {
        name: "add_volunteer",
        description: "Add a new volunteer team member to the event operations team.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "Full name" },
            email: { type: Type.STRING, description: "Email address" },
            role: { type: Type.STRING, description: "Role e.g., Logistics, Marketing, Lead" },
            skills: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of skills",
            },
          },
          required: ["name", "email"],
        },
      },
      {
        name: "create_announcement_draft",
        description:
          "Draft a new announcement for attendees or volunteers in the announcements table.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Announcement headline" },
            body: { type: Type.STRING, description: "Announcement body text" },
          },
          required: ["title", "body"],
        },
      },
      {
        name: "run_risk_scan",
        description:
          "Run the automated risk detection engine to identify overdue tasks, bottlenecks, and overloaded members.",
        parameters: {
          type: Type.OBJECT,
          properties: {},
        },
      },
      {
        name: "search_documents",
        description:
          "Search event knowledge base and documents for guidelines, policies, and schedules.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            query: { type: Type.STRING, description: "Search query or keyword" },
          },
          required: ["query"],
        },
      },
    ];

    // Tool execution dispatcher
    async function executeTool(name: string, args: Record<string, unknown>) {
      switch (name) {
        case "list_tasks": {
          const { status, priority, owner_name } = args as {
            status?: string;
            priority?: string;
            owner_name?: string;
          };
          let query = supabase.from("tasks").select("id, title, status, priority, deadline, owner_id").eq("event_id", DEMO_EVENT_ID);
          if (status) query = query.eq("status", status);
          if (priority) query = query.eq("priority", priority);

          const { data, error } = await query;
          if (error) return { error: error.message };

          let result = data || [];
          if (owner_name) {
            const m = findMember(owner_name);
            if (m) {
              result = result.filter((t) => t.owner_id === m.id);
            }
          }

          const formatted = result.map((t) => {
            const owner = members.find((m) => m.id === t.owner_id);
            return {
              id: t.id,
              title: t.title,
              status: t.status,
              priority: t.priority,
              deadline: t.deadline,
              owner: owner ? owner.name : "Unassigned",
            };
          });

          return { tasks: formatted, total_count: formatted.length };
        }

        case "create_task": {
          const { title, description, owner_name, deadline, priority } = args as {
            title: string;
            description?: string;
            owner_name?: string;
            deadline?: string;
            priority?: string;
          };

          const matchedOwner = owner_name ? findMember(owner_name) : null;
          const validPriority = ["low", "medium", "high", "critical"].includes(
            (priority || "").toLowerCase()
          )
            ? (priority!.toLowerCase() as "low" | "medium" | "high" | "critical")
            : "medium";

          const { data, error } = await supabase
            .from("tasks")
            .insert({
              event_id: DEMO_EVENT_ID,
              title: title.trim(),
              description: description || null,
              owner_id: matchedOwner ? matchedOwner.id : null,
              deadline: deadline ? new Date(deadline).toISOString() : null,
              priority: validPriority,
              status: "todo",
            })
            .select()
            .single();

          if (error) return { error: error.message };

          const summary = `Created task: "${title}"${
            matchedOwner ? `, assigned to ${matchedOwner.name}` : " (unassigned)"
          }${deadline ? `, due ${new Date(deadline).toLocaleDateString()}` : ""}`;

          actionsPerformed.push({ type: "create_task", summary, details: data });

          await supabase.from("activity_log").insert({
            event_id: DEMO_EVENT_ID,
            action: "Agent Action: Created Task",
            details: summary,
          });

          return { success: true, task: data, summary };
        }

        case "assign_task": {
          const { task_title_or_id, volunteer_name } = args as {
            task_title_or_id: string;
            volunteer_name: string;
          };

          const task = findTask(task_title_or_id);
          if (!task) return { error: `Task "${task_title_or_id}" not found.` };

          const member = findMember(volunteer_name);
          if (!member) return { error: `Volunteer "${volunteer_name}" not found.` };

          const { error } = await supabase
            .from("tasks")
            .update({
              owner_id: member.id,
              updated_at: new Date().toISOString(),
            })
            .eq("id", task.id);

          if (error) return { error: error.message };

          const summary = `Assigned task "${task.title}" to ${member.name} (${member.role})`;
          actionsPerformed.push({ type: "assign_task", summary });

          await supabase.from("activity_log").insert({
            event_id: DEMO_EVENT_ID,
            action: "Agent Action: Assigned Task",
            details: summary,
          });

          return { success: true, summary };
        }

        case "update_task_status": {
          const { task_title_or_id, status } = args as {
            task_title_or_id: string;
            status: "todo" | "doing" | "done";
          };

          const task = findTask(task_title_or_id);
          if (!task) return { error: `Task "${task_title_or_id}" not found.` };

          const validStatus = ["todo", "doing", "done"].includes(status)
            ? status
            : "todo";

          const { error } = await supabase
            .from("tasks")
            .update({
              status: validStatus,
              updated_at: new Date().toISOString(),
            })
            .eq("id", task.id);

          if (error) return { error: error.message };

          const summary = `Updated status of "${task.title}" to ${validStatus.toUpperCase()}`;
          actionsPerformed.push({ type: "update_task_status", summary });

          await supabase.from("activity_log").insert({
            event_id: DEMO_EVENT_ID,
            action: "Agent Action: Task Status Updated",
            details: summary,
          });

          return { success: true, summary };
        }

        case "set_deadline": {
          const { task_title_or_id, deadline } = args as {
            task_title_or_id: string;
            deadline: string;
          };

          const task = findTask(task_title_or_id);
          if (!task) return { error: `Task "${task_title_or_id}" not found.` };

          const parsed = new Date(deadline);
          if (isNaN(parsed.getTime())) return { error: "Invalid date format." };

          const { error } = await supabase
            .from("tasks")
            .update({
              deadline: parsed.toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq("id", task.id);

          if (error) return { error: error.message };

          const summary = `Set deadline for "${task.title}" to ${parsed.toLocaleDateString()}`;
          actionsPerformed.push({ type: "set_deadline", summary });

          await supabase.from("activity_log").insert({
            event_id: DEMO_EVENT_ID,
            action: "Agent Action: Set Deadline",
            details: summary,
          });

          return { success: true, summary };
        }

        case "add_volunteer": {
          const { name, email, role, skills } = args as {
            name: string;
            email: string;
            role?: string;
            skills?: string[];
          };

          const { data, error } = await supabase
            .from("members")
            .insert({
              event_id: DEMO_EVENT_ID,
              name: name.trim(),
              email: email.trim(),
              role: role || "Volunteer",
              skills: skills || [],
            })
            .select()
            .single();

          if (error) return { error: error.message };

          const summary = `Added volunteer: ${name} (${role || "Volunteer"})`;
          actionsPerformed.push({ type: "add_volunteer", summary, details: data });

          await supabase.from("activity_log").insert({
            event_id: DEMO_EVENT_ID,
            action: "Agent Action: Added Volunteer",
            details: summary,
          });

          return { success: true, summary, volunteer: data };
        }

        case "create_announcement_draft": {
          const { title, body } = args as { title: string; body: string };

          const { data, error } = await supabase
            .from("announcements")
            .insert({
              event_id: DEMO_EVENT_ID,
              title: title.trim(),
              body: body.trim(),
              status: "draft",
            })
            .select()
            .single();

          if (error) return { error: error.message };

          const summary = `Drafted announcement: "${title}"`;
          actionsPerformed.push({ type: "create_announcement_draft", summary, details: data });

          await supabase.from("activity_log").insert({
            event_id: DEMO_EVENT_ID,
            action: "Agent Action: Drafted Announcement",
            details: summary,
          });

          return { success: true, summary, announcement: data };
        }

        case "run_risk_scan": {
          // Trigger risk scan logic
          const { data: openTasks } = await supabase
            .from("tasks")
            .select("*")
            .eq("event_id", DEMO_EVENT_ID);

          const now = new Date();
          const overdue = (openTasks || []).filter(
            (t) => t.deadline && new Date(t.deadline) < now && t.status !== "done"
          );

          const summary = `Executed risk scan: Detected ${overdue.length} overdue milestones`;
          actionsPerformed.push({ type: "run_risk_scan", summary });

          return {
            success: true,
            summary,
            overdue_count: overdue.length,
            overdue_tasks: overdue.map((t) => t.title),
          };
        }

        case "search_documents": {
          const { query } = args as { query: string };

          try {
            const queryEmbedding = await embedText(query);
            const { data: matchedChunks } = await supabase.rpc(
              "match_document_chunks",
              {
                query_embedding: JSON.stringify(queryEmbedding),
                match_threshold: 0.15,
                match_count: 5,
              }
            );

            if (!matchedChunks || matchedChunks.length === 0) {
              // Fallback to title search
              const { data: docs } = await supabase
                .from("documents")
                .select("title, content")
                .eq("event_id", DEMO_EVENT_ID)
                .ilike("title", `%${query}%`)
                .limit(3);

              return {
                results: docs && docs.length > 0 ? docs : "No matching documents found.",
              };
            }

            const docIds = [...new Set(matchedChunks.map((c: { document_id: string }) => c.document_id))];
            const { data: docTitles } = await supabase
              .from("documents")
              .select("id, title")
              .in("id", docIds);

            const titleMap = new Map<string, string>();
            (docTitles || []).forEach((d: { id: string; title: string }) => titleMap.set(d.id, d.title));

            return {
              results: matchedChunks.map((c: { document_id: string; content: string; similarity: number }) => ({
                document_title: titleMap.get(c.document_id) || "Unknown",
                content: c.content,
                relevance: c.similarity,
              })),
            };
          } catch {
            // If RPC fails (e.g. function not created yet), fallback to title search
            const { data: docs } = await supabase
              .from("documents")
              .select("title, content")
              .eq("event_id", DEMO_EVENT_ID)
              .ilike("title", `%${query}%`)
              .limit(3);

            return {
              results: docs && docs.length > 0 ? docs : "No matching documents found.",
            };
          }
        }

        default:
          return { error: `Tool ${name} not recognized.` };
      }
    }

    // Initialize Gemini Chat session with tools
    const client = getClient();
    const systemInstruction = `You are Convene Copilot, an autonomous AI operations agent for a college club organizing an event.
Current Date: ${new Date().toISOString()}.
You have REAL access to the event database through function calling tools.
Whenever the user asks you to create, assign, update, inspect, or manage tasks, volunteers, risks, announcements, or documents, call the appropriate tools.
DO NOT just talk about taking action — actually execute the functions.
After calling tools, concisely summarize what concrete actions were performed in the database.`;

    const chat = client.chats.create({
      model: MODELS.flash,
      config: {
        systemInstruction,
        tools: [{ functionDeclarations: toolDeclarations as any }],
      },
    });

    let currentResponse = await chat.sendMessage({ message });
    let loopCount = 0;
    const MAX_TOOL_ROUNDS = 5;

    while (
      currentResponse.functionCalls &&
      currentResponse.functionCalls.length > 0 &&
      loopCount < MAX_TOOL_ROUNDS
    ) {
      loopCount++;
      const toolParts = [];

      for (const call of currentResponse.functionCalls) {
        if (!call.name) continue;
        const result = await executeTool(call.name, (call.args || {}) as Record<string, unknown>);
        toolParts.push({
          functionResponse: {
            name: call.name,
            response: result,
          },
        });
      }

      currentResponse = await chat.sendMessage({ message: toolParts });
    }

    return NextResponse.json({
      reply: currentResponse.text || "Action completed.",
      actions_performed: actionsPerformed,
    });
  } catch (err: unknown) {
    console.error("Error in /api/agent:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Agent processing error" },
      { status: 500 }
    );
  }
}
