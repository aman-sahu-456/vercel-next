export default function Home() {
  return (
    <main style={{ fontFamily: "system-ui, sans-serif", padding: "3rem" }}>
      <h1>Next.js Backend</h1>
      <p>
        This is the API-only backend. Try the endpoint:{" "}
        <a href="/api/hello">/api/hello</a>
      </p>
    </main>
  );
}
