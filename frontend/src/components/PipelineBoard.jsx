import { DndContext, PointerSensor, useDraggable, useDroppable, useSensor, useSensors } from "@dnd-kit/core";
import { useMemo, useState } from "react";

import { apiClient } from "../api/client";
import { useAllPages } from "../hooks/useAllPages.js";
import { useOptions } from "../hooks/useOptions.js";

function OpportunityCard({ opportunity, accountLabel, ownerLabel }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `opp-${opportunity.id}`,
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`kanban-card ${isDragging ? "dragging" : ""}`}
      {...listeners}
      {...attributes}
    >
      <div className="kanban-card-title">{opportunity.name}</div>
      <div className="kanban-card-meta">
        <span>{accountLabel}</span>
        <span>${Number(opportunity.amount).toLocaleString()}</span>
      </div>
      <div className="kanban-card-meta" style={{ marginTop: 4 }}>
        <span>{ownerLabel}</span>
        <span className="status-pill">{opportunity.status}</span>
      </div>
    </div>
  );
}

function StageColumn({ stage, opportunities, accountOptions, userOptions }) {
  const { setNodeRef, isOver } = useDroppable({ id: `stage-${stage.id}` });
  const total = opportunities.reduce((sum, o) => sum + Number(o.amount || 0), 0);

  return (
    <div ref={setNodeRef} className={`kanban-column ${isOver ? "drag-over" : ""}`}>
      <div className="kanban-column-header">
        <div className="kanban-column-title">
          <span>{stage.name}</span>
          <span>{opportunities.length}</span>
        </div>
        <div className="kanban-column-meta">${total.toLocaleString()} en esta etapa</div>
      </div>
      <div className="kanban-cards">
        {opportunities.length === 0 ? (
          <div className="kanban-empty">Arrastra una oportunidad aquí</div>
        ) : (
          opportunities.map((opp) => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              accountLabel={accountOptions.find((a) => a.value === opp.account)?.label ?? ""}
              ownerLabel={userOptions.find((u) => u.value === opp.owner)?.label ?? ""}
            />
          ))
        )}
      </div>
    </div>
  );
}

export function PipelineBoard() {
  const { data: stages, loading: stagesLoading } = useAllPages("/stages/");
  const { data: opportunities, setData: setOpportunities, loading: oppsLoading } = useAllPages(
    "/opportunities/"
  );
  const { options: accountOptions } = useOptions("/accounts/", "name");
  const { options: userOptions } = useOptions("/users/", "username");
  const [error, setError] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const sortedStages = useMemo(
    () => [...stages].sort((a, b) => a.order - b.order),
    [stages]
  );

  const opportunitiesByStage = useMemo(() => {
    const map = {};
    for (const stage of sortedStages) map[stage.id] = [];
    for (const opp of opportunities) {
      if (map[opp.stage]) map[opp.stage].push(opp);
      else map[opp.stage] = [opp];
    }
    return map;
  }, [sortedStages, opportunities]);

  async function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) return;

    const opportunityId = Number(String(active.id).replace("opp-", ""));
    const targetStageId = Number(String(over.id).replace("stage-", ""));

    const current = opportunities.find((o) => o.id === opportunityId);
    if (!current || current.stage === targetStageId) return;

    const previousStage = current.stage;
    setOpportunities((prev) =>
      prev.map((o) => (o.id === opportunityId ? { ...o, stage: targetStageId } : o))
    );
    setError("");

    try {
      await apiClient.patch(`/opportunities/${opportunityId}/`, { stage: targetStageId });
    } catch {
      setError("No se pudo mover la oportunidad. Intenta de nuevo.");
      setOpportunities((prev) =>
        prev.map((o) => (o.id === opportunityId ? { ...o, stage: previousStage } : o))
      );
    }
  }

  if (stagesLoading || oppsLoading) return <div className="loading">Cargando tablero…</div>;

  if (sortedStages.length === 0) {
    return <div className="card empty-state">Crea al menos una etapa para usar el tablero.</div>;
  }

  return (
    <div>
      {error && <div className="form-error" style={{ marginBottom: 10 }}>{error}</div>}
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="kanban-board">
          {sortedStages.map((stage) => (
            <StageColumn
              key={stage.id}
              stage={stage}
              opportunities={opportunitiesByStage[stage.id] || []}
              accountOptions={accountOptions}
              userOptions={userOptions}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
}
