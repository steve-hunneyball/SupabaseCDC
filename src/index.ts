import { createClient } from "@supabase/supabase-js";
import 'dotenv/config';
import {Server} from "./server";

async function entry() {
    const supabase = createClient(
        process.env.SUPABASE_URL ?? "",
        process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""
    );

    console.log("Establishing NATS connection...");
    const server = new Server()
    await server.establishConnection()

    console.log('Subscribing to changes...');

    supabase
        .channel('schema-db-changes')
        .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public'
            },
            (payload: string) => {
                console.log('Insert received!', payload)
                server.publishMessage("potato.masher", payload)
            }
        )
        .on(
            'postgres_changes',
            {
                event: 'UPDATE',
                schema: 'public'
            },
            (payload: string) => {
                console.log('Update received!', payload);
                server.publishMessage("hello.world", payload)
            }
        )
        .subscribe();

    console.log("Subscribed.");
}

entry().then(() => console.log("Process established."));