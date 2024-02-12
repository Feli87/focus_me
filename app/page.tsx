import {
  RegisterLink, 
} from "@kinde-oss/kinde-auth-nextjs/components";
import { Button } from "@/components/ui/button";
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const {
    isAuthenticated
  } = getKindeServerSession();

  if(await isAuthenticated()) {
    redirect('/dashboard')
  }
  return (
    <main>
      <section className="flex items-center justify-center bg-background h-[80vh]">
        <div className="relative items-center w-full px-5 py-12 mx-auto lg:px-15 max-w-7xl md:px-12">
          <div className="max-w-exl mx-auto text-center">
            <div>
            <span className="w-auto px-6 py-3">
              <span className="text-sm font-bold text-primary rounded-full bg-secondary px-4 py-3 ">Demo SaaS App</span>
            </span>
            <h1 className="text-5xl font-bold my-4">Create Notes With Ease</h1>
            <p className="max-w-xl mx-auto text-lg mt-4 text-secondary-foreground">
            Elevate your productivity with our intuitive task management app. Say goodbye to chaos and hello to efficiency.
            </p>
            </div>
            <div className="flex items-center justify-center max-2-xm mx-auto mt-8">
              <RegisterLink>
                <Button size="lg" className='w-[120px] h-[40px]' variant="secondary">
                    Get Started
                </Button>
              </RegisterLink>
                
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
