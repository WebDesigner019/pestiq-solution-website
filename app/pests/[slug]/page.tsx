'use client'

import { useLocation } from '@/context/LocationContext'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { useRouter } from 'next/navigation'
import { use } from 'react'
import Image from 'next/image'

const PEST_DATA: Record<string, any> = {
  'general': {
    name: 'General Pest',
    title: 'General pest control & prevention',
    subtitle: 'Comprehensive 365-day protection against 39+ common household pests.',
    heroImage: '/images/pest-technician-pro.png',
    covered: { essential: 25, complete: 39 },
    description: 'Our general pest control plan covers a broad spectrum of crawling insects, spiders, and rodents. Regular seasonal treatments form an impenetrable barrier around your home.',
    bullets: ['Covers 39+ common household pests.', 'Seasonal interior and exterior barriers.', 'Free retreatments if pests return.'],
    tabs: ['Perimeter Barrier', 'Interior Crack & Crevice', 'Foundation Barrier', 'Seasonal Audits']
  },
  'ants': {
    name: 'Ant',
    title: 'Ant control & colony elimination',
    subtitle: 'Protect your home from ant invasions with targeted baiting & perimeter barriers.',
    heroImage: '/images/ant-macro.jpg',
    covered: { essential: 25, complete: 39 },
    description: 'Ants establish large underground and wall-void colonies. PestIQ targets the queen and subterranean nest pathways to ensure full colony elimination.',
    bullets: ['Prevents food & kitchen contamination.', 'Destroys hidden subterranean nests.', 'Long-lasting perimeter barrier protection.'],
    tabs: ['Non-Repellent Liquid', 'Granular Bait Placement', 'Perimeter Barrier', 'Colony Tracking']
  },
  'bats': {
    name: 'Bat',
    title: 'Humane bat exclusion & attic cleanup',
    subtitle: 'Safely exclude bats from attics, roof soffits, and chimneys with zero harm.',
    heroImage: '/images/suburban-houses.png',
    covered: { essential: 25, complete: 39 },
    description: 'Bats take refuge in attics and gable vents, accumulating guano that harbors fungal spores. PestIQ installs legal one-way exclusion valves and sanitizes attic voids.',
    bullets: ['Humane one-way exclusion cones.', 'Attic guano sanitization & deodorization.', 'Seals all roofline & chimney gaps.'],
    tabs: ['Attic Audit', 'One-Way Exclusion', 'Gap Sealing', 'Guano Sanitization']
  },
  'bed-bugs': {
    name: 'Bed Bug',
    title: 'Bed bug extermination & heat treatment',
    subtitle: 'Sleep soundly again with specialized thermal & rapid-acting bed bug protocols.',
    heroImage: '/images/bed-bug-mattress.png',
    covered: { essential: 25, complete: 39 },
    description: 'Bed bugs hide deep inside mattress seams, headboards, and electrical outlets. PestIQ applies multi-tiered treatments targeting adults, nymphs, and eggs.',
    bullets: ['Eliminates bed bugs at all life stages.', 'Targeted mattress & box spring encasements.', 'Rapid relief backed by 90-day guarantee.'],
    tabs: ['Thermal Heat Boost', 'Residual Micro-Cap', 'Mattress Encasement', 'Follow-up Inspection']
  },
  'birds': {
    name: 'Bird',
    title: 'Commercial & residential bird deterrents',
    subtitle: 'Keep pigeons, starlings, and sparrows off ledges, roofs, and solar panels.',
    heroImage: '/images/birds.jpg',
    covered: { essential: 25, complete: 39 },
    description: 'Nesting birds damage roof tiles, block gutters, and corrode paint with droppings. We install stainless steel bird spikes, invisible mesh, and solar panel guards.',
    bullets: ['Protects solar panels & roof ledges.', 'Prevents corrosive bird droppings.', 'Humane netting & anti-roosting spikes.'],
    tabs: ['Bird Spikes', 'Solar Panel Guards', 'Discreet Netting', 'Structural Decontamination']
  },
  'carpenter-ants': {
    name: 'Carpenter Ant',
    title: 'Carpenter ant damage prevention',
    subtitle: 'Stop wood-destroying carpenter ants before they tunnel into structural beams.',
    heroImage: '/images/ant-macro.jpg',
    covered: { essential: 25, complete: 39 },
    description: 'Carpenter ants excavate wooden framing to build satellite nests. PestIQ injects non-repellent formulations into wall voids to eliminate parent nests.',
    bullets: ['Stops structural wood excavation.', 'Targets satellite & parent nests.', 'Moisture source inspection included.'],
    tabs: ['Void Dust Injection', 'Perimeter Liquid Barrier', 'Satellite Nest Search', 'Moisture Audit']
  },
  'centipedes-millipedes': {
    name: 'Centipede & Millipede',
    title: 'Centipede & millipede eradication',
    subtitle: 'Keep fast-moving crawlers out of basements, bathrooms, and crawlspaces.',
    heroImage: '/images/spider-web.png',
    covered: { essential: 25, complete: 39 },
    description: 'Centipedes and millipedes migrate indoors seeking damp environments. We apply exterior perimeter bands and micro-encapsulated foundation dusts.',
    bullets: ['Eliminates scary multi-legged crawlers.', 'Targeted damp basement & crawlspace treatment.', 'Foundation crack & weep-hole sealing.'],
    tabs: ['Perimeter Band Spray', 'Crawlspace Treatment', 'Foundation Dusting', 'Humidity Advice']
  },
  'cockroaches': {
    name: 'Cockroach',
    title: 'Cockroach control & elimination',
    subtitle: 'Eliminate German, American, and Oriental cockroaches with advance baiting.',
    heroImage: '/images/cockroach.jpg',
    covered: { essential: 25, complete: 39 },
    description: 'Cockroaches carry bacteria and allergens. PestIQ combines high-potency gel baits with Insect Growth Regulators (IGRs) to break egg hatching cycles.',
    bullets: ['Destroys German & American roach nests.', 'IGR technology stops egg reproduction.', 'Food-safe kitchen baiting placement.'],
    tabs: ['Precision Gel Bait', 'Insect Growth Regulator', 'Crevice Injection', 'Sanitation Check']
  },
  'crickets': {
    name: 'Cricket',
    title: 'Cricket control & perimeter defense',
    subtitle: 'Stop loud chirping and protect interior fabrics, rugs, and wallpaper.',
    heroImage: '/images/spider-web.png',
    covered: { essential: 25, complete: 39 },
    description: 'Field and camel crickets invade dark basements and garages in large numbers. We set granular barriers and specialized monitoring traps.',
    bullets: ['Protects clothes, carpets, and fabrics.', 'Eliminates annoying nocturnal chirping.', 'Heavy exterior perimeter granular barrier.'],
    tabs: ['Granular Perimeter Bait', 'Basement Glue Traps', 'Exterior Gap Seal', 'Mulch Bed Treatment']
  },
  'fleas': {
    name: 'Flea',
    title: 'Flea eradication & yard protection',
    subtitle: 'Banish fleas from carpets, pet bedding, and backyard lawn areas.',
    heroImage: '/images/fleas.jpg',
    covered: { essential: 25, complete: 39 },
    description: 'Fleas infest carpets and furniture, biting pets and humans. Our comprehensive protocol includes interior carpet misting and outdoor lawn barrier applications.',
    bullets: ['Stops relentless flea bites on pets.', 'Breaks adult & pupae flea lifecycle.', 'Dual indoor carpet & yard mist.'],
    tabs: ['Indoor Carpet Spray', 'Yard Border Mist', 'Flea Life-Cycle IGR', 'Furniture Upholstery Care']
  },
  'flies': {
    name: 'Fly',
    title: 'House, fruit & drain fly management',
    subtitle: 'Eliminate breeding sites for fruit flies, phorid flies, and house flies.',
    heroImage: '/images/mosquito.jpg',
    covered: { essential: 25, complete: 39 },
    description: 'Flies breed in plumbing organic matter and trash cans. PestIQ uses bio-enzymatic drain foams and UV light traps to digest breeding zones.',
    bullets: ['Clears fruit flies & drain flies.', 'Bio-enzymatic foam breaks down drain sludge.', 'Discreet light traps for food prep areas.'],
    tabs: ['Bio-Drain Foam', 'Light Trap Installation', 'Exterior Fly Bait', 'Sanitation Inspection']
  },
  'mice': {
    name: 'Mice',
    title: 'Mice control & steel mesh exclusion',
    subtitle: 'Seal dime-sized entry holes and trap invading mice for a rodent-free home.',
    heroImage: '/images/rodent-mouse.png',
    covered: { essential: 25, complete: 39 },
    description: 'Mice contaminate food stores and chew wires inside wall cavities. PestIQ technicians perform complete steel mesh exclusion and tamper-resistant trapping.',
    bullets: ['Seals dime-sized foundation gaps.', 'Prevents wire chewing & fire hazards.', 'Tamper-proof baiting & trapping.'],
    tabs: ['Copper & Steel Exclusion', 'Indoor Trapping Array', 'Exterior Bait Stations', 'Sanitizing Treatment']
  },
  'mosquitoes': {
    name: 'Mosquito',
    title: 'Mosquito yard reduction & foliage misting',
    subtitle: 'Take back your backyard with monthly seasonal mosquito foliage barriers.',
    heroImage: '/images/mosquito-macro.png',
    covered: { essential: 25, complete: 39 },
    description: 'Mosquitoes rest under shaded leaves during daytime. PestIQ coats the underside of bushes and trees with eco-friendly barrier mists to knock down populations.',
    bullets: ['Reduces mosquito bites by up to 90%.', 'Targeted leaf-underside barrier misting.', 'Standing water larvicide treatment.'],
    tabs: ['Shade Foliage Mist', 'Larvicide Briquettes', 'Property Drainage Check', 'Monthly Seasonal Pass']
  },
  'moths': {
    name: 'Moth',
    title: 'Pantry & clothes moth extermination',
    subtitle: 'Protect pantry grains, wool suits, and oriental rugs from destructive larvae.',
    heroImage: '/images/bedroom.jpg',
    covered: { essential: 25, complete: 39 },
    description: 'Moth larvae feed on cereal products or natural fibers like wool and silk. We utilize specialized pheromone lure traps and micro-encapsulated void treatments.',
    bullets: ['Protects woolens, silk, and rugs.', 'Pheromone lures stop mating cycles.', 'Safe pantry & closet treatments.'],
    tabs: ['Pheromone Traps', 'Closet Crevice Treatment', 'Pantry Sanitation', 'Preventative Inspection']
  },
  'rats': {
    name: 'Rat',
    title: 'Norway & roof rat control',
    subtitle: 'Heavy-duty rat trapping, burrow baiting, and structural exclusion.',
    heroImage: '/images/rodent-mouse.png',
    covered: { essential: 25, complete: 39 },
    description: 'Rats pose severe structural risks by burrowing around foundations and gnawing pipes. PestIQ sets heavy-duty exterior bait boxes and seals entry points.',
    bullets: ['Heavy-duty tamper-proof rat boxes.', 'Burrow treatment & foundation seal.', 'Prevents pipe & insulation destruction.'],
    tabs: ['Rat Box Installation', 'Foundation Heavy Seal', 'Attic & Crawl Traps', 'Sanitization']
  },
  'rodents': {
    name: 'Rodent',
    title: 'Complete rodent control & exclusion',
    subtitle: 'Full 365-day protection against mice, rats, and squirrels.',
    heroImage: '/images/rodent-mouse.png',
    covered: { essential: 25, complete: 39 },
    description: 'Comprehensive rodent defense covering all species. We inspect attics, basements, and foundation weep holes to ensure total exclusion.',
    bullets: ['Covers all species of mice & rats.', 'Full perimeter exclusion warranty.', 'Free retreatments if rodents return.'],
    tabs: ['Full Home Audit', 'Steel Exclusion Seal', 'Multi-Catch Trapping', 'Exterior Defense']
  },
  'scorpions': {
    name: 'Scorpion',
    title: 'Scorpion barrier & nocturnal blacklight audit',
    subtitle: 'Keep stinging scorpions out of shoes, bedding, and patio living areas.',
    heroImage: '/images/spider-web.png',
    covered: { essential: 25, complete: 39 },
    description: 'Scorpions seek cool shelter under foundation weep holes and block walls. We apply specialized micro-encapsulated barriers and offer night blacklight audits.',
    bullets: ['Micro-encapsulated scorpion barrier.', 'Weep-hole mesh installation.', 'Nocturnal blacklight audit service.'],
    tabs: ['Micro-Cap Spray', 'Weep Hole Screen', 'Blacklight Night Check', 'Harborage Cleanup']
  },
  'silverfish': {
    name: 'Silverfish',
    title: 'Silverfish control & humidity reduction',
    subtitle: 'Prevent silverfish from feeding on books, wallpaper adhesive, and linen closets.',
    heroImage: '/images/spider-web.png',
    covered: { essential: 25, complete: 39 },
    description: 'Silverfish thrive in high humidity and consume starches in wallpaper and book bindings. We inject long-lasting desiccant dusts into wall voids.',
    bullets: ['Protects wallpaper, books, & linens.', 'Deep wall-void desiccant dusting.', 'Dehumidification & ventilation advice.'],
    tabs: ['Wall-Void Dusting', 'Attic Barrier', 'Plumbing Void Injection', 'Humidity Audit']
  },
  'spiders': {
    name: 'Spider',
    title: 'Spider control & eave de-webbing',
    subtitle: 'Sweep away spider webs and clear black widows and brown recluses.',
    heroImage: '/images/spider-web.png',
    covered: { essential: 25, complete: 39 },
    description: 'Spiders build webs around windows, soffits, and light fixtures. PestIQ performs complete 2-story eave de-webbing and applies targeted window/door frame sprays.',
    bullets: ['2-Story eave & soffit de-webbing.', 'Targeted black widow & recluse treatment.', 'Eliminates spider insect prey.'],
    tabs: ['Eave De-Webbing', 'Perimeter Barrier Spray', 'Window Frame Seal', 'Basement Sweep']
  },
  'stinging-pests': {
    name: 'Stinging Pest',
    title: 'Stinging insect & nest neutralization',
    subtitle: 'Safely neutralize hornets, yellowjackets, bees, and wasps from eaves & bushes.',
    heroImage: '/images/ant-macro.jpg',
    covered: { essential: 25, complete: 39 },
    description: 'Stinging insects create hazardous nests near doorways and rooflines. Our certified techs use protective suits and high-reach poles to safely remove nests.',
    bullets: ['Protects against severe allergic stings.', 'Safe removal of aerial & ground nests.', 'Preventative soffit dust application.'],
    tabs: ['High-Reach Nest Removal', 'Dust Injection', 'Eave Barrier', 'Safety Inspection']
  },
  'ticks': {
    name: 'Tick',
    title: 'Tick control & Lyme disease defense',
    subtitle: 'Protect your children and pets with targeted woodline and yard tick barriers.',
    heroImage: '/images/mosquito-macro.png',
    covered: { essential: 25, complete: 39 },
    description: 'Ticks hide in tall grass and leaf litter. PestIQ sprays perimeter woodlines and lawn borders to prevent ticks from hitching a ride on your family.',
    bullets: ['Defends against Lyme disease & ticks.', 'Targets leaf litter & woodline borders.', 'Pet-safe after drying.'],
    tabs: ['Woodline Border Mist', 'Leaf Litter Treatment', 'Perimeter Granulars', 'Bi-Monthly Check']
  },
  'wasps': {
    name: 'Wasp',
    title: 'Wasp nest extermination & eave guard',
    subtitle: 'Fast-response wasp nest knockdown and lingering eave repellent treatment.',
    heroImage: '/images/ant-macro.jpg',
    covered: { essential: 25, complete: 39 },
    description: 'Wasps build paper nests under deck railings and roof eaves. PestIQ offers fast-response knockdown and lingering repellent dusts to prevent rebuilding.',
    bullets: ['Prevents painful aggressive stings.', 'Safely knocks down paper nests.', 'Applies eave repellent dust.'],
    tabs: ['Nest Knockdown', 'Eave Dusting', 'Deck Railing Treatment', 'Seasonal Guarantee']
  }
};

