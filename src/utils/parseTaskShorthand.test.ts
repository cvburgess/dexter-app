import test from "node:test";
import assert from "node:assert";
import { Temporal } from "@js-temporal/polyfill";

import { parseTaskShorthand } from "./parseTaskShorthand";
import { TList } from "../api/lists";
import { ETaskPriority } from "../api/tasks";

// Mock lists for testing
const mockLists: TList[] = [
  {
    id: "list-1",
    title: "Work",
    emoji: "💼",
    createdAt: "2024-01-01T00:00:00Z",
    isArchived: false,
  },
  {
    id: "list-2",
    title: "Personal Projects",
    emoji: "🏠",
    createdAt: "2024-01-01T00:00:00Z",
    isArchived: false,
  },
];

// Test helper to format today's date for comparison
const formatDate = (daysOffset: number): string => {
  const today = Temporal.Now.plainDateISO();
  return today.add({ days: daysOffset }).toString();
};

// Priority parsing tests
test("should parse single ! as URGENT (1)", () => {
  const result = parseTaskShorthand("! Buy groceries", mockLists);
  assert.strictEqual(result.title, "Buy groceries");
  assert.strictEqual(result.priority, ETaskPriority.URGENT);
});

test("should parse !! as IMPORTANT (2)", () => {
  const result = parseTaskShorthand("!! Call client", mockLists);
  assert.strictEqual(result.title, "Call client");
  assert.strictEqual(result.priority, ETaskPriority.IMPORTANT);
});

test("should parse !!! as IMPORTANT_AND_URGENT (0)", () => {
  const result = parseTaskShorthand("!!! Fix critical bug", mockLists);
  assert.strictEqual(result.title, "Fix critical bug");
  assert.strictEqual(result.priority, ETaskPriority.IMPORTANT_AND_URGENT);
});

test("should parse !!!! as NEITHER (3)", () => {
  const result = parseTaskShorthand("!!!! Clean desk", mockLists);
  assert.strictEqual(result.title, "Clean desk");
  assert.strictEqual(result.priority, ETaskPriority.NEITHER);
});

test("should not parse priority with more than 4 exclamations", () => {
  const result = parseTaskShorthand("!!!!! Too many", mockLists);
  assert.strictEqual(result.title, "!!!!! Too many");
  assert.strictEqual(result.priority, undefined);
});

// List parsing tests
test("should parse single-word list #work", () => {
  const result = parseTaskShorthand("Complete report #work", mockLists);
  assert.strictEqual(result.title, "Complete report");
  assert.strictEqual(result.listId, "list-1");
});

test("should parse multi-word list #personal-projects", () => {
  const result = parseTaskShorthand(
    "Update website #personal-projects",
    mockLists,
  );
  assert.strictEqual(result.title, "Update website");
  assert.strictEqual(result.listId, "list-2");
});

test("should not match non-existent list", () => {
  const result = parseTaskShorthand("Task #nonexistent", mockLists);
  assert.strictEqual(result.title, "Task #nonexistent");
  assert.strictEqual(result.listId, undefined);
});

test("should handle empty lists array", () => {
  const result = parseTaskShorthand("Task #work", []);
  assert.strictEqual(result.title, "Task #work");
  assert.strictEqual(result.listId, undefined);
});

// Due date parsing tests
test("should parse due:0 as today", () => {
  const result = parseTaskShorthand("Complete task due:0", mockLists);
  assert.strictEqual(result.title, "Complete task");
  assert.strictEqual(result.dueOn, formatDate(0));
});

test("should parse due:3 as 3 days from now", () => {
  const result = parseTaskShorthand("Follow up due:3", mockLists);
  assert.strictEqual(result.title, "Follow up");
  assert.strictEqual(result.dueOn, formatDate(3));
});

test("should handle large day values", () => {
  const result = parseTaskShorthand("Long term goal due:365", mockLists);
  assert.strictEqual(result.title, "Long term goal");
  assert.strictEqual(result.dueOn, formatDate(365));
});

test("should not parse non-numeric due values", () => {
  const result = parseTaskShorthand("Task due:tomorrow", mockLists);
  assert.strictEqual(result.title, "Task due:tomorrow");
  assert.strictEqual(result.dueOn, undefined);
});

// Combined syntax tests
test("should parse priority + list", () => {
  const result = parseTaskShorthand("!! Call client #work", mockLists);
  assert.strictEqual(result.title, "Call client");
  assert.strictEqual(result.priority, ETaskPriority.IMPORTANT);
  assert.strictEqual(result.listId, "list-1");
});

