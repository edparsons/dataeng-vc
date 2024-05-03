'use client';

import { DataTable } from "@/src/components/tables/DataTable";
import { Tool, columns, rowClick } from "./columns";
import { useSupabase } from "@/src/components/Providers/SupabaseProvider";
import { useMemo } from "react";

export function Table({ tools }: { tools: Tool[] }) {
    const { user } = useSupabase();
    const _columns = useMemo(() => columns(user), [user]);

    return (
        <DataTable
            data={tools ?? []}
            columns={_columns}
            filterLabel="tools"
            rowOnClick={rowClick}
        />

    )
}
