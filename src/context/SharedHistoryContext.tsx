import type { HistoryState } from '@lexical/react/LexicalHistoryPlugin';

import { createEmptyHistoryState } from '@lexical/react/LexicalHistoryPlugin';

import React, { createContext, ReactNode, useContext, useMemo } from 'react';

type ContextShape = {
  historyState?: HistoryState;
};

const Context: React.Context<ContextShape> = createContext({});

export function SharedHistoryContext({ children }: { children: ReactNode }) {
  const historyContext = useMemo(
    () => ({
      historyState: createEmptyHistoryState(),
    }),
    []
  );
  return <Context.Provider value={historyContext}>{children}</Context.Provider>;
}

export const useSharedHistoryContext = (): ContextShape => useContext(Context);
