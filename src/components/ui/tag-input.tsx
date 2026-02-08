import { X } from "lucide-react";
import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/cn";

export interface TagOption {
  value: string;
  label: string;
}

interface TagInputProps {
  options: TagOption[];
  selectedTags: TagOption[];
  onTagsChange: (tags: TagOption[]) => void;
  placeholder?: string;
  allowCreate?: boolean;
  className?: string;
  disabled?: boolean;
}

export function TagInput({
  options,
  selectedTags,
  onTagsChange,
  placeholder = "Search or add tags...",
  allowCreate = false,
  className,
  disabled = false,
}: TagInputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const [highlightedIndex, setHighlightedIndex] = React.useState(0);

  // Filter options that are not already selected
  const availableOptions = options.filter(
    (option) => !selectedTags.some((tag) => tag.value === option.value),
  );

  // Filter options based on input value
  const filteredOptions = availableOptions.filter((option) =>
    option.label.toLowerCase().includes(inputValue.toLowerCase()),
  );

  // Check if input value matches any existing option or selected tag
  const canCreateNew =
    allowCreate &&
    inputValue.trim() !== "" &&
    !options.some(
      (option) => option.label.toLowerCase() === inputValue.toLowerCase(),
    ) &&
    !selectedTags.some(
      (tag) => tag.label.toLowerCase() === inputValue.toLowerCase(),
    );

  // Build the list of selectable items (create option first, then filtered options)
  const selectableItems: Array<{
    type: "option" | "create";
    option?: TagOption;
  }> = [
    ...(canCreateNew ? [{ type: "create" as const }] : []),
    ...filteredOptions.map((option) => ({ type: "option" as const, option })),
  ];

  const handleSelect = (option: TagOption) => {
    onTagsChange([...selectedTags, option]);
    setInputValue("");
    setHighlightedIndex(0);
    inputRef.current?.focus();
  };

  const handleRemove = (tagToRemove: TagOption) => {
    onTagsChange(selectedTags.filter((tag) => tag.value !== tagToRemove.value));
    inputRef.current?.focus();
  };

  const handleCreateNew = () => {
    if (canCreateNew) {
      const newTag: TagOption = {
        value: inputValue.toLowerCase().replace(/\s+/g, "-"),
        label: inputValue.trim(),
      };
      onTagsChange([...selectedTags, newTag]);
      setInputValue("");
      setHighlightedIndex(0);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || selectableItems.length === 0) {
      if (e.key === "Enter" && canCreateNew) {
        e.preventDefault();
        handleCreateNew();
      } else if (
        e.key === "Backspace" &&
        inputValue === "" &&
        selectedTags.length > 0
      ) {
        e.preventDefault();
        handleRemove(selectedTags[selectedTags.length - 1]);
      } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < selectableItems.length - 1 ? prev + 1 : 0,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : selectableItems.length - 1,
        );
        break;
      case "Enter": {
        e.preventDefault();
        const selectedItem = selectableItems[highlightedIndex];
        if (selectedItem) {
          if (selectedItem.type === "option" && selectedItem.option) {
            handleSelect(selectedItem.option);
          } else if (selectedItem.type === "create") {
            handleCreateNew();
          }
        }
        break;
      }
      case "Backspace":
        if (inputValue === "" && selectedTags.length > 0) {
          e.preventDefault();
          handleRemove(selectedTags[selectedTags.length - 1]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHighlightedIndex(0);
    setInputValue(e.target.value);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setHighlightedIndex(0);
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showDropdown = isOpen && (filteredOptions.length > 0 || canCreateNew);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        className={cn(
          "flex min-h-10 w-full flex-wrap items-center gap-1.5 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 text-left",
          disabled && "cursor-not-allowed opacity-50",
        )}
        onClick={() => inputRef.current?.focus()}
        disabled={disabled}
      >
        {selectedTags.map((tag) => (
          <Badge
            key={tag.value}
            variant="secondary"
            className="gap-1 pr-1 hover:bg-secondary/80 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              if (!disabled) handleRemove(tag);
            }}
          >
            {tag.label}
            <X className="h-3 w-3" />
          </Badge>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={selectedTags.length === 0 ? placeholder : ""}
          disabled={disabled}
          className="flex-1 min-w-30 bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
        />
      </button>

      {showDropdown && (
        <div className="absolute top-full left-0 z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95">
          <div className="max-h-50 overflow-y-auto p-1">
            {canCreateNew && (
              <button
                type="button"
                onClick={handleCreateNew}
                onMouseEnter={() => setHighlightedIndex(0)}
                className={cn(
                  "relative flex w-full cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
                  highlightedIndex === 0
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent hover:text-accent-foreground",
                )}
              >
                <span className="text-muted-foreground">Create</span>
                <Badge variant="secondary">{inputValue}</Badge>
              </button>
            )}
            {filteredOptions.map((option, index) => {
              const itemIndex = canCreateNew ? index + 1 : index;
              return (
                <button
                  type="button"
                  key={option.value}
                  onClick={() => handleSelect(option)}
                  onMouseEnter={() => setHighlightedIndex(itemIndex)}
                  className={cn(
                    "relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors text-left",
                    highlightedIndex === itemIndex
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
