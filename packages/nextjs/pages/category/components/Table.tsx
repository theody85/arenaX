import React from "react";
import Image from "next/image";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import dummy from "~~/public/assets/ellipse.png";

const CollectionData = [
  {
    collection: {
      id: 1,
      name: "OtterHead",
      imageUrl: dummy,
    },
    floorPrice: 0.0,
    floorChange: 0.0,
    volume: 0,
    volumeChange: 0.0,
    items: 11,
    owners: 4.5,
  },
  {
    collection: {
      id: 1,
      name: "OtterHead",
      imageUrl: dummy,
    },
    floorPrice: 0.0,
    floorChange: 0.0,
    volume: 0,
    volumeChange: 0.0,
    items: 11,
    owners: 4.5,
  },
  {
    collection: {
      id: 1,
      name: "OtterHead",
      imageUrl: dummy,
    },
    floorPrice: 0.0,
    floorChange: 0.0,
    volume: 0,
    volumeChange: 0.0,
    items: 11,
    owners: 4.5,
  },
  {
    collection: {
      id: 1,
      name: "OtterHead",
      imageUrl: dummy,
    },
    floorPrice: 0.0,
    floorChange: 0.0,
    volume: 0,
    volumeChange: 0.0,
    items: 11,
    owners: 4.5,
  },
];

const columns: ColumnDef<(typeof CollectionData)[0]>[] = [
  {
    header: "#",
    enableSorting: false,
  },
  {
    header: "COLLECTION",
    enableSorting: false,
    accessorKey: "collection",
    cell: ({ row }) => (
      <div className="flex flex-row gap-x-4 items-center">
        <Image
          src={row.getValue<{ imageUrl: string; name: string }>("collection").imageUrl}
          alt={row.getValue<{ imageUrl: string; name: string }>("collection").name}
        />
        <div className="text-white">{row.getValue<{ imageUrl: string; name: string }>("collection").name}</div>
      </div>
    ),
  },
  {
    header: "FLOOR PRICE",
    enableSorting: true,
    accessorKey: "floorPrice",
    cell: ({ row }) => <div className="text-white">{row.getValue("floorPrice")} ETH</div>,
  },
  {
    header: "FLOOR CHANGE",
    enableSorting: true,
    accessorKey: "floorChange",
    cell: ({ row }) => <div className="text-white">{row.getValue("floorChange")} %</div>,
  },
  {
    header: "VOLUME",
    enableSorting: true,
    accessorKey: "volume",
    cell: ({ row }) => <div className="text-white">{row.getValue("volume")} ETH</div>,
  },
  {
    header: "VOLUME CHANGE",
    enableSorting: true,
    accessorKey: "volumeChange",
    cell: ({ row }) => <div className="text-white">{row.getValue("volumeChange")} %</div>,
  },
  {
    header: "ITEMS",
    enableSorting: true,
    accessorKey: "items",
    // WRITE A REUSABLE FUNCTION TO CONVERT TO 'K' OR 'M' BASED ON THE NUMBER
    cell: ({ row }) => <div className="text-white">{row.getValue("items")} K</div>,
  },
  {
    header: "OWNERS",
    enableSorting: true,
    accessorKey: "owners",
    // WRITE A REUSABLE FUNCTION TO CONVERT TO 'K' OR 'M' BASED ON THE NUMBER
    cell: ({ row }) => <div className="text-white">{row.getValue("owners")} K</div>,
  },
];

const Table = () => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: CollectionData ?? [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });
  return (
    <div className="overflow-x-auto">
      <table className="table text-white">
        {/* head */}
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                  <th key={header.id} className="text-white/80">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map(row => (
              <tr key={row.id} data-state={row.getIsSelected() && "selected"} className="cursor-pointer">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="h-24 text-center">
                No results.
              </td>
            </tr>
          )}
        </tbody>
        {/* foot */}
        <tfoot>
          <tr></tr>
        </tfoot>
      </table>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="join">
          <button className="join-item btn">«</button>
          <button className="join-item btn">Page 1</button>
          <button className="join-item btn">»</button>
        </div>
      </div>
    </div>
  );
};

export default Table;
