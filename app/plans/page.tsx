"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PlansPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/pests/general");
  }, [router]);

  return null;
}
