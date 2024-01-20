import { GenMouse, ScatterArea, UtilsArea, UtilsButton } from "@components";
import { KMeansProvider } from "@context";

function App() {
  return (
    <KMeansProvider>
      <ScatterArea />
      <UtilsArea />
      <GenMouse />
    </KMeansProvider>
  );
}

export default App;
