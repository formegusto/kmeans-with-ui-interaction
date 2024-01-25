import React from "react";

const initialValues: IUIContextValues = {
  mode: null,
};
const initialActions: IUIContextActions = {
  changeMode: () => {},
};
export const UIContext = React.createContext<IUIContext>({
  ...initialValues,
  ...initialActions,
});
export function UIProvider({ children }: React.PropsWithChildren) {
  const [mode, setMode] = React.useState<UIMode>(null);
  const changeMode = React.useCallback((m: UIMode) => {
    setMode(m);
  }, []);

  return (
    <UIContext.Provider value={{ mode, changeMode }}>
      {children}
    </UIContext.Provider>
  );
}
