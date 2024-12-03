import 'dotenv/config';
import {Server} from "./nats/server";
import {subscribe} from "./supabase/subscriber";

async function entry() {
    console.log("Establishing NATS connection...");
    const server = new Server()
    await server.establishConnection()
    await subscribe(server).then(() => console.log("Subscribed to DB changes."));
}

entry().then(() => console.log("Process established. Awaiting changes."));