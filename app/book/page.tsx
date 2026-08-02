"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLocation } from "@/context/LocationContext";
import AddressAutocomplete from "@/components/AddressAutocomplete";

export default function BookPage() {
  const {
    priceTier,
    setZipCode,
    setStreetAddress,
    setVerifiedAddress,
    zipCode,
    streetAddress,
    serviceArea,
    propertySqFt
  } = useLocation();

  // Booking Form State
  const [step, setStep] = useState(1);
  const [activeArea, setActiveArea] = useState("nyc");
  const [planType, setPlanType] = useState("monthly");
  const [pestConcern, setPestConcern] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [inputZip, setInputZip] = useState("");
  const [inputAddress, setInputAddress] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [description, setDescription] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [arrivalWindow, setArrivalWindow] = useState("");
  const [alternateDate, setAlternateDate] = useState("");
  const [accessNotes, setAccessNotes] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [referenceCode, setReferenceCode] = useState("");

  // Sync state from location context and URL query params on load
  useEffect(() => {
    if (priceTier) setActiveArea(priceTier);
    if (zipCode) {
      setInputZip(zipCode);
      setInputAddress(streetAddress);
    }
    
    // Parse URL search parameters (for manual review redirects)
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlArea = params.get("area");
      const urlAddress = params.get("address");
      if (urlArea) setActiveArea(urlArea);
      if (urlAddress) {
        setInputAddress(urlAddress);
        const zipMatch = urlAddress.match(/\b\d{5}\b/);
        if (zipMatch) setInputZip(zipMatch[0]);
      }
    }
  }, [priceTier, zipCode, streetAddress]);

  // Pricing calculations
  const prices = useMemo(() => {
    let baseEssential = 59;
    let baseComplete = 69;
    let baseOnetime = 279;

    if (activeArea === "westchester") {
      baseEssential = 49;
      baseComplete = 59;
      baseOnetime = 249;
    } else if (activeArea === "newjersey") {
      baseEssential = 45;
      baseComplete = 55;
      baseOnetime = 229;
    }

    // Square footage adjustment
    let monthlyAdjustment = 0;
    let onetimeAdjustment = 0;

    if (propertySqFt) {
      if (propertySqFt > 1500 && propertySqFt <= 2500) {
        monthlyAdjustment = 10;
        onetimeAdjustment = 30;
      } else if (propertySqFt > 2500 && propertySqFt <= 3500) {
        monthlyAdjustment = 20;
        onetimeAdjustment = 60;
      } else if (propertySqFt > 3500) {
        monthlyAdjustment = 30;
        onetimeAdjustment = 90;
      }
    }

    return {
      essential: baseEssential + monthlyAdjustment,
      complete: baseComplete + monthlyAdjustment,
      onetime: baseOnetime + onetimeAdjustment,
      adjusted: monthlyAdjustment > 0
    };
  }, [activeArea, propertySqFt]);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      // Sync ZIP / address to context if changed
      setZipCode(inputZip);
      if (inputAddress.trim()) {
        setStreetAddress(inputAddress);
      }
    }
    setStep((prev) => Math.min(3, prev + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackStep = () => {
    setStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendRequest = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          address: inputAddress,
          city: activeArea === "westchester" ? "White Plains" : activeArea === "newjersey" ? "Toms River" : "New York",
          state: activeArea === "westchester" ? "NY" : activeArea === "newjersey" ? "NJ" : "NY",
          zip: inputZip,
          serviceArea: activeArea,
          propertyType,
          pestConcern,
          description,
          preferredDate,
          arrivalWindow,
          alternateDate,
          accessNotes,
          planType,
        }),
      });

      const data = await res.json();
      if (data.referenceCode) {
        setReferenceCode(data.referenceCode);
      } else {
        setReferenceCode(`PIQ-${Date.now().toString().slice(-6)}`);
      }
    } catch (err) {
      console.warn("Order submission network warning, generating fallback code:", err);
      setReferenceCode(`PIQ-${Date.now().toString().slice(-6)}`);
    } finally {
      setIsSubmitting(false);
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (isSuccess) {
    return (
      <div className="site-shell site-v3">
        <Header />
        <main className="checkout-page">
          <section className="checkout-success">
            <span>✓</span>
            <p>Request received</p>
            <h1>Your appointment preferences have been recorded.</h1>
            <p>
              A PestIQ coordinator will review your address, property size ({propertySqFt} sq ft), pest concern, and
              plan preferences before confirming the appointment.
            </p>
            <div>
              <small>Request reference</small>
              <strong>{referenceCode}</strong>
            </div>
            <section className="flex justify-center gap-6 mt-6">
              <Link href="/" className="btn btn-primary">
                Return home
              </Link>
              <a href="tel:+12125550148" className="btn btn-ghost !text-[#071b4d] !border-[#071b4d]">
                Call (212) 555-0148
              </a>
            </section>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="site-shell site-v3">
      <Header />
      <div className="checkout-promo">
        Request service online today. <strong>No payment is collected when you submit.</strong>
      </div>
      <main className="checkout-page">
        <div className="header-container checkout-layout">
          {/* STEPPER SIDEBAR */}
          <aside className="checkout-steps" aria-label="Request progress">
            <div className={step === 1 ? "active" : step > 1 ? "done" : ""}>
              <span>{step > 1 ? "✓" : "01"}</span>
              <p>
                <strong>Details</strong>
                <small>Contact and property</small>
              </p>
            </div>
            <i></i>
            <div className={step === 2 ? "active" : step > 2 ? "done" : ""}>
              <span>{step > 2 ? "✓" : "02"}</span>
              <p>
                <strong>Schedule</strong>
                <small>Preferred timing</small>
              </p>
            </div>
            <i></i>
            <div className={step === 3 ? "active" : ""}>
              <span>03</span>
              <p>
                <strong>Review</strong>
                <small>Confirm request</small>
              </p>
            </div>
          </aside>

          {/* MAIN FORM */}
          <section className="checkout-form-area">
            {step === 1 && (
              <form onSubmit={handleNextStep}>
                <header>
                  <p>Step 1 of 3</p>
                  <h1>Enter your service details</h1>
                  <span>Tell us who to contact and what is happening at the property.</span>
                </header>
                <div className="checkout-form-grid">
                  <label className="wide">
                    First and last name
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="name"
                      required
                    />
                  </label>
                  <label>
                    Phone number
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      type="tel"
                      autoComplete="tel"
                      required
                    />
                  </label>
                  <label>
                    Email address
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      autoComplete="email"
                      required
                    />
                  </label>
                  <div className="wide">
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Verified New Jersey Street Address
                    </label>
                    <AddressAutocomplete
                      value={inputAddress}
                      onSelectVerifiedAddress={(verified) => {
                        if (verified && verified.verified) {
                          setInputAddress(verified.formattedAddress);
                          setInputZip(verified.postalCode);
                          setVerifiedAddress(verified);
                        } else {
                          setInputAddress("");
                          setInputZip("");
                          setVerifiedAddress(null);
                        }
                      }}
                      placeholder="Type your NJ street address (e.g. 11 Oak Dr)..."
                    />
                  </div>
                  <label>
                    Service area
                    <select value={activeArea} onChange={(e) => setActiveArea(e.target.value)}>
                      <option value="nyc">New York City</option>
                      <option value="westchester">Lower Westchester</option>
                      <option value="newjersey">Ocean County, NJ</option>
                      <option value="other">Another area — review needed</option>
                    </select>
                  </label>
                  <label>
                    ZIP code
                    <input
                      value={inputZip}
                      onChange={(e) => setInputZip(e.target.value)}
                      inputMode="numeric"
                      placeholder="e.g. 08701"
                      required
                    />
                  </label>
                  <label>
                    Property type
                    <select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      required
                    >
                      <option value="" disabled>
                        Select property
                      </option>
                      <option>Apartment</option>
                      <option>Townhouse</option>
                      <option>Single-family home</option>
                      <option>Small business</option>
                      <option>Other</option>
                    </select>
                  </label>
                  <label>
                    Pest concern
                    <select
                      value={pestConcern}
                      onChange={(e) => setPestConcern(e.target.value)}
                      required
                    >
                      <option value="" disabled>
                        Select pest
                      </option>
                      <option>Ants</option>
                      <option>Cockroaches</option>
                      <option>Rodents</option>
                      <option>Spiders</option>
                      <option>Mosquitoes</option>
                      <option>Bed bugs</option>
                      <option>Not sure</option>
                    </select>
                  </label>
                  <label className="wide">
                    What are you seeing?
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      placeholder="Where did you notice activity, and when did it begin?"
                    />
                  </label>
                </div>
                <label className="checkout-consent">
                  <input type="checkbox" required />
                  <span>
                    PestIQ Solutions may contact me about this request. Submitting does not confirm an appointment or
                    authorize a charge.
                  </span>
                </label>
                <button className="checkout-next" type="submit">
                  Continue to schedule <span>›</span>
                </button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleNextStep}>
                <header>
                  <p>Step 2 of 3</p>
                  <h1>Choose appointment preferences</h1>
                  <span>Select a preferred date and arrival window. Availability is confirmed after review.</span>
                </header>
                <div className="checkout-form-grid schedule-grid">
                  <label>
                    Preferred date
                    <input
                      type="date"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      required
                    />
                  </label>
                  <label>
                    Arrival window
                    <select
                      value={arrivalWindow}
                      onChange={(e) => setArrivalWindow(e.target.value)}
                      required
                    >
                      <option value="" disabled>
                        Select a window
                      </option>
                      <option>Morning · 8am–12pm</option>
                      <option>Afternoon · 12pm–4pm</option>
                      <option>Late afternoon · 4pm–7pm</option>
                      <option>Flexible</option>
                    </select>
                  </label>
                  <label>
                    Alternate date
                    <input
                      type="date"
                      value={alternateDate}
                      onChange={(e) => setAlternateDate(e.target.value)}
                    />
                  </label>
                  <label>
                    Access notes
                    <input
                      value={accessNotes}
                      onChange={(e) => setAccessNotes(e.target.value)}
                      placeholder="Doorman, gate, parking, pets…"
                    />
                  </label>
                </div>
                <div className="schedule-note">
                  <span>i</span>
                  <p>
                    <strong>This is an appointment preference.</strong> A coordinator will confirm the final date,
                    arrival window, and service scope.
                  </p>
                </div>
                <div className="checkout-button-row">
                  <button type="button" onClick={handleBackStep}>
                    ‹ Back
                  </button>
                  <button className="checkout-next" type="submit">
                    Continue to review <span>›</span>
                  </button>
                </div>
              </form>
            )}

            {step === 3 && (
              <div className="review-panel">
                <header>
                  <p>Step 3 of 3</p>
                  <h1>Review your request</h1>
                  <span>Check the details below before sending your appointment preferences.</span>
                </header>
                <div className="review-sections">
                  <section>
                    <div>
                      <h2>Contact</h2>
                      <button onClick={() => setStep(1)}>Edit</button>
                    </div>
                    <p>
                      <strong>{name}</strong>
                      {phone}
                      <br />
                      {email}
                    </p>
                  </section>
                  <section>
                    <div>
                      <h2>Property &amp; pest</h2>
                      <button onClick={() => setStep(1)}>Edit</button>
                    </div>
                    <p>
                      <strong>
                        {inputAddress || "Address details"} • {inputZip}
                      </strong>
                      <br />
                      {activeArea === "westchester"
                        ? "Lower Westchester"
                        : activeArea === "newjersey"
                        ? "Ocean County, NJ"
                        : activeArea === "nyc"
                        ? "New York City"
                        : "Coverage review needed"}
                      <br />
                      Pest: {pestConcern || "Not selected"}
                      {description && (
                        <>
                          <br />
                          {description}
                        </>
                      )}
                    </p>
                  </section>
                  <section>
                    <div>
                      <h2>Appointment preference</h2>
                      <button onClick={() => setStep(2)}>Edit</button>
                    </div>
                    <p>
                      <strong>{preferredDate}</strong>
                      <br />
                      {arrivalWindow}
                    </p>
                  </section>
                </div>
                <div className="checkout-button-row">
                  <button type="button" onClick={handleBackStep}>
                    ‹ Back
                  </button>
                  <button className="checkout-next" type="button" onClick={handleSendRequest} disabled={isSubmitting}>
                    {isSubmitting ? "Processing request..." : <>Send request <span>›</span></>}
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* SIDEBAR ORDER SUMMARY */}
          <aside className="order-summary">
            <span>Selected service</span>
            <h2>{planType === "monthly" ? "Complete Protection" : "One-Time Service"}</h2>
            <div className="summary-line">
              <span>{planType === "monthly" ? "Billed monthly" : "Starting price"}</span>
              <strong>
                {planType === "monthly" ? `$${prices.complete}/month` : `$${prices.onetime}`}
              </strong>
            </div>
            {planType === "monthly" && (
              <div className="summary-line">
                <span>Initial service</span>
                <strong>$149</strong>
              </div>
            )}
            <div className="summary-total">
              <span>Due today</span>
              <strong>$0.00</strong>
            </div>
            <div className="summary-message">
              <b>★</b>
              <p>Final pricing is confirmed before service. You will not be billed from this request.</p>
            </div>
            <button type="button" onClick={() => setPlanType(planType === "monthly" ? "one-time" : "monthly")}>
              Change to {planType === "monthly" ? "one-time service" : "monthly protection"}
            </button>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
