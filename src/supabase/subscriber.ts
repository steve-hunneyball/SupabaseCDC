import {createClient} from "@supabase/supabase-js";
import {Server} from "../nats/server";

export async function subscribe(server: Server) {
    const supabase = createClient(
        process.env.SUPABASE_URL ?? "",
        process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""
    );

    supabase
        .channel('schema-db-changes')
        .on(
            // @ts-ignore
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
            // @ts-ignore
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
}