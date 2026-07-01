"use client";

import { motion } from "framer-motion";
import { Background, Controls, ReactFlow } from "@xyflow/react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { evalMetrics, latency, ragSteps } from "@/lib/data";
import { Card, CardText, CardTitle } from "@/components/ui/card";

const nodes = [
  { id: "web", position: { x: 0, y: 80 }, data: { label: "Next.js reviewer UI" } },
  { id: "api", position: { x: 230, y: 80 }, data: { label: ".NET claims API" } },
  { id: "ai", position: { x: 470, y: 80 }, data: { label: "FastAPI RAG agent" } },
  { id: "pg", position: { x: 710, y: 20 }, data: { label: "Postgres + pgvector" } },
  { id: "redis", position: { x: 710, y: 150 }, data: { label: "Redis rate limit" } },
  { id: "openai", position: { x: 950, y: 80 }, data: { label: "OpenAI API" } }
];

const edges = [
  { id: "e1", source: "web", target: "api", animated: true },
  { id: "e2", source: "api", target: "ai", animated: true },
  { id: "e3", source: "ai", target: "pg", animated: true },
  { id: "e4", source: "api", target: "redis", animated: true },
  { id: "e5", source: "ai", target: "openai", animated: true }
];

export function EngineeringVisuals() {
  return (
    <div className="space-y-5">
      <Card className="h-[320px] p-0">
        <ReactFlow nodes={nodes} edges={edges} fitView>
          <Background />
          <Controls />
        </ReactFlow>
      </Card>

      <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardTitle>RAG Pipeline Replay</CardTitle>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {ragSteps.map((step, index) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                className="rounded-md border border-border bg-muted/45 p-3"
              >
                <div className="text-xs text-muted-foreground">Step {index + 1}</div>
                <div className="mt-1 text-sm font-medium capitalize">{step}</div>
              </motion.div>
            ))}
          </div>
        </Card>

        <Card>
          <CardTitle>Guardrail Checks</CardTitle>
          <div className="mt-4 space-y-3 text-sm">
            {["Prompt injection blocked", "PII redacted", "Citations validated", "Tool output constrained"].map((item) => (
              <div key={item} className="flex items-center justify-between rounded-md border border-border p-3">
                <span>{item}</span>
                <span className="text-success">Pass</span>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardTitle>Eval Metrics</CardTitle>
          <CardText>Latest local eval run across retrieval, grounding, safety, and tool-call tasks.</CardText>
          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={evalMetrics}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="metric" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <CardTitle>Latency Waterfall</CardTitle>
          <CardText>Representative trace in milliseconds for a coverage question.</CardText>
          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={latency}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="step" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip />
                <Line type="monotone" dataKey="ms" stroke="hsl(var(--accent))" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        <Card>
          <CardTitle>Retrieved Chunks</CardTitle>
          <div className="mt-4 space-y-3 text-sm">
            {["POL-AZ-7721 collision coverage", "Exclusion: commercial delivery", "Payment ledger CLM-10482"].map((chunk, i) => (
              <div key={chunk} className="rounded-md border border-border p-3">
                <div>{chunk}</div>
                <div className="mt-1 text-xs text-muted-foreground">score {(0.91 - i * 0.07).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardTitle>Hybrid vs Vector</CardTitle>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between"><span>Hybrid top hit</span><span>0.91</span></div>
            <div className="flex justify-between"><span>Vector top hit</span><span>0.84</span></div>
            <div className="flex justify-between"><span>Keyword top hit</span><span>0.78</span></div>
          </div>
        </Card>
        <Card>
          <CardTitle>Context Preview</CardTitle>
          <CardText className="mt-4">Packed context includes the collision coverage clause, deductible row, payment ledger, and reviewer note. PII placeholders are redacted before generation.</CardText>
        </Card>
      </section>
    </div>
  );
}
