import { LoginForm } from "@/components/login-form"
import { GalleryVerticalEnd } from "lucide-react"
import loginImg from "@/assets/Learning-cuate.svg"
export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Gradify
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center relative justify-center bg-primary shadow-2xs">
        <div className="flex flex-col h-auto items-center justify-center text-white gap-2">
            <h1 className="text-7xl font-bold">Gradify</h1>
            <h3 className="text-xl font-bold italic">Learning Reoptimized</h3>
        </div>
        <img
          src={loginImg}
          alt="Image"
          className="w-128 h-128"
        />
      </div>
    </div>
  )
}
