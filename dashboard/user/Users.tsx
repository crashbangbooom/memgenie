'use client';

import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useMutation, useQuery } from 'urql';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import {
  GET_USERS,
  GIVE_FREE_MONTH,
} from '@/graphql-quries-and-mutations/users';
import toast from 'react-hot-toast';
import { Spinner } from '@/components/ui/spinner';

type User = {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  state: string;
  country: string;
  address: string;
  subscriptionEndDate: string;
  isSubscribed: boolean;
};

const Users = () => {
  const router = useRouter();
  const [loadingUserId, setLoadingUserId] = React.useState<string | null>(null);

  const [{ fetching: fetchingUsers, data }] = useQuery({
    query: GET_USERS,
  });

  const [{ fetching: fetchingGiveFreeMonth }, giveFreeMonth] =
    useMutation(GIVE_FREE_MONTH);

  const giveFreeMonthFn = async (userId: string) => {
    setLoadingUserId(userId);
    const result = await giveFreeMonth({ userId });

    if (result.error) {
      toast.error(result.error.message || 'Failed to add free month');
      setLoadingUserId(null);
      return;
    }

    toast.success(
      result.data?.giveFreeMonth?.message || 'Free month added successfully 🎉'
    );
    setLoadingUserId(null);
  };

  //   const [{ fetching: deletingUser }, deleteUser] = useMutation(DELETE_USER);

  //   const handleDelete = async (id: string) => {
  //     const confirm = window.confirm(
  //       'Are you sure you want to delete this user?'
  //     );
  //     if (!confirm) return;

  //     const result = await deleteUser({ deleteUserId: id });
  //     if (result.error) {
  //       toast.error('Failed to delete user');
  //     } else {
  //       toast.success('User deleted successfully');
  //       // You might want to refetch users here or use an optimistic update
  //     }
  //   };

  //   const handleEdit = (id: string) => {
  //     router.push(`/user?id=${id}`);
  //   };

  const users = data?.users || [];

  const columns: ColumnDef<User>[] = [
    // {
    //   id: 'select',
    //   header: ({ table }) => (
    //     <Checkbox
    //       checked={
    //         table.getIsAllPageRowsSelected() ||
    //         (table.getIsSomePageRowsSelected() && 'indeterminate')
    //       }
    //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    //       aria-label="Select all"
    //     />
    //   ),
    //   cell: ({ row }) => (
    //     <Checkbox
    //       checked={row.getIsSelected()}
    //       onCheckedChange={(value) => row.toggleSelected(!!value)}
    //       aria-label="Select row"
    //     />
    //   ),
    //   enableSorting: false,
    //   enableHiding: false,
    // },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => <div>{row.original.name}</div>,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => <div>{row.original.email}</div>,
    },
    {
      accessorKey: 'isAdmin',
      header: 'Role',
      cell: ({ row }) => (
        <Badge variant={row.original.isAdmin ? 'default' : 'secondary'}>
          {row.original.isAdmin ? 'Admin' : 'User'}
        </Badge>
      ),
    },
    {
      accessorKey: 'state',
      header: 'State',
      cell: ({ row }) => <div>{row.original.state || '-'}</div>,
    },
    {
      accessorKey: 'isSubscribed',
      header: 'Subscribed',
      cell: ({ row }) => (
        <Badge variant={row.original.isSubscribed ? 'default' : 'secondary'}>
          {
          new Date(row.original.subscriptionEndDate)?.getTime() > new Date().getTime() ? 'Yes' : 'No'
          }
        </Badge>
      ),
    },
    {
      accessorKey: 'subscriptionEndDate',
      header: 'Subscription End Date',
      cell: ({ row }) => <div>{row.original.subscriptionEndDate || '-'}</div>,
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original;

        return (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              giveFreeMonthFn(user.id);
            }}
            disabled={fetchingGiveFreeMonth}
            className="bg-green-500 hover:bg-green-400 text-black hover:text-black"
          >
            {loadingUserId === user.id ? (
              <>
                <Spinner className="text-black" /> Processing...
              </>
            ) : (
              '🎁 Give Free Month'
            )}
          </Button>
        );
      },
    },

    // {
    //   id: 'actions',
    //   enableHiding: false,
    //   cell: ({ row }) => {
    //     const user = row.original;

    //     return (
    //       <DropdownMenu>
    //         <DropdownMenuTrigger asChild>
    //           <Button variant="ghost" className="h-8 w-8 p-0">
    //             <span className="sr-only">Open menu</span>
    //             <MoreHorizontal />
    //           </Button>
    //         </DropdownMenuTrigger>
    //         <DropdownMenuContent align="end">
    //           <DropdownMenuLabel>Actions</DropdownMenuLabel>
    //           <DropdownMenuItem onClick={() => handleEdit(user.id)}>
    //             <Pencil className="mr-2 h-4 w-4" /> Edit
    //           </DropdownMenuItem>
    //           <DropdownMenuItem
    //             onClick={() => handleDelete(user.id)}
    //             disabled={deletingUser}
    //           >
    //             <Trash2 className="mr-2 h-4 w-4 text-red-500" /> Delete
    //           </DropdownMenuItem>
    //         </DropdownMenuContent>
    //       </DropdownMenu>
    //     );
    //   },
    // },
  ];

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: users,
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

  if (fetchingUsers)
    return (
      <div className="flex h-screen items-center justify-center w-full">
        <Spinner className="w-10 h-10 text-green-500" />
      </div>
    );
  if (!data) return <div className="p-4">Failed to load users</div>;

  return (
    <div className="w-full p-4">
      <div className="flex items-center justify-between py-4 ">
        <Input
          placeholder="Filter Name..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="max-w-sm text-black"
        />

        {/* <Button onClick={() => router.push("/user")} className="ml-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button> */}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Users;
