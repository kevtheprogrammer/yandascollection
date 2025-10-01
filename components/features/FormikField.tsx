
import { useState } from "react";
import { FieldHookConfig, useField } from "formik";
import { Input, InputGroup } from "@/components/input";
import { Field, Label } from "@/components/fieldset";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

interface FormikInputProps extends FieldHookConfig<string> {
  label: string;
  placeholder?: string;
  type?: string;
  name?: string;
  disabled?: boolean;
  required?: boolean;
  autoComplete?: string;
  autoFocus?: boolean;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  value?: string | number;
  defaultValue?: string | number;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  readOnly?: boolean;
  step?: string | number;
  rows?: number;
  cols?: number;
  max?: string | number;
  min?: string | number;
  size?: number;
  spellCheck?: boolean;
  inputMode?: "text" | "numeric" | "decimal" | "email" | "url" | "tel" | "search";
}

export default function FormikInput({ label, type = "text", ...props }: FormikInputProps) {
  const [field, meta] = useField(props);
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  return (
    <Field>
      <Label className="capitalize font-semibold">{label}</Label>

      <div className="relative">
        <Input
          {...field}
          {...props}
          type={isPassword && !showPassword ? "password" : "text"}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"

          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        )}
      </div>

      {isPassword && (
        <p className="text-xs text-gray-500 mt-1">
          Use at least 8 characters, including a number & symbol.
        </p>
      )}

      {meta.touched && meta.error && (
        <p className="text-red-500 text-sm mt-1">{meta.error}</p>
      )}
    </Field>
  );
}

