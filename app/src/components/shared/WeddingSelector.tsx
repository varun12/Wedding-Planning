import { useWedding } from "@/contexts/WeddingContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function WeddingSelector() {
  const { weddings, activeWedding, setActiveWeddingId } = useWedding();

  if (weddings.length <= 1) return null;

  return (
    <Select value={activeWedding?.id ?? ""} onValueChange={setActiveWeddingId}>
      <SelectTrigger className="w-[220px]">
        <SelectValue placeholder="Select wedding" />
      </SelectTrigger>
      <SelectContent>
        {weddings.map((w) => (
          <SelectItem key={w.id} value={w.id}>
            {w.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
