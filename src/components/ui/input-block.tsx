import * as React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface InputBlockProps {
  label: string;
  value: string | number | null;
  id?: string;
  className?: string;
}

const InputBlock: React.FC<InputBlockProps> = ({ label, value, id, className }) => {
  return (
    <div className={className}>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        value={value ?? ""}
        disabled
        className="mt-1 bg-gray-50"
      />
    </div>
  );
};

export { InputBlock };
