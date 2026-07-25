import { prisma } from "../lib/prisma";

async function main() {
  console.log("Seeding PestIQ initial service areas & plans...");

  // Service Areas
  const nycArea = await prisma.serviceArea.upsert({
    where: { code: "nyc" },
    update: { name: "New York City (5 Boroughs)" },
    create: { code: "nyc", name: "New York City (5 Boroughs)" },
  });

  const westchesterArea = await prisma.serviceArea.upsert({
    where: { code: "westchester" },
    update: { name: "Lower Westchester County, NY" },
    create: { code: "westchester", name: "Lower Westchester County, NY" },
  });

  const njArea = await prisma.serviceArea.upsert({
    where: { code: "newjersey" },
    update: { name: "Ocean County & Shore, NJ" },
    create: { code: "newjersey", name: "Ocean County & Shore, NJ" },
  });

  // Plans
  const essentialPlan = await prisma.plan.upsert({
    where: { slug: "essential" },
    update: { name: "Essential Pest Plan", description: "Quarterly general pest & insect defense" },
    create: { slug: "essential", name: "Essential Pest Plan", description: "Quarterly general pest & insect defense" },
  });

  const completePlan = await prisma.plan.upsert({
    where: { slug: "complete" },
    update: { name: "Complete Protection Plan", description: "Comprehensive rodent, termite & bug protection" },
    create: { slug: "complete", name: "Complete Protection Plan", description: "Comprehensive rodent, termite & bug protection" },
  });

  const onetimePlan = await prisma.plan.upsert({
    where: { slug: "onetime" },
    update: { name: "One-Time Emergency Treatment", description: "Single targeted treatment with 30-day warranty" },
    create: { slug: "onetime", name: "One-Time Emergency Treatment", description: "Single targeted treatment with 30-day warranty" },
  });

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
