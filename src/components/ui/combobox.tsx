'use client';

import { Button } from '@/src/components/ui/button';
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/src/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/src/components/ui/popover';
import { cn } from '@/src/lib/utils';
import { useDebounce } from '@uidotdev/usehooks';
import { Check, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';

interface Props<T extends { id: string | number }> {
  getItems: (search: string) => Promise<T[]>;
  renderItem: (item: T) => React.ReactNode;
  value: T | undefined | null;
  setValue: (item: T | undefined | null) => void;
  emptyText?: (value: string) => string;
  selectEmptyText?: (searchText: string) => void;
  placeholder?: string;
}

export function Combobox<T extends { id: string | number }>(props: Props<T>) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [items, setItems] = React.useState<T[]>([]);
  const [search, setSearch] = React.useState('');
  const debouncedSearch = useDebounce(search, 500);

  // todo wrap in useQuery
  const getItems = async (search: string) => {
    setLoading(true);
    setItems([]);
    const res = await props.getItems(search);
    setItems(res);
    setLoading(false);
  };

  React.useEffect(() => {
    getItems(debouncedSearch);
  }, [debouncedSearch]);

  const getLabel = () => {
    return props.value
      ? props.renderItem(props.value)
      : props.placeholder
      ? props.placeholder
      : 'Select...';
  };

  const setValue = (value: string) => {
    props.setValue(items.find(item => item.id == value));
    setOpen(false);
  };

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button
          aria-expanded={open}
          autoFocus={false}
          className="w-[300px] justify-between"
          onFocus={e => e.preventDefault()}
          role="combobox"
          variant="outline">
          {getLabel()}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            onValueChange={setSearch}
            placeholder="Search for contact..."
            value={search}
          />
          {
            loading ? (
              <CommandItem>
                <div className="px-2 py-1.5 text-center text-sm">
                  Fetching contacts...
                </div>
              </CommandItem>
            ) : null
            // <CommandEmpty onSelect={() => {props.selectEmptyText?.(search)}}>asdf{props.emptyText ? props.emptyText(search) : 'No contact found.'}</CommandEmpty>
          }
          <CommandGroup>
            {items.map(item => {
              return (
                <CommandItem
                  key={item.id}
                  onSelect={currentValue => {
                    setValue(currentValue);
                  }}
                  value={
                    typeof item.id === 'number' ? item.id.toString() : item.id
                  }>
                  <Check
                    className={cn(
                      'mr-1 h-2 w-2 min-w-2 flex-shrink-0',
                      props.value?.id === item.id ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  {props.renderItem(item)}
                </CommandItem>
              );
            })}
            {!loading && items.length === 0 ? (
              <CommandItem
                onSelect={() => {
                  props.selectEmptyText?.(search);
                }}>
                {props.emptyText
                  ? props.emptyText(search)
                  : 'No contact found.'}
              </CommandItem>
            ) : null}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
