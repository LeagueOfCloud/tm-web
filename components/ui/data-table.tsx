// components/data-table.tsx
import { Table, Checkbox } from "@chakra-ui/react";
import { ReactNode } from "react";

export type DataTableColumn<T> = {
    key: string;
    header: string;
    render: (item: T) => ReactNode;
    width?: string | number;
};

export interface DataTableProps<T> {
    data: T[];
    columns: DataTableColumn<T>[];
    selected: T[];
    setSelected: (items: T[]) => void;
    loading?: boolean;
}

export default function DataTable<T>({
    data,
    columns,
    selected,
    setSelected,
    loading = false,
}: DataTableProps<T>) {
    const allSelected = selected.length === data.length;
    const someSelected = selected.length > 0 && !allSelected;

    return (
        <Table.Root showColumnBorder stickyHeader interactive mt={5}>
            <Table.Header>
                <Table.Row background="blackAlpha.500">
                    {/* SELECT ALL COLUMN */}
                    <Table.ColumnHeader width="10px">
                        <Checkbox.Root
                            mt="0.5"
                            aria-label="Select all rows"
                            checked={allSelected ? true : someSelected ? "indeterminate" : false}
                            disabled={loading}
                            onCheckedChange={(state) =>
                                setSelected(state.checked ? data : [])
                            }
                        >
                            <Checkbox.HiddenInput />
                            <Checkbox.Control cursor="pointer" />
                        </Checkbox.Root>
                    </Table.ColumnHeader>

                    {/* DYNAMIC COLUMNS */}
                    {columns.map(col => (
                        <Table.ColumnHeader key={col.key} width={col.width}>
                            {col.header}
                        </Table.ColumnHeader>
                    ))}
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {data.map(item => (
                    <Table.Row key={JSON.stringify(item)}>
                        <Table.Cell width="10px">
                            <Checkbox.Root
                                mt="0.5"
                                aria-label="Select row"
                                checked={selected.includes(item)}
                                size="sm"
                                disabled={loading}
                                onCheckedChange={(state) =>
                                    setSelected(
                                        state.checked
                                            ? [...selected, item]
                                            : selected.filter((x) => x !== item)
                                    )
                                }
                            >
                                <Checkbox.HiddenInput />
                                <Checkbox.Control cursor="pointer" />
                            </Checkbox.Root>
                        </Table.Cell>

                        {/* RENDER EACH COLUMN CELL */}
                        {columns.map(col => (
                            <Table.Cell key={col.key} width={col.width}>
                                {col.render(item)}
                            </Table.Cell>
                        ))}
                    </Table.Row>
                ))}
            </Table.Body>
        </Table.Root>
    );
}
