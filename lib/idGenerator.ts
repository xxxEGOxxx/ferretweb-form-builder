import { FormElementInstance } from "@/components/FormElements";
import useDesigner from "@/components/hooks/useDesigner";

export function idGenerator(elements: FormElementInstance[]): string {
  if (!elements || elements.length === 0) {
    return "1"; // Return 1 if the elements array is empty or undefined
  }

  const ids = elements.map((element: FormElementInstance) =>
    parseInt(element.id)
  );

  ids.sort((a: number, b: number) => a - b);

  let lowestNonExistentId = 1;
  for (const id of ids) {
    if (id === lowestNonExistentId) {
      lowestNonExistentId++;
    } else {
      break;
    }
  }

  return lowestNonExistentId.toString();
}
