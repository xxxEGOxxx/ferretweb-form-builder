import { FormElementInstance } from "@/components/FormElements";

export function idGenerator(elements: FormElementInstance[]): string {
  if (!elements || elements.length === 0) {
    return "1"; // Return 1 if the elements array is empty or undefined
  }

  const ids = elements.map((element: FormElementInstance) =>
    parseInt(element.id)
  );
  const highestId = Math.max(...ids);

  return (highestId + 1).toString();
}
