"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Mail, MapPin, Send, CheckCircle2 } from "lucide-react";

interface ContactFormProps {
  showForm: boolean;
  showPhone: boolean;
  showEmail: boolean;
  contactPhone: string | null;
  contactEmail: string | null;
  orgName: string;
  orgAddress?: string;
}

export default function ContactForm({
  showForm,
  showPhone,
  showEmail,
  contactPhone,
  contactEmail,
  orgName,
  orgAddress,
}: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: integrate with backend
    setSubmitted(true);
  };

  const hasContactInfo =
    (showPhone && contactPhone) || (showEmail && contactEmail);

  return (
    <section className="py-20 md:py-28 px-4 bg-white">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 tracking-tight mb-3">
            Get in Touch
          </h2>
          <p className="text-zinc-500 text-lg max-w-xl mx-auto">
            Have a question about a property or want to schedule a viewing?
            We&apos;d love to hear from you.
          </p>
        </div>

        <div
          className={`grid gap-12 items-start ${
            hasContactInfo && showForm
              ? "md:grid-cols-2"
              : "max-w-lg mx-auto"
          }`}
        >
          {/* Contact info */}
          {hasContactInfo && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-zinc-900 mb-1">
                  {orgName}
                </h3>
                {orgAddress && (
                  <p className="text-zinc-500 text-sm">{orgAddress}</p>
                )}
              </div>

              <div className="space-y-4">
                {showPhone && contactPhone && (
                  <div className="flex items-center p-4 bg-zinc-50 rounded-xl border border-zinc-100 hover:border-zinc-200 transition-colors">
                    <div className="bg-white p-2.5 rounded-full shadow-sm mr-4 border border-zinc-100">
                      <Phone className="h-4 w-4 text-zinc-700" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                        Phone
                      </p>
                      <a
                        href={`tel:${contactPhone}`}
                        className="text-base font-semibold text-zinc-900 hover:text-zinc-600 transition-colors"
                      >
                        {contactPhone}
                      </a>
                    </div>
                  </div>
                )}

                {showEmail && contactEmail && (
                  <div className="flex items-center p-4 bg-zinc-50 rounded-xl border border-zinc-100 hover:border-zinc-200 transition-colors">
                    <div className="bg-white p-2.5 rounded-full shadow-sm mr-4 border border-zinc-100">
                      <Mail className="h-4 w-4 text-zinc-700" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                        Email
                      </p>
                      <a
                        href={`mailto:${contactEmail}`}
                        className="text-base font-semibold text-zinc-900 hover:text-zinc-600 transition-colors"
                      >
                        {contactEmail}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Contact form */}
          {showForm && (
            <Card className="rounded-2xl border-zinc-200 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Send a Message</CardTitle>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <div className="text-center py-8">
                    <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-zinc-900 mb-2">
                      Message Sent!
                    </h4>
                    <p className="text-zinc-500 text-sm mb-6">
                      We&apos;ll get back to you as soon as possible.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setSubmitted(false)}
                      className="rounded-lg"
                    >
                      Send Another
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="contact-first-name">First Name</Label>
                        <Input
                          id="contact-first-name"
                          placeholder="John"
                          required
                          className="bg-zinc-50/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact-last-name">Last Name</Label>
                        <Input
                          id="contact-last-name"
                          placeholder="Doe"
                          required
                          className="bg-zinc-50/50"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-email">Email Address</Label>
                      <Input
                        id="contact-email"
                        type="email"
                        placeholder="john@example.com"
                        required
                        className="bg-zinc-50/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-phone">Phone (optional)</Label>
                      <Input
                        id="contact-phone"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        className="bg-zinc-50/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-message">Message</Label>
                      <Textarea
                        id="contact-message"
                        placeholder="I'm interested in learning more about..."
                        required
                        className="min-h-[120px] bg-zinc-50/50"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full h-11 text-sm rounded-lg font-semibold"
                    >
                      <Send className="mr-2 h-4 w-4" /> Send Message
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}
