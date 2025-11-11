# 🎨 Sub-Action Card - shadcn Redesign

## ✨ Новый Компонент

**Файл**: `src/components/UI/shadcn/sub-action-card.js`

### Что это?

Полностью переработанный компонент для отображения sub-actions, использующий **Card-based design** вместо table rows. Это решает все проблемы с hover borders и выглядит намного современнее.

---

## 📦 Компоненты

### 1. **SubActionCard** - Основная карточка
```jsx
<SubActionCard draggable className={isDragging ? 'dragging' : ''}>
  {/* Контент */}
</SubActionCard>
```

**Особенности:**
- ✅ Card design с border и shadow
- ✅ Hover эффекты (background, border-color, shadow)
- ✅ Drag & drop визуальные индикаторы (линии сверху/снизу)
- ✅ Поддержка темной темы
- ✅ Плавные transitions

### 2. **DragHandle** - Кнопка для перетаскивания
```jsx
<DragHandle>
  <GripVertical />
</DragHandle>
```

**Особенности:**
- ✅ Icon от lucide-react
- ✅ Hover эффект (меняет цвет на primary)
- ✅ Cursor: move

### 3. **SubActionContent** - Grid Layout
```jsx
<SubActionContent>
  <SubActionName />
  <SubActionDate />
  <SubActionDate />
  <SubActionResponsible />
  <SubActionStatus />
</SubActionContent>
```

**Grid Structure:**
```
| Name (2fr) | Start (1fr) | End (1fr) | Responsible (1.5fr) | Status (1fr) |
```

### 4. **SubActionCardItem** - Готовый компонент
```jsx
<SubActionCardItem
  subAction={data}
  index={0}
  parentIndex={0}
  onViewAction={handleView}
  dragHandleProps={dragProps}
  isDragging={false}
  dropClassName=""
  status={<Badge variant="default">Completed</Badge>}
  actions={<DropdownMenuWrapper>...</DropdownMenuWrapper>}
  t={t}
/>
```

---

## 🎨 Визуальный Дизайн

### Normal State:
```
┌──────────────────────────────────────────────────────────────────┐
│ ≡  1.1. Action Name    01/01/24  02/01/24  [👤👤+2]  [Completed] [⋮] │
└──────────────────────────────────────────────────────────────────┘
```

### Hover State:
```
╔══════════════════════════════════════════════════════════════════╗
║ ≡  1.1. Action Name    01/01/24  02/01/24  [👤👤+2]  [Completed] [⋮] ║
╚══════════════════════════════════════════════════════════════════╝
     ↑ Background: accent, Border: primary, Shadow появляется
```

### Drag State:
```
┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐
│ ≡  1.1. Action Name    01/01/24  02/01/24  [👤👤+2]  [Completed] [⋮] │
└ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
     ↑ Opacity: 0.5, Shadow увеличивается
```

### Drop Target:
```
═══════════════════════════════════════════════════════════════════
┌──────────────────────────────────────────────────────────────────┐
│ ≡  1.1. Action Name    01/01/24  02/01/24  [👤👤+2]  [Completed] [⋮] │
└──────────────────────────────────────────────────────────────────┘
═══════════════════════════════════════════════════════════════════
     ↑ Синяя линия показывает куда будет перемещен элемент
```

---

## 🔧 Пример Использования

### В SubActionTable.js:

