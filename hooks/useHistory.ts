import { useCallback, useState } from "react";

interface ClickEvent {
  position: { x: number; y: number };
  type: "ellipse" | "ellipse left" | "ellipse right";
  team: string;
  item: string;
  time: string;
  isComplete: boolean;
  pairId?: number;
}

interface CurrentLine {
  position: { x: number; y: number };
  to: { x: number; y: number };
  isComplete: boolean;
  pairId: number;
}

interface LineClick {
  position: { x: number; y: number };
  type: "ellipse left" | "ellipse right";
  time: string;
  pairId: number;
}

export const useHistory = (
  initialClicks: ClickEvent[],
  setClicks: (clicks: ClickEvent[]) => void,
  setCurrentLine: (line: CurrentLine | null) => void,
  pendingLineClick: LineClick | null,
  setPendingLineClick: (lineClick: LineClick | null) => void
) => {
  const [clickHistory, setClickHistory] = useState<ClickEvent[][]>([
    initialClicks,
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const updateHistory = useCallback(
    (newClicks: ClickEvent[], isActionComplete: boolean) => {
      if (!isActionComplete) {
        // Don't save to history for incomplete actions (e.g., first click of Inside 50)
        return;
      }
      setClickHistory((prev) => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push(newClicks);
        return newHistory;
      });
      setHistoryIndex((prev) => prev + 1);
      console.log(
        "History updated: clicks =",
        newClicks,
        "historyIndex =",
        historyIndex + 1
      );
    },
    [historyIndex]
  );

  const undo = useCallback(() => {
    if (historyIndex <= 0) {
      console.log("Cannot undo: at the beginning of history");
      return;
    }
    console.time("Undo");
    setHistoryIndex((prev) => {
      const newIndex = prev - 1;
      setClicks(clickHistory[newIndex]);
      setPendingLineClick(null); // Clear pending line click
      // Update currentLine based on the latest Inside 50 pair in the restored state
      const restoredClicks = clickHistory[newIndex];
      const lastInside50Pair = restoredClicks
        .filter(
          (click) => click.item === "inside_50" && click.pairId !== undefined
        )
        .reduce(
          (acc, click) => {
            if (!click.pairId) return acc;
            if (!acc[click.pairId]) acc[click.pairId] = [];
            acc[click.pairId].push(click);
            return acc;
          },
          {} as { [key: number]: ClickEvent[] }
        );
      const latestPairId = Math.max(
        ...Object.keys(lastInside50Pair).map(Number),
        -1
      );
      if (latestPairId >= 0 && lastInside50Pair[latestPairId].length === 2) {
        const [startClick, endClick] = lastInside50Pair[latestPairId];
        setCurrentLine({
          position: startClick.position,
          to: endClick.position,
          isComplete: startClick.isComplete && endClick.isComplete,
          pairId: latestPairId,
        });
      } else {
        setCurrentLine(null);
      }
      console.log("Undo performed: historyIndex =", newIndex);
      console.timeEnd("Undo");
      return newIndex;
    });
  }, [
    historyIndex,
    clickHistory,
    setClicks,
    setCurrentLine,
    setPendingLineClick,
  ]);

  const redo = useCallback(() => {
    if (historyIndex >= clickHistory.length - 1) {
      console.log("Cannot redo: at the end of history");
      return;
    }
    console.time("Redo");
    setHistoryIndex((prev) => {
      const newIndex = prev + 1;
      setClicks(clickHistory[newIndex]);
      setPendingLineClick(null); // Clear pending line click
      // Update currentLine based on the latest Inside 50 pair in the restored state
      const restoredClicks = clickHistory[newIndex];
      const lastInside50Pair = restoredClicks
        .filter(
          (click) => click.item === "inside_50" && click.pairId !== undefined
        )
        .reduce(
          (acc, click) => {
            if (!click.pairId) return acc;
            if (!acc[click.pairId]) acc[click.pairId] = [];
            acc[click.pairId].push(click);
            return acc;
          },
          {} as { [key: number]: ClickEvent[] }
        );
      const latestPairId = Math.max(
        ...Object.keys(lastInside50Pair).map(Number),
        -1
      );
      if (latestPairId >= 0 && lastInside50Pair[latestPairId].length === 2) {
        const [startClick, endClick] = lastInside50Pair[latestPairId];
        setCurrentLine({
          position: startClick.position,
          to: endClick.position,
          isComplete: startClick.isComplete && endClick.isComplete,
          pairId: latestPairId,
        });
      } else {
        setCurrentLine(null);
      }
      console.log("Redo performed: historyIndex =", newIndex);
      console.timeEnd("Redo");
      return newIndex;
    });
  }, [
    historyIndex,
    clickHistory,
    setClicks,
    setCurrentLine,
    setPendingLineClick,
  ]);

  return { updateHistory, undo, redo };
};
