import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ForgotPasswordForm({
  className,
  ...props
}) {
  return (
    (<form className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Forgot Your Password?</h1>
        <p className="text-muted-foreground text-sm text-balance">
          We'll help you reset it and get back to your account.
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Enter your email address here</Label>
          <Input id="email" type="email" placeholder="m@example.com" className="border border-border focus:ring-primary focus:border-primary" required />
        </div>
        <Button type="submit" className="w-full">
          Verify email
        </Button>
      </div>
      <div className="text-center text-sm">
        Go back to {" "}
        <a href="/signup" className="underline underline-offset-4">
          Log in?
        </a>
      </div>
    </form>)
  );
}