```jsx
import { 
  SubActionsContainer, 
  SubActionCardItem,
  AddSubActionContainer 
} from '../../UI/shadcn';

// В render:
return (
  <DndProvider manager={manager.current.dragDropManager}>
    <SubActionsContainer>
      {data.map((subAction, index) => {
        const [{ isDragging }, drag] = useDrag({
          type: 'subaction',
          item: { index },
          collect: (monitor) => ({
            isDragging: monitor.isDragging(),
          }),
        });

        const [{ isOver, dropClassName }, drop] = useDrop({
          accept: 'subaction',
          collect: (monitor) => {
            const { index: dragIndex } = monitor.getItem() || {};
            if (dragIndex === index) return {};
            
            return {
              isOver: monitor.isOver(),
              dropClassName: dragIndex < index ? 'drop-over-downward' : 'drop-over-upward',
            };
          },
          drop: (item) => moveRow(item.index, index),
        });

        return (
          <div ref={(node) => drag(drop(node))} key={subAction.id}>
            <SubActionCardItem
              subAction={subAction}
              index={index}
              parentIndex={props.parentIndex}
              onViewAction={handleViewAction}
              isDragging={isDragging}
              dropClassName={dropClassName}
              status={
                <Badge variant={getStatusVariant(subAction.status)}>
                  {t(subAction.status)}
                </Badge>
              }
              actions={
                <DropdownMenuWrapper
                  align="end"
                  trigger={<MoreVertical size={16} />}
                >
                  <DropdownItem onClick={() => handleEdit(subAction)}>
                    <IconEdit />
                    {t("Edit")}
                  </DropdownItem>
                  {/* ... другие действия */}
                </DropdownMenuWrapper>
              }
              t={t}
            />
          </div>
        );
      })}
      
      {/* Add Button */}
      <AddSubActionContainer>
        <button className="add-subaction-btn" onClick={handleAddSubAction}>
          <img src={iconAddSubAction} alt="add" />
          {t("Add subaction")}
        </button>
      </AddSubActionContainer>
    </SubActionsContainer>
  </DndProvider>
);
```

---

## 🎯 Преимущества

### 1. **Нет проблем с границами**
- ✅ Карточки вместо table rows
- ✅ Нет border-bottom conflicts
- ✅ Чистый hover эффект

### 2. **Современный дизайн**
- ✅ Card-based UI (как в shadcn)
- ✅ Shadows при hover
- ✅ Smooth transitions
- ✅ Visual feedback при drag

### 3. **Лучшая визуальная иерархия**
- ✅ Grid layout для колонок
- ✅ Avatar group для ответственных
- ✅ Drag handle слева
- ✅ Actions справа

### 4. **Responsive**
- ✅ Grid → Column на маленьких экранах
- ✅ Адаптивные размеры шрифтов

### 5. **Темная тема**
- ✅ Все цвета через CSS variables
- ✅ Transitions для плавного переключения

---

## 📊 Сравнение

| Аспект | Table Rows (старое) | Card Design (новое) |
|--------|---------------------|---------------------|
| **Hover border** | ❌ Проблемы | ✅ Чисто |
| **Визуальная иерархия** | ⚠️ Плоская | ✅ Явная |
| **Drag feedback** | ⚠️ Базовый | ✅ Rich |
| **Spacing** | ❌ Тесно | ✅ Комфортно |
| **Shadow** | ❌ Нет | ✅ Да |
| **Responsive** | ⚠️ Сложно | ✅ Grid |
| **Темная тема** | ⚠️ Частично | ✅ Полностью |

---

## 🚀 Внедрение

### Шаг 1: Импорт
```jsx
import {
  SubActionsContainer,
  SubActionCardItem,
  AddSubActionContainer
} from '../../UI/shadcn';
```

### Шаг 2: Заменить Table на Container
```jsx
// Было:
<Table columns={columns} dataSource={data} />

// Стало:
<SubActionsContainer>
  {data.map((item, i) => <SubActionCardItem key={i} {...props} />)}
</SubActionsContainer>
```

### Шаг 3: Настроить drag & drop
Использовать существующую логику с `useDrag` и `useDrop`.

### Шаг 4: Удалить старый CSS
Можно удалить `table-subaction.css` так как все стили теперь в компоненте.

---

## ✨ Результат

**Card-based sub-actions** выглядят как современные приложения:
- Notion
- Linear
- Asana
- ClickUp

И полностью соответствуют дизайну shadcn/ui! 🎉

