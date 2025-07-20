import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { FormControl, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Eye, EyeOff } from "lucide-react";

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: "text" | "email" | "password";
  cStyle: string;
  handlePasswordView?: () => void
  isPassword?: boolean
}

const FormField = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = "text",
  cStyle,
  handlePasswordView,
  isPassword
}: FormFieldProps<T>) => {

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={`${cStyle}`}>
          <FormLabel className="label">{label}</FormLabel>
          <FormControl>
            <div className='flex justify-center items-center w-full border rounded focus:outline-ring-1'>
              <Input
                className="focus:outline-none border-none"
                type={type}
                placeholder={placeholder}
                {...field}
              />
              {
                label === "Password"
                &&
                <div
                onClick={handlePasswordView}
                className='flex justify-center items-center pr-3'
                >
                  {
                    isPassword
                    ?
                    <Eye/>
                    :
                    <EyeOff/>
                  }
                </div>
              }
              </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormField;
