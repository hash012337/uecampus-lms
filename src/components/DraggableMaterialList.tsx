import { useState } from 'react';
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
import { GripVertical, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Material {
  id: string;
  title: string;
  file_type: string;
  order_index: number;
}

interface SortableItemProps {
  material: Material;
  onDelete: (id: string) => void;
  getFileIcon: (fileType: string) => React.ReactNode;
}

function SortableItem({ material, onDelete, getFileIcon }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: material.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 p-2 bg-card rounded border"
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </button>
      {getFileIcon(material.file_type)}
      <span className="flex-1 text-sm truncate">{material.title}</span>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDelete(material.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

interface DraggableMaterialListProps {
  materials: Material[];
  onReorder: (materials: Material[]) => void;
  onDelete: (id: string) => void;
  getFileIcon: (fileType: string) => React.ReactNode;
}

export function DraggableMaterialList({
  materials,
  onReorder,
  onDelete,
  getFileIcon,
}: DraggableMaterialListProps) {
  const [items, setItems] = useState(materials);

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

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {items.map((material) => (
            <SortableItem
              key={material.id}
              material={material}
              onDelete={onDelete}
              getFileIcon={getFileIcon}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