const getPrices = (priceTier: string, propertySqFt: number) => {
  let base = { essential: 44.99, complete: 54.99, onetime: 229.99 };
  if (priceTier === 'westchester') base = { essential: 49.99, complete: 59.99, onetime: 249.99 };
  if (priceTier === 'newjersey') base = { essential: 44.99, complete: 54.99, onetime: 229.99 };
  
  let adj = 0;
  if (propertySqFt > 1500 && propertySqFt <= 2500) adj = 5;
  else if (propertySqFt > 2500 && propertySqFt <= 3500) adj = 10;
  else if (propertySqFt > 3500) adj = 15;
  
  return {
    essential: (base.essential + adj).toFixed(2),
    complete: (base.complete + adj).toFixed(2),
    onetime: (base.onetime + adj * 3).toFixed(2)
  };
};

export default function PestServicePage(props: { params: Promise<{ slug: string }> }) {
  const params = use(props.params);
  const router = useRouter();
  
  // Use context
  const { isAddressModalOpen, setIsAddressModalOpen, zipCode, priceTier, propertySqFt, setCartItem } = useLocation();
  const isAddressVerified = !!zipCode;
  
  let slug = params.slug;
  let pest = PEST_DATA[slug];
  if (!pest) {
    const formattedName = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    pest = {
      name: formattedName.replace(/ Control$/i, ''),
      title: `${formattedName} & treatment`,
      subtitle: `Protect your home from ${formattedName.toLowerCase()} with targeted extermination solutions.`,
      heroImage: '/images/ant-macro.jpg',
      covered: { essential: 25, complete: 39 },
      description: `Professional ${formattedName.toLowerCase()} service customized for residential and commercial properties. Our certified technicians target harborages and implement long-lasting barriers.`,
      bullets: ['Targeted perimeter application.', 'Safe for pets and family members.', 'Prevents recurring seasonal infestations.'],
      tabs: ['Inspection', 'Targeted Treatment', 'Exclusion', 'Monitoring']
    };
  }
  const prices = getPrices(priceTier || 'nyc', propertySqFt || 2000);

  const handleAddToCart = (planId: "essential" | "complete" | "onetime", planName: string, monthlyPrice: string, initialFee: string, isSubscription: boolean) => {
    setCartItem({ planId, planName, monthlyPrice, initialFee, isSubscription });
    router.push('/checkout');
  };

  return (
    <div className="site-shell site-v3 font-sans min-h-screen flex flex-col bg-slate-50">
      <Header />

      
      <main className="flex-grow">
        {/* Breadcrumbs */}
        <div className="max-w-6xl mx-auto px-4 py-3 text-sm text-gray-500">
          Home / {pest.name} control
        </div>

        {/* Hero Section */}
        <section className="relative w-full min-h-[360px] md:h-[420px] py-12 md:py-0 flex items-center justify-center bg-gray-900">
          <div className="absolute inset-0 z-0">
            {/* Fallback color if image is missing */}
            <div className="absolute inset-0 bg-[#071b4d] opacity-80 z-10" />
            <Image src={pest.heroImage} alt={pest.name} fill className="object-cover object-center" sizes="100vw" priority />
          </div>
          <div className="relative z-20 text-center text-white max-w-3xl px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{pest.title}</h1>
            <p className="text-lg md:text-xl mb-8">{pest.subtitle}</p>
            <button 
              onClick={() => {
                const el = document.getElementById('plans');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else setIsAddressModalOpen(true);
              }}
              className="bg-[#ffc400] text-black font-bold py-3 px-8 rounded-full hover:bg-yellow-400 transition-colors shadow-lg"
            >
              See plans
            </button>
          </div>
        </section>

        {/* Star Rating Bar */}
        <section className="bg-[#071b4d] text-white py-3 text-center">
          <p className="font-semibold text-sm md:text-base flex items-center justify-center gap-2">
            <span className="text-[#ffc400] text-xl">★★★★★</span> 4.5 | Based on 89k verified reviews
          </p>
        </section>

        {/* Promo Banner */}
        <section className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row rounded-lg overflow-hidden shadow-md">
            <div className="bg-white p-6 md:w-2/3 flex flex-col justify-center border-l-4 border-green-600">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Save BIG on your first pest control service</h3>
              <p className="text-gray-600 mb-4">Get your first pest control service for only $149</p>
              <div>
                <button className="bg-[#ffc400] text-black font-bold py-2 px-6 rounded-full hover:bg-yellow-400 transition-colors">
                  Act and save now
                </button>
              </div>
            </div>
            <div className="bg-[#17824b] text-white p-6 md:w-1/3 flex flex-col items-center justify-center text-center">
              <span className="bg-white text-[#17824b] text-xs font-bold px-2 py-1 rounded mb-3">START YOUR SERVICE FOR $149!</span>
              <h4 className="text-3xl font-extrabold leading-tight">OUR BIG<br/>SUMMER<br/>SAVINGS</h4>
            </div>
          </div>
        </section>

        {/* Pest Info Section */}
        <section className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row gap-10 items-center">
            <div className="md:w-1/2 w-full h-64 md:h-96 relative rounded-lg overflow-hidden shadow-lg">
               <Image src={pest.heroImage} alt={pest.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-[#071b4d] mb-4">Need a {pest.name.toLowerCase()} exterminator?</h2>
              <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                {pest.description}
              </p>
              <ul className="space-y-3">
                {pest.bullets.map((bullet: string, i: number) => (
                  <li key={i} className="flex items-start">
                    <span className="text-[#17824b] mr-2 text-xl font-bold">✓</span>
                    <span className="text-gray-700">{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Plans Section */}
        <section id="plans" className="bg-white py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#071b4d] mb-4">
                {pest.name}s are one of the {pest.covered.complete} pests covered with a PestIQ pest control plan.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              
              {/* Essential Card */}
              <div className="border border-gray-200 rounded-xl bg-white shadow-sm flex flex-col">
                <div className="bg-gray-100 py-3 text-center rounded-t-xl text-sm font-bold text-gray-600 uppercase tracking-wider">
                  Better Protection
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-2xl font-extrabold text-[#071b4d] mb-4">Essential365 Plan</h3>
                  <ul className="space-y-3 mb-8 flex-grow">
                    <li className="flex items-start"><span className="text-gray-400 mr-2">✓</span> <span className="text-gray-700 text-sm">Interior and exterior pest inspection</span></li>
                    <li className="flex items-start"><span className="text-gray-400 mr-2">✓</span> <span className="text-gray-700 text-sm">Protection from {pest.covered.essential} common household pests</span></li>
                    <li className="flex items-start"><span className="text-gray-400 mr-2">✓</span> <span className="text-gray-700 text-sm">Regularly scheduled pest treatments</span></li>
                    <li className="flex items-start"><span className="text-gray-400 mr-2">✓</span> <span className="text-gray-700 text-sm">PestIQ Guarantee which means if pests come back between treatments, so will we — at no additional cost</span></li>
                  </ul>
                  
                  <div className="mt-auto pt-6 border-t border-gray-100 text-center">
                    {isAddressVerified ? (
                      <div>
                        <div className="text-3xl font-extrabold text-[#17824b]">${prices.essential}</div>
                        <div className="text-xs text-gray-500 mb-4">per month</div>
                        <button 
                          onClick={() => handleAddToCart('essential', 'Essential365 Plan', prices.essential, '149.00', true)}
                          className="w-full bg-[#ffc400] text-black font-bold py-3 rounded-full hover:bg-yellow-400 transition-colors"
                        >
                          Add to Cart
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setIsAddressModalOpen(true)}
                        className="w-full bg-[#ffc400] text-black font-bold py-3 rounded-full hover:bg-yellow-400 transition-colors"
                      >
                        See Pricing
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Complete Card */}
              <div className="border-2 border-[#17824b] rounded-xl bg-white shadow-xl relative flex flex-col z-10 scale-105">
                <div className="bg-[#17824b] py-3 text-center rounded-t-lg text-sm font-bold text-white uppercase tracking-wider shadow-md">
                  Best Protection
                </div>
                <div className="p-8 flex-grow flex flex-col">
                  <h3 className="text-3xl font-extrabold text-[#071b4d] mb-4">PestFree365+ Plan</h3>
                  <ul className="space-y-4 mb-8 flex-grow">
                    <li className="flex items-start"><span className="text-[#17824b] font-bold mr-2">✓</span> <span className="text-gray-700 text-sm font-medium">Interior and exterior pest inspection</span></li>
                    <li className="flex items-start"><span className="text-[#17824b] font-bold mr-2">✓</span> <span className="text-gray-700 text-sm font-medium">Protection from {pest.covered.complete} pests, including 14 pests that may be costly to eliminate</span></li>
                    <li className="flex items-start"><span className="text-[#17824b] font-bold mr-2">✓</span> <span className="text-gray-700 text-sm font-medium">Regularly scheduled pest treatments</span></li>
                    <li className="flex items-start"><span className="text-[#17824b] font-bold mr-2">✓</span> <span className="text-gray-700 text-sm font-medium">PestIQ Guarantee which means if pests come back between treatments, so will we — at no additional cost</span></li>
                    <li className="flex items-start"><span className="text-[#ffc400] text-xl font-bold mr-2">★</span> <span className="text-gray-900 font-bold text-sm">PLUS unlimited protection from seasonal pests</span></li>
                  </ul>
                  
                  <div className="mt-auto pt-6 border-t border-gray-100 text-center">
                    {isAddressVerified ? (
                      <div>
                        <div className="text-4xl font-extrabold text-[#17824b]">${prices.complete}</div>
                        <div className="text-sm text-gray-500 mb-4 font-medium">per month</div>
                        <button 
                          onClick={() => handleAddToCart('complete', 'PestFree365+ Plan', prices.complete, '149.00', true)}
                          className="w-full bg-[#ffc400] text-black text-lg font-bold py-4 rounded-full hover:bg-yellow-400 transition-colors shadow-lg"
                        >
                          Add to Cart
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setIsAddressModalOpen(true)}
                        className="w-full bg-[#ffc400] text-black text-lg font-bold py-4 rounded-full hover:bg-yellow-400 transition-colors shadow-lg"
                      >
                        See Pricing
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* One-time Card */}
              <div className="border border-gray-200 rounded-xl bg-white shadow-sm flex flex-col">
                <div className="bg-gray-100 py-3 text-center rounded-t-xl text-sm font-bold text-gray-600 uppercase tracking-wider">
                  Good Protection
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-2xl font-extrabold text-[#071b4d] mb-4">One-time Pest Plan</h3>
                  <ul className="space-y-3 mb-8 flex-grow">
                    <li className="flex items-start"><span className="text-gray-400 mr-2">✓</span> <span className="text-gray-700 text-sm">Interior and exterior inspection</span></li>
                    <li className="flex items-start"><span className="text-gray-400 mr-2">✓</span> <span className="text-gray-700 text-sm">One pest treatment</span></li>
                    <li className="flex items-start"><span className="text-gray-400 mr-2">✓</span> <span className="text-gray-700 text-sm">PestIQ Guarantee which means if pests come back within 30 days of your treatment, so will we — at no additional cost</span></li>
                  </ul>
                  
                  <div className="mt-auto pt-6 border-t border-gray-100 text-center">
                    {isAddressVerified ? (
                      <div>
                        <div className="text-3xl font-extrabold text-[#17824b]">${prices.onetime}</div>
                        <div className="text-xs text-gray-500 mb-4">one-time payment</div>
                        <button 
                          onClick={() => handleAddToCart('onetime', 'One-time Pest Plan', '0.00', prices.onetime, false)}
                          className="w-full bg-white text-[#071b4d] border-2 border-[#071b4d] font-bold py-3 rounded-full hover:bg-gray-50 transition-colors"
                        >
                          Add to Cart
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setIsAddressModalOpen(true)}
                        className="w-full bg-[#ffc400] text-black font-bold py-3 rounded-full hover:bg-yellow-400 transition-colors"
                      >
                        See Pricing
                      </button>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Treatment Options Section */}
        <section className="bg-slate-50 py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-[#071b4d] mb-10">Your {pest.name.toLowerCase()} treatment options</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pest.tabs.map((tab: string, i: number) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow border border-gray-100 text-left">
                  <h4 className="text-xl font-bold text-[#17824b] mb-2">{tab}</h4>
                  <p className="text-gray-600 text-sm">
                    Targeted application focusing on critical points to stop pest progression. Designed specifically for optimal effectiveness against {pest.name.toLowerCase()}s in residential settings.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
      
      <Footer />
    </div>
  );
}
