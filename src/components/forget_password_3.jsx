import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { InputOTPPattern } from "./code_input"
export function PasswordResetForm({
  className,
  ...props
}) {
  return (
    (<form className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold text-nowrap">Set New Password</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Verification successful!
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
            <Label htmlFor="password">Enter a new Password</Label>
            <Input id="password" type="password" className="border border-border focus:ring-primary focus:border-primary" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input id="confirmPassword" type="password" className="border border-border focus:ring-primary focus:border-primary" required />
          </div>
          <Button type="submit" className="w-full">
            Reset Password
          </Button>
        </div>
    </form>)
  );
}