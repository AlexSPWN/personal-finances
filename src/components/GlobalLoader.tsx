export const GlobalLoader = () => {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#fff",
        zIndex: 9999,
      }}
    >
      <p>Loading...</p>
    </div>
  );
};