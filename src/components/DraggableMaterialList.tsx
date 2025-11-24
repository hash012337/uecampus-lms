import { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, ChevronDown, ChevronRight, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { FileViewer } from '@/components/FileViewer';

interface Material {
  id: string;
  title: string;
  file_type: string;
  order_index: number;
  file_path: string;
  description?: string;
  file_size?: number;
}

interface SortableItemProps {
  material: Material;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Material>) => void;
  getFileIcon: (fileType: string) => React.ReactNode;
}

function SortableItem({ material, onDelete, onUpdate, getFileIcon }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: material.id });

  const [isOpen, setIsOpen] = useState(false);
  const [editedTitle, setEditedTitle] = useState(material.title);
  const [editedDescription, setEditedDescription] = useState(material.description || '');

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleSave = () => {
    onUpdate(material.id, {
      title: editedTitle,
      description: editedDescription,
    });
    setIsOpen(false);
  };

  return (
    <Collapsible
      ref={setNodeRef}
      style={style}
      open={isOpen}
      onOpenChange={setIsOpen}
      className="border rounded bg-card"
    >
      <div className="flex items-center gap-2 p-2">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </button>
        {getFileIcon(material.file_type)}
        <span className="flex-1 text-sm truncate">{material.title}</span>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">
            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(material.id);
          }}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>

      <CollapsibleContent className="border-t">
        <div className="p-4 space-y-4">
          {/* Edit Section */}
          <div className="space-y-3">
            <div>
              <Label htmlFor={`title-${material.id}`}>Title</Label>
              <Input
                id={`title-${material.id}`}
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                placeholder="Material title"
              />
            </div>
            <div>
              <Label htmlFor={`desc-${material.id}`}>Description</Label>
              <Input
                id={`desc-${material.id}`}
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                placeholder="Material description"
              />
            </div>
            <Button onClick={handleSave} size="sm" className="w-full">
              Save Changes
            </Button>
          </div>

          {/* Preview Section */}
          <div className="border-t pt-4">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="h-4 w-4" />
              <Label>Preview</Label>
            </div>
            <div className="border rounded-lg overflow-hidden bg-muted/30 h-64">
              <FileViewer file={material} />
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

interface DraggableMaterialListProps {
  materials: Material[];
  onReorder: (materials: Material[]) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Material>) => void;
  getFileIcon: (fileType: string) => React.ReactNode;
}

export function DraggableMaterialList({
  materials,
  onReorder,
  onDelete,
  onUpdate,
  getFileIcon,
}: DraggableMaterialListProps) {
  const [items, setItems] = useState(materials);

  // Sync internal state with materials prop
  useEffect(() => {
    setItems(materials);
  }, [materials]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);
      onReorder(newItems);
    }
  };

  // Don't render if no items
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items.map(item => item.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {items.map((material) => (
            <SortableItem
              key={material.id}
              material={material}
              onDelete={onDelete}
              onUpdate={onUpdate}
              getFileIcon={getFileIcon}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
