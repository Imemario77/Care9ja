import OnboardingWrapper from "@/components/OnboardingWrapper";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

async function Onboarding() {
  const supabase = createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  async function checkIfUserIdExists(userId) {
    try {
      const { count, error } = await supabase
        .from("users")
        .select("id", { count: "exact", head: true })
        .eq("id", userId);

      if (error) {
        console.error("Error checking user ID:", error);
        return false;
      }

      return count > 0;
    } catch (error) {
      console.error("Unexpected error:", error);
      return false;
    }
  }

  const isOnboarded = await checkIfUserIdExists(user.id);

  if (isOnboarded) {
    redirect("/dashboard");
  }

  return <OnboardingWrapper user={user} />;
}

export default Onboarding;
