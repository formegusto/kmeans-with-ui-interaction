import React from "react";
import { UIProvider } from "./ui.context";
import { KMeansProvider } from "./kmeans.context";

export function combineComponents(
  ...components: React.FC<React.PropsWithChildren>[]
) {
  return components.reduce(
    (AccComponents, CurComponent) => {
      return ({ children }: React.PropsWithChildren): JSX.Element => {
        return (
          <AccComponents>
            <CurComponent>{children}</CurComponent>
          </AccComponents>
        );
      };
    },
    ({ children }: React.PropsWithChildren) => <>{children}</>
  );
}

const providers = [UIProvider, KMeansProvider];
export const AppContext = combineComponents(...providers);
export * from "./kmeans.context";
export * from "./ui.context";
