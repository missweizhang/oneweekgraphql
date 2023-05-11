import handler from "./graphql";

export async function GET(request) {
  return handler(request);
}

export async function POST(request) {
  return handler(request);
}