test("should parse priority + due date", () => {
  const result = parseTaskShorthand("!!! Fix bug due:0", mockLists);
  assert.strictEqual(result.title, "Fix bug");
  assert.strictEqual(result.priority, ETaskPriority.IMPORTANT_AND_URGENT);
  assert.strictEqual(result.dueOn, formatDate(0));
});

test("should parse list + due date", () => {
  const result = parseTaskShorthand(
    "Update docs #personal-projects due:3",
    mockLists,
  );
  assert.strictEqual(result.title, "Update docs");
  assert.strictEqual(result.listId, "list-2");
  assert.strictEqual(result.dueOn, formatDate(3));
});

test("should parse all three: priority + list + due date", () => {
  const result = parseTaskShorthand("! Review code #work due:0", mockLists);
  assert.strictEqual(result.title, "Review code");
  assert.strictEqual(result.priority, ETaskPriority.URGENT);
  assert.strictEqual(result.listId, "list-1");
  assert.strictEqual(result.dueOn, formatDate(0));
});

test("should parse all combinations in different orders", () => {
  const result = parseTaskShorthand(
    "Complete task due:3 !! #personal-projects",
    mockLists,
  );
  assert.strictEqual(result.title, "Complete task");
  assert.strictEqual(result.priority, ETaskPriority.IMPORTANT);
  assert.strictEqual(result.listId, "list-2");
  assert.strictEqual(result.dueOn, formatDate(3));
});

// Edge cases tests
test("should handle empty input", () => {
  const result = parseTaskShorthand("", mockLists);
  assert.strictEqual(result.title, "");
});

test("should handle whitespace-only input", () => {
  const result = parseTaskShorthand("   ", mockLists);
  assert.strictEqual(result.title, "");
});

test("should preserve original input if title becomes empty after parsing", () => {
  const result = parseTaskShorthand("!", mockLists);
  assert.strictEqual(result.title, "!");
  assert.strictEqual(result.priority, undefined);
});

test("should handle multiple spaces between components", () => {
  const result = parseTaskShorthand("!   Task   #work   due:0", mockLists);
  assert.strictEqual(result.title, "Task");
  assert.strictEqual(result.priority, ETaskPriority.URGENT);
  assert.strictEqual(result.listId, "list-1");
  assert.strictEqual(result.dueOn, formatDate(0));
});

test("should handle components at end of string without trailing space", () => {
  const result = parseTaskShorthand("Task #work", mockLists);
  assert.strictEqual(result.title, "Task");
  assert.strictEqual(result.listId, "list-1");
});

test("should handle due date at end without trailing space", () => {
  const result = parseTaskShorthand("Task due:3", mockLists);
  assert.strictEqual(result.title, "Task");
  assert.strictEqual(result.dueOn, formatDate(3));
});

// All priority combinations with lists and due dates
const priorities = [
  { symbol: "!", expected: ETaskPriority.URGENT, name: "URGENT" },
  { symbol: "!!", expected: ETaskPriority.IMPORTANT, name: "IMPORTANT" },
  {
    symbol: "!!!",
    expected: ETaskPriority.IMPORTANT_AND_URGENT,
    name: "IMPORTANT_AND_URGENT",
  },
  { symbol: "!!!!", expected: ETaskPriority.NEITHER, name: "NEITHER" },
];

const lists = [
  { shorthand: "#work", expectedId: "list-1", title: "Work (single word)" },
  {
    shorthand: "#personal-projects",
    expectedId: "list-2",
    title: "Personal Projects (multi-word)",
  },
];

const dueDates = [
  { shorthand: "due:0", expected: formatDate(0), name: "today" },
  { shorthand: "due:3", expected: formatDate(3), name: "3 days from now" },
];

priorities.forEach((priority) => {
  lists.forEach((list) => {
    dueDates.forEach((dueDate) => {
      test(`should parse ${priority.name} + ${list.title} + ${dueDate.name}`, () => {
        const input = `${priority.symbol} Test task ${list.shorthand} ${dueDate.shorthand}`;
        const result = parseTaskShorthand(input, mockLists);

        assert.strictEqual(result.title, "Test task");
        assert.strictEqual(result.priority, priority.expected);
        assert.strictEqual(result.listId, list.expectedId);
        assert.strictEqual(result.dueOn, dueDate.expected);
      });
    });
  });
});
