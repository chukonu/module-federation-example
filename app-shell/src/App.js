import React from "react";

const Domain1 = React.lazy(() => import("domain1/Domain1"));

function App() {
  return (
    <div>
      <div>Application Shell</div>
      <Domain1 />
    </div>
  );
}

export default App;

