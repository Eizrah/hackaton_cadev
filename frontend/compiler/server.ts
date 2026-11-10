import { createServer } from "node:http";
import { compilerEndpoint } from "../src/lib/compilerProtocol.ts";
import { handleCompiler } from "./api.ts";

const server = createServer((request, response) => {
  if (request.url?.split("?")[0] === compilerEndpoint) {
    void handleCompiler(request, response);
  } else {
    response.writeHead(404).end();
  }
});
server.listen(8026, "127.0.0.1", () => {
  console.log(
    "Compilateur DevAfrica · http://127.0.0.1:8026" + compilerEndpoint,
  );
});
