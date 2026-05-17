import axiosPublic from "@/src/apis/axiosPublic";
import EventCatalog, { Evento, Pagination } from "./components/EventCatalog";
import HeroEvents from "./components/HeroEvents";

const LIMIT = 9;

export default async function Page() {
    let initialEvents: Evento[] = [];
    let initialPagination: Pagination | null = null;
    let initialError = false;

    try {
        const res = await axiosPublic.get<{ data: Evento[]; pagination: Pagination }>(
            process.env.NEXT_PUBLIC_EVENTS_PUBLIC!,
            { params: { limit: LIMIT, offset: 0 } }

        );
        initialEvents = res.data.data;
        initialPagination = res.data.pagination;

        console.log(initialEvents)

    } catch {
        initialError = true;
    }

    return (
        <main className="flex min-h-screen flex-col">
            <HeroEvents eventCount={initialPagination?.totalCount ?? 0} />
            <EventCatalog
                initialEvents={initialEvents}
                initialPagination={initialPagination}
                initialError={initialError}
            />
        </main>
    );
}
