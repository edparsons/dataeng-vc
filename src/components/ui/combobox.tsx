'use client';

import { Button } from '@/src/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/src/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/src/components/ui/popover';
import { cn } from '@/src/lib/utils';
import { useDebounce } from '@uidotdev/usehooks';
import { useCommandState } from 'cmdk';
import { Check, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';

interface Props {
  items: string[];
  value: string | undefined | null;
  setValue: (item: string | undefined | null) => void;
  placeholder?: string;
}

function Empty({setIsEmpty}: {setIsEmpty: (isEmpty: boolean) => void}) {
  const isEmpty = useCommandState((state) => state.filtered.count === 0)
  React.useEffect(() => {
    setIsEmpty(isEmpty)
  }, [isEmpty])
  return null
}

export function Combobox(props: Props) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [isEmpty, setIsEmpty] = React.useState(false);
  const items = props.items

  const setValue = (value: string) => {
    props.setValue(value);
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
          { props.value ? props.value : props.placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command onKeyDown={(e) => {
      // Escape goes to previous page
      // Backspace goes to previous page when search is empty
      if (e.key === 'Enter' && isEmpty) {
        setValue(search)
      }
      if (e.key === 'ArrowLeft') {
        e.stopPropagation()
        }
        if (e.key === 'ArrowRight') {
          e.stopPropagation()
          }
    }}>
          <CommandInput
            onValueChange={setSearch}
            placeholder={props.placeholder}
            value={search}
          />
          <Empty setIsEmpty={setIsEmpty} />
          <CommandList>
            <CommandGroup>
              {items.map(item => {
                return (
                  <CommandItem
                    key={item}
                    onSelect={currentValue => {
                      setValue(currentValue);
                    }}
                    value={
                      item
                    }>
                    <Check
                      className={cn(
                        'mr-1 h-2 w-2 min-w-2 flex-shrink-0',
                        props.value === item ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                    {item}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
