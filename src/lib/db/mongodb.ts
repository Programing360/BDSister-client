import { MongoClient, Db } from "mongodb";

/**
 * Global MongoDB connection singleton for Next.js App Router.
 * Reuses active client instance in development across HMR cycles
 * and manages connection pooling for production serverless invocations.
 */

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/bdsisters";
const options = {
  maxPoolSize: 10,
  minPoolSize: 2,
  serverSelectionTimeoutMS: 5000,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClient: MongoClient | undefined;
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClient) {
    global._mongoClient = new MongoClient(uri, options);
    global._mongoClientPromise = global._mongoClient.connect().catch((err) => {
      console.warn("[MongoDB] Connection deferred (local development mode):", err.message);
      return global._mongoClient!;
    });
  }
  client = global._mongoClient;
  clientPromise = global._mongoClientPromise!;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect().catch((err) => {
    console.warn("[MongoDB] Connection deferred (production mode):", err.message);
    return client;
  });
}

/**
 * Direct synchronous access to default Database instance for Better Auth adapter.
 */
export const db: Db = client.db();

/**
 * Access the active MongoDB database instance (async for safety).
 */
export async function getDatabase(dbName?: string): Promise<Db> {
  const connectedClient = await clientPromise;
  return connectedClient.db(dbName);
}

export { client, clientPromise };
export default clientPromise;
