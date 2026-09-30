'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';

// ============================================================================
// 1. एडमिन पैनल द्वारा प्रबंधित होने वाला केंद्रीय डेटा स्कीमा (Default Fallback)
// जब एडमिन फायरबेस से इसे अपडेट करेगा, तो यह स्वचालित रूप से रेंडर होगा।
// ============================================================================
export interface EventConfigSchema {
  eventMode: 'PRE_EVENT' | 'EVENT_DAY' | 'POST_EVENT';
  eventTitle: string;
  tagline: string;
  targetDateTime: string; // ISO 8601
  dateString: string;
  dayTimeString: string;
  city: string;
  heroImageUrl: string;
  guruMaharaj: {
    name: string;
    wording: string;
    imageUrl: string;
  };
  venue: {
    name: string;
    address: string;
    mapsUrl: string;
  };
  timeline: Array<{
    time: string;
    title: string;
    description: string;
  }>;
  instructions: Array<{
    id: number;
    text: string;
    active: boolean;
  }>;
  youtube: {
    channelUrl: string;
    featuredVideoUrl: string;
    featuredTitle: string;
    thumbnailUrl: string;
  };
  gallery: Array<{
    id: number;
    title: string;
    imageUrl: string;
  }>;
  shareTemplate: string;
}

const DEFAULT_EVENT_DATA: EventConfigSchema = {
  eventMode: 'PRE_EVENT',
  eventTitle: 'श्री हरिनाम दीक्षा समारोह',
  tagline: 'हरिनाम ही जीवन का सार है',
  targetDateTime: '2026-10-03T04:30:00+05:30',
  dateString: '03 अक्टूबर 2026',
  dayTimeString: 'शनिवार • प्रातः 04:30 बजे',
  city: 'पुणे',
  heroImageUrl: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?q=80&w=1600&auto=format&fit=crop',
  guruMaharaj: {
    name: 'श्री लोकनाथ स्वामी महाराज',
    wording: 'के करकमलों से पावन दीक्षा समारोह',
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop'
  },
  venue: {
    name: 'श्री राधा कुंजबिहारी मंदिर',
    address: 'तारापोर रोड, दस्तूर बॉयज स्कूल के पास, कैंप, पुणे',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=ISKCON+Pune+Camp+Sri+Radha+Kunjbihari+Mandir'
  },
  timeline: [
    { time: '04:30 AM', title: 'मंगल आरती', description: 'मंगल आरती हेतु सभी दीक्षार्थी भक्त समय पर उपस्थित रहें।' },
    { time: 'आरती के बाद', title: 'आवश्यक सूचनाएँ', description: 'दीक्षा समारोह से संबंधित आवश्यक दिशा-निर्देश दिए जाएँगे।' },
    { time: 'जप सत्र', title: '16 माला जप पूर्ण करें', description: 'दीक्षा संस्कार आरंभ होने से पूर्व अपनी 16 माला जप पूर्ण करें।' },
    { time: '07:00 AM', title: 'दीक्षा किट वितरण', description: 'आवंटित कूपन अथवा टोकन दिखाकर अपनी सामग्री प्राप्त करें।' }
  ],
  instructions: [
    { id: 1, text: 'सभी दीक्षार्थी भक्त समय का विशेष ध्यान रखें।', active: true },
    { id: 2, text: 'दीक्षा से पहले अपनी 16 माला जप पूरी करें।', active: true },
    { id: 3, text: 'सभी दीक्षार्थी भक्त वैष्णव वेश परिधान करें।', active: true },
    { id: 4, text: 'प्रभुजी के लिए शिर मुंडन अनिवार्य है और शिखा रखनी है।', active: true },
    { id: 5, text: 'दीक्षार्थी भक्त इस पावन दिवस पर उपवास रखें।', active: true },
    { id: 6, text: 'बेल्ट / टोकन नंबर के अनुसार स्थान ग्रहण करें।', active: true },
    { id: 7, text: 'समारोह प्रांगण में शांति और शुचिता बनाए रखें।', active: true },
    { id: 8, text: 'सभी आयोजकीय सूचनाओं एवं स्वयंसेवकों के निर्देशों का पालन करें।', active: true }
  ],
  youtube: {
    channelUrl: 'https://youtube.com',
    featuredVideoUrl: 'https://www.youtube.com',
    featuredTitle: 'राधे राधे भजन एवं पावन हरिनाम संकीर्तन',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop'
  },
  gallery: [
    { id: 1, title: 'मंदिर प्रांगण', imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=600&auto=format&fit=crop' },
    { id: 2, title: 'भक्ति साधना', imageUrl: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?q=80&w=600&auto=format&fit=crop' },
    { id: 3, title: 'संकीर्तन दर्शन', imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop' }
  ],
  shareTemplate: `हरे कृष्ण! 🙏\n\nआपको *{{eventTitle}}* के इस पावन अवसर पर सादर आमंत्रित किया जाता है।\n\n📅 दिनांक: {{date}}\n🕓 समय: {{time}}\n📍 स्थान: {{venue}}\n\n🪷 आपका व्यक्तिगत निमंत्रण दर्शन लिंक:\n{{invitationLink}}`
};

const CHECKLIST_ITEMS = [
  'मैंने 16 माला पूरी करने की तैयारी कर ली है',
  'मैं वैष्णव वेश में उपस्थित रहूँगा / रहूँगी',
  'मैंने सभी आवश्यक निर्देश पढ़ लिए हैं',
  'मैं समय (04:30 AM) पर उपस्थित रहूँगा / रहूँगी',
  'मैंने कार्यक्रम स्थल सुरक्षित कर लिया है'
];

export default function UserDikshaPage() {
  // ---------------- UI & Lifecycle States ----------------
  const [isBooting, setIsBooting] = useState<boolean>(true);
  const [eventData] = useState<EventConfigSchema>(DEFAULT_EVENT_DATA);
  const [participantName, setParticipantName] = useState<string>('प्रिय दीक्षार्थी भक्त जी');
  const [isPersonalized, setIsPersonalized] = useState<boolean>(false);
  const [invitationToken, setInvitationToken] = useState<string>('');
  const [isActiveInvitation, setIsActiveInvitation] = useState<boolean>(true);
  const [copiedToast, setCopiedToast] = useState<boolean>(false);

  // Interactive Checklist State
  const [checkedItems, setCheckedItems] = useState<number[]>([]);

  // Referral Invite Form
  const [referralName, setReferralName] = useState<string>('');
  const [referralWhatsApp, setReferralWhatsApp] = useState<string>('');

  // Countdown State
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false
  });

  // ---------------- SCREEN 00 / 02: Initial Resolution & Security ----------------
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const nameQuery = params.get('name');
        const tokenQuery = params.get('token') || params.get('id');
        const statusQuery = params.get('status');

        // एडमिन द्वारा निष्क्रिय स्थिति की जाँच (Screen 12 of Admin)
        if (statusQuery === 'inactive') {
          setIsActiveInvitation(false);
        }

        if (nameQuery && nameQuery.trim().length > 0) {
          setParticipantName(`प्रिय ${nameQuery.trim()} जी`);
          setIsPersonalized(true);
        }

        if (tokenQuery) {
          setInvitationToken(tokenQuery.trim());
        } else {
          setInvitationToken(`DK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`);
        }

        // लोकल स्टोरेज से चेकलिस्ट पुनः प्राप्त करें
        const cachedChecklist = localStorage.getItem('diksha_user_checklist');
        if (cachedChecklist) {
          setCheckedItems(JSON.parse(cachedChecklist));
        }
      }
    } catch {
      // फॉलबैक
    } finally {
      // स्मूथ व तात्कालिक बूट (कोई बनावटी डिले नहीं)
      const bootTimer = setTimeout(() => setIsBooting(false), 200);
      return () => clearTimeout(bootTimer);
    }
  }, []);

  // ---------------- SCREEN 05: Dynamic Countdown ----------------
  useEffect(() => {
    const targetMs = new Date(eventData.targetDateTime).getTime();

    const updateTimer = () => {
      const nowMs = new Date().getTime();
      const diff = targetMs - nowMs;

      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
        isExpired: false
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [eventData.targetDateTime]);

  // ---------------- Interactive Checklist Handler ----------------
  const toggleChecklist = useCallback((index: number) => {
    setCheckedItems((prev) => {
      const updated = prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index];
      localStorage.setItem('diksha_user_checklist', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // ---------------- Scroll Helper ----------------
  const smoothScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // ---------------- Share Utilities (Screens 11, 12, 18) ----------------
  const currentPublicUrl = typeof window !== 'undefined' ? window.location.href : '';

  const generateShareMessage = useCallback((customRecipient?: string) => {
    let msg = eventData.shareTemplate;
    const recipient = customRecipient ? customRecipient : (isPersonalized ? participantName.replace('प्रिय ', '').replace(' जी', '') : 'भक्त');
    msg = msg.replace('{{name}}', recipient);
    msg = msg.replace('{{eventTitle}}', eventData.eventTitle);
    msg = msg.replace('{{date}}', eventData.dateString);
    msg = msg.replace('{{time}}', eventData.dayTimeString);
    msg = msg.replace('{{venue}}', `${eventData.venue.name}, ${eventData.city}`);
    msg = msg.replace('{{invitationLink}}', currentPublicUrl);
    return msg;
  }, [eventData, isPersonalized, participantName, currentPublicUrl]);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(currentPublicUrl);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: eventData.eventTitle,
          text: `हरे कृष्ण! ${eventData.eventTitle} का पावन निमंत्रण:`,
          url: currentPublicUrl
        });
      } catch {
        // Dismissed
      }
    } else {
      handleCopyLink();
    }
  };

  const handleWhatsAppSend = (phoneNumber?: string, customText?: string) => {
    const message = customText || generateShareMessage();
    const cleanPhone = phoneNumber ? phoneNumber.replace(/[^0-9]/g, '') : '';
    const url = cleanPhone
      ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleReferralSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!referralName.trim()) return;
    const customMsg = `हरे कृष्ण ${referralName.trim()} जी! 🙏\n\nआपको *${eventData.eventTitle}* का पावन निमंत्रण भेजा जा रहा है:\n${currentPublicUrl}`;
    handleWhatsAppSend(referralWhatsApp, customMsg);
    setReferralName('');
    setReferralWhatsApp('');
  };

  const downloadICSFile = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Diksha//Devotional Invitation//HI
BEGIN:VEVENT
UID:${Date.now()}@dikshaplat
DTSTAMP:20261001T000000Z
DTSTART:20261002T230000Z
DTEND:20261003T070000Z
SUMMARY:${eventData.eventTitle}
DESCRIPTION:${eventData.tagline} - ${eventData.guruMaharaj.name}
LOCATION:${eventData.venue.name}, ${eventData.venue.address}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'harinam-diksha.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ============================================================================
  // SCREEN 00: INITIAL BOOT (शून्य भारी एनिमेशन, केवल शांत आध्यात्मिक आभा)
  // ============================================================================
  if (isBooting) {
    return (
      <div className="fixed inset-0 bg-[#080705] flex flex-col items-center justify-center text-amber-100 z-50">
        <span className="text-4xl animate-pulse">🪷</span>
        <h2 className="mt-3 text-lg font-serif tracking-widest text-[#E6CA65]">हरे कृष्ण</h2>
      </div>
    );
  }

  // ============================================================================
  // DEACTIVATED STATE (Screen 12 of Admin: यदि एडमिन ने निमंत्रण निष्क्रय किया हो)
  // ============================================================================
  if (!isActiveInvitation) {
    return (
      <div className="min-h-screen bg-[#0A0908] flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full p-8 rounded-2xl bg-[#14100B] border border-amber-500/30 space-y-4">
          <div className="text-3xl">🪷</div>
          <h2 className="text-xl font-serif font-bold text-[#F3E5AB]">हरे कृष्ण</h2>
          <p className="text-sm text-amber-200/80 leading-relaxed">
            यह निमंत्रण वर्तमान में सक्रिय नहीं है। अधिक जानकारी हेतु कृपया आयोजन समिति से संपर्क करें।
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090807] text-amber-50 selection:bg-amber-900 selection:text-white font-sans antialiased pb-24 md:pb-12">
      
      {/* Toast Notification */}
      {copiedToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#1C160E] border border-[#E6CA65]/70 text-[#F5E8C7] px-6 py-2.5 rounded-full shadow-2xl text-xs sm:text-sm font-medium flex items-center gap-2">
          <span>✓</span> निमंत्रण लिंक कॉपी हो गया
        </div>
      )}

      {/* ============================================================================
          SCREEN 01: CINEMATIC HERO / INVITATION COVER (100svh)
          ============================================================================ */}
      <section 
        className="relative h-[100svh] w-full flex flex-col items-center justify-between p-6 text-center overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url('${eventData.heroImageUrl}')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/65 to-[#090807]" />

        {/* Top Header */}
        <header className="relative z-10 pt-6">
          <p className="text-xs sm:text-sm font-medium tracking-[0.3em] text-[#E6CA65] uppercase flex items-center justify-center gap-2">
            <span>🪷</span> HARE KRISHNA <span>🪷</span>
          </p>
        </header>

        {/* Center Devotional Block */}
        <div className="relative z-10 max-w-xl mx-auto space-y-4 my-auto">
          <p className="text-xs sm:text-sm font-light tracking-widest text-amber-200/90 uppercase">
            परम पावन गुरु महाराज के सानिध्य में
          </p>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#FFF5D6] via-[#E6CA65] to-[#B89230] drop-shadow-lg leading-tight">
            {eventData.eventTitle}
          </h1>
          <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-[#E6CA65] to-transparent mx-auto my-3" />
          <p className="text-lg sm:text-xl font-medium text-amber-100">
            {eventData.dateString}
          </p>
          <p className="text-xs sm:text-sm text-amber-300/80 font-light">
            {eventData.dayTimeString} • {eventData.city}
          </p>
          <blockquote className="pt-2 text-xs italic text-amber-200/70 font-serif">
            &ldquo;{eventData.tagline}&rdquo;
          </blockquote>
        </div>

        {/* Primary CTA */}
        <div className="relative z-10 pb-8 space-y-3 w-full max-w-xs">
          <button 
            onClick={() => smoothScrollTo('welcome-section')}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#B8860B] text-black font-semibold text-sm shadow-[0_0_25px_rgba(212,175,55,0.35)] hover:shadow-[0_0_35px_rgba(212,175,55,0.55)] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span>🪷</span> पावन निमंत्रण खोलें
          </button>
          <button 
            onClick={() => smoothScrollTo('welcome-section')} 
            className="text-xs text-amber-300/70 hover:text-amber-200 tracking-wider transition-colors"
          >
            ↓ आगे देखें
          </button>
        </div>
      </section>

      {/* Main Content Spine */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 space-y-16 mt-8">

        {/* ============================================================================
            SCREEN 02: PERSONALIZED WELCOME
            ============================================================================ */}
        <section id="welcome-section" className="pt-8 text-center scroll-mt-6">
          <div className="p-8 rounded-2xl bg-gradient-to-b from-[#18140E] to-[#100D09] border border-[#D4AF37]/30 shadow-2xl relative overflow-hidden">
            <div className="text-3xl mb-3">🪷</div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#F3E5AB]">
              {participantName}
            </h2>
            <p className="mt-4 text-base sm:text-lg text-amber-100/90 leading-relaxed font-light">
              आपको श्री हरिनाम दीक्षा समारोह के इस पावन अवसर पर सपरिवार सादर आमंत्रित किया जाता है।
            </p>
            <div className="mt-6 pt-4 border-t border-amber-500/20 text-xs text-amber-300/70 font-light">
              यह पावन निमंत्रण आपके लिए विशेष रूप से तैयार किया गया है।
            </div>
          </div>
        </section>

        {/* ============================================================================
            SCREEN 03: GURU MAHARAJ / BLESSINGS
            ============================================================================ */}
        <section className="text-center space-y-4">
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 mx-auto rounded-full p-1 bg-gradient-to-tr from-[#D4AF37] via-amber-200 to-[#8C6D1F] shadow-[0_0_30px_rgba(212,175,55,0.25)]">
            <img 
              src={eventData.guruMaharaj.imageUrl} 
              alt={eventData.guruMaharaj.name} 
              loading="lazy" 
              className="w-full h-full object-cover rounded-full filter contrast-[1.03]" 
            />
          </div>
          <div className="pt-2">
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#F5E8C7]">
              {eventData.guruMaharaj.name}
            </h3>
            <p className="text-sm text-[#D4AF37] font-medium tracking-wide mt-1">
              {eventData.guruMaharaj.wording}
            </p>
          </div>
        </section>

        {/* ============================================================================
            SCREEN 04: EVENT INTRODUCTION
            ============================================================================ */}
        <section className="space-y-6 text-center">
          <div className="space-y-2">
            <h3 className="text-lg font-serif font-semibold text-[#E6CA65] flex items-center justify-center gap-2">
              <span>🪷</span> पावन दीक्षा समारोह
            </h3>
            <p className="text-xs sm:text-sm text-amber-200/80 max-w-md mx-auto leading-relaxed">
              यह दिन हर दीक्षार्थी भक्त की आध्यात्मिक यात्रा में एक विशेष एवं स्मरणीय अवसर है।
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-[#14110C] border border-[#D4AF37]/20 flex flex-col items-center justify-center text-center">
              <span className="text-xl mb-1">📅</span>
              <span className="text-xs font-semibold text-amber-100">{eventData.dateString}</span>
              <span className="text-[10px] text-amber-400/70">शनिवार</span>
            </div>
            <div className="p-4 rounded-xl bg-[#14110C] border border-[#D4AF37]/20 flex flex-col items-center justify-center text-center">
              <span className="text-xl mb-1">🕓</span>
              <span className="text-xs font-semibold text-amber-100">04:30 AM</span>
              <span className="text-[10px] text-amber-400/70">प्रातः काल</span>
            </div>
            <div className="p-4 rounded-xl bg-[#14110C] border border-[#D4AF37]/20 flex flex-col items-center justify-center text-center">
              <span className="text-xl mb-1">📍</span>
              <span className="text-xs font-semibold text-amber-100">{eventData.city}</span>
              <span className="text-[10px] text-amber-400/70">मंदिर प्रांगण</span>
            </div>
          </div>
        </section>

        {/* ============================================================================
            SCREEN 05: LIVE COUNTDOWN / EVENT MODE
            ============================================================================ */}
        <section className="p-6 rounded-2xl bg-gradient-to-r from-[#17130D] via-[#1C160E] to-[#17130D] border border-[#D4AF37]/30 text-center space-y-4">
          <h4 className="text-xs sm:text-sm font-serif font-medium tracking-widest text-[#E6CA65] uppercase">
            {eventData.eventMode === 'POST_EVENT' 
              ? 'दीक्षा समारोह सम्पन्न' 
              : eventData.eventMode === 'EVENT_DAY' || countdown.isExpired 
                ? 'पावन दीक्षा दिवस' 
                : 'दीक्षा समारोह में शेष समय'}
          </h4>

          {eventData.eventMode === 'EVENT_DAY' || countdown.isExpired ? (
            <div className="py-4 text-lg font-serif font-bold text-[#E6CA65] animate-pulse">
              🪷 आज है आपका पावन दीक्षा दिवस
            </div>
          ) : eventData.eventMode === 'POST_EVENT' ? (
            <div className="py-4 text-base font-serif text-amber-200">
              दीक्षा समारोह पूर्ण हो चुका है। सभी भक्तों को बधाई एवं शुभकामनाएँ!
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-sm mx-auto">
              {[
                { label: 'दिन', val: countdown.days },
                { label: 'घंटे', val: countdown.hours },
                { label: 'मिनट', val: countdown.minutes },
                { label: 'सेकंड', val: countdown.seconds }
              ].map((item, idx) => (
                <div key={idx} className="bg-[#0C0A07] border border-amber-500/20 rounded-xl p-2.5 sm:p-3">
                  <div className="text-xl sm:text-2xl font-bold font-mono text-[#F7E7B4]">
                    {String(item.val).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] sm:text-xs text-amber-400/70 mt-0.5">{item.label}</div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ============================================================================
            SCREEN 06: PROGRAM TIMELINE
            ============================================================================ */}
        <section className="space-y-6">
          <h3 className="text-xl font-serif font-bold text-[#E6CA65] text-center flex items-center justify-center gap-2">
            <span>📜</span> कार्यक्रम एवं समय-सारिणी
          </h3>

          <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-[#D4AF37] before:via-[#8C6D1F] before:to-transparent">
            {eventData.timeline.map((item, idx) => (
              <div key={idx} className="relative pl-4 group">
                <span className="absolute -left-[21px] top-1 w-3.5 h-3.5 rounded-full bg-[#1A150D] border-2 border-[#D4AF37] group-hover:scale-110 transition-transform" />
                <div className="text-xs font-bold text-[#D4AF37] tracking-wider uppercase">{item.time}</div>
                <div className="text-base font-semibold text-amber-50 mt-0.5">{item.title}</div>
                <p className="text-xs text-amber-200/70 mt-1 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================================
            SCREEN 07: IMPORTANT INSTRUCTIONS
            ============================================================================ */}
        <section className="space-y-6">
          <h3 className="text-xl font-serif font-bold text-[#E6CA65] text-center flex items-center justify-center gap-2">
            <span>🙏</span> महत्वपूर्ण निर्देश
          </h3>

          <div className="grid gap-2.5">
            {eventData.instructions.filter(i => i.active).map((inst, index) => (
              <div key={inst.id} className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[#13100B] border border-amber-500/15">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono flex items-center justify-center font-bold">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <p className="text-xs sm:text-sm text-amber-100/90 leading-snug pt-0.5">{inst.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================================
            SCREEN 08: "MY PREPARATION" CHECKLIST
            ============================================================================ */}
        <section className="p-6 rounded-2xl bg-gradient-to-b from-[#18130B] to-[#100D08] border border-[#D4AF37]/30 space-y-5">
          <div className="text-center space-y-1">
            <h3 className="text-lg font-serif font-bold text-[#F3E5AB]">🪷 मेरी तैयारी</h3>
            <p className="text-xs text-amber-300/70">दीक्षा से पूर्व अपनी तैयारी की पुष्टि करें</p>
          </div>

          <div className="space-y-2.5">
            {CHECKLIST_ITEMS.map((question, qIdx) => {
              const isChecked = checkedItems.includes(qIdx);
              return (
                <button
                  key={qIdx}
                  type="button"
                  onClick={() => toggleChecklist(qIdx)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                    isChecked 
                      ? 'bg-amber-900/25 border-[#D4AF37]/60 text-amber-100' 
                      : 'bg-[#0E0C09] border-amber-500/20 text-amber-300/70 hover:border-amber-500/40'
                  }`}
                >
                  <span className={`w-5 h-5 rounded flex items-center justify-center text-xs font-bold transition-colors ${
                    isChecked ? 'bg-[#D4AF37] text-black' : 'border border-amber-400/40'
                  }`}>
                    {isChecked ? '✓' : ''}
                  </span>
                  <span className="text-xs sm:text-sm font-medium">{question}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 text-center space-y-3">
            <p className="text-xs font-mono text-amber-400/80">
              {checkedItems.length} / {CHECKLIST_ITEMS.length} तैयारियाँ पूर्ण
            </p>
            {checkedItems.length === CHECKLIST_ITEMS.length && (
              <div className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 border border-emerald-500/40 text-emerald-200 text-xs sm:text-sm font-semibold tracking-wide flex items-center justify-center gap-2">
                <span>🪷</span> मैं दीक्षा के लिए तैयार हूँ
              </div>
            )}
          </div>
        </section>

        {/* ============================================================================
            SCREEN 09: VENUE / LOCATION
            ============================================================================ */}
        <section className="space-y-4">
          <h3 className="text-xl font-serif font-bold text-[#E6CA65] text-center flex items-center justify-center gap-2">
            <span>📍</span> समारोह स्थल
          </h3>

          <div className="rounded-2xl overflow-hidden bg-[#14100B] border border-[#D4AF37]/30 shadow-xl">
            <div className="p-6 text-center space-y-2">
              <h4 className="text-lg font-serif font-bold text-[#F5E8C7]">{eventData.venue.name}</h4>
              <p className="text-xs sm:text-sm text-amber-200/80 max-w-sm mx-auto leading-relaxed">
                {eventData.venue.address}
              </p>
            </div>

            <div className="p-4 bg-[#0E0C08] border-t border-amber-500/20 grid grid-cols-2 gap-3">
              <a
                href={eventData.venue.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-4 rounded-xl bg-[#D4AF37] text-black font-semibold text-xs text-center flex items-center justify-center gap-1.5 shadow-md hover:bg-[#E6CA65]"
              >
                <span>📍</span> रास्ता दिखाएँ
              </a>
              <button
                type="button"
                onClick={downloadICSFile}
                className="py-2.5 px-4 rounded-xl bg-[#1C160E] border border-amber-500/30 text-amber-200 font-semibold text-xs text-center flex items-center justify-center gap-1.5 hover:bg-[#2A2115]"
              >
                <span>📅</span> Calendar में जोड़ें
              </button>
            </div>
          </div>
        </section>

        {/* ============================================================================
            SCREEN 10: DIGITAL DIKSHA PASS
            ============================================================================ */}
        <section className="space-y-4">
          <div className="relative max-w-sm mx-auto rounded-3xl p-6 bg-gradient-to-b from-[#231A0F] via-[#14100B] to-[#0A0805] border-2 border-[#D4AF37] shadow-[0_0_35px_rgba(212,175,55,0.2)] text-center space-y-4">
            
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
              <span className="text-xs text-[#E6CA65] font-serif tracking-widest">🪷 DIKSHA PASS</span>
              <span className="text-[10px] font-mono text-amber-400/80 uppercase tracking-widest">{invitationToken}</span>
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-serif font-bold text-[#FFF4D0]">{eventData.eventTitle}</h4>
              <p className="text-xs text-amber-300/80">{eventData.dateString} • {eventData.city}</p>
            </div>

            <div className="py-2 px-4 rounded-lg bg-black/40 border border-amber-500/20">
              <div className="text-[10px] uppercase tracking-wider text-amber-400/60 font-mono">Participant Name</div>
              <div className="text-base font-bold text-[#F3E5AB]">
                {participantName.replace('प्रिय ', '').replace(' जी', '')}
              </div>
            </div>

            {/* Inlined Client-Side QR Matrix Vector */}
            <div className="bg-white p-3 rounded-2xl w-36 h-36 mx-auto flex items-center justify-center shadow-inner">
              <svg className="w-full h-full text-black" viewBox="0 0 100 100" fill="currentColor">
                <path d="M10 10h30v30h-30z M15 15v20h20v-20z M22 22h6v6h-6z" />
                <path d="M60 10h30v30h-30z M65 15v20h20v-20z M72 22h6v6h-6z" />
                <path d="M10 60h30v30h-30z M15 65v20h20v-20z M22 72h6v6h-6z" />
                <path d="M45 15h10v10h-10z M45 35h10v10h-10z M45 55h10v10h-10z M45 75h10v10h-10z" />
                <path d="M60 60h10v10h-10z M80 60h10v10h-10z M70 70h10v10h-10z M60 80h10v10h-10z M80 80h10v10h-10z" />
              </svg>
            </div>

            <p className="text-[10px] text-amber-300/60">
              यह QR आपके व्यक्तिगत निमंत्रण से संबंधित है।
            </p>

            <div className="pt-2 grid grid-cols-2 gap-2">
              <button 
                type="button"
                onClick={() => window.print()}
                className="py-2 px-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs font-semibold hover:bg-amber-500/30"
              >
                ↓ Pass सेव करें
              </button>
              <button 
                type="button"
                onClick={handleNativeShare}
                className="py-2 px-3 rounded-xl bg-[#D4AF37] text-black text-xs font-semibold hover:bg-[#E6CA65]"
              >
                ↗ शेयर करें
              </button>
            </div>
          </div>
        </section>

        {/* ============================================================================
            SCREEN 11: PERSONAL INVITATION SHARING
            ============================================================================ */}
        <section className="p-6 rounded-2xl bg-[#14100B] border border-amber-500/20 text-center space-y-4">
          <h3 className="text-lg font-serif font-bold text-[#E6CA65]">🪷 निमंत्रण शेयर करें</h3>
          <p className="text-xs text-amber-200/80">इस पावन निमंत्रण को अपने प्रिय भक्त मित्रों तक पहुँचाएँ।</p>

          <div className="grid gap-2 max-w-sm mx-auto">
            <button
              type="button"
              onClick={() => handleWhatsAppSend()}
              className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2"
            >
              <span>💬</span> WhatsApp पर शेयर करें
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className="py-2.5 px-3 rounded-xl bg-[#1D170F] border border-amber-500/30 text-amber-200 text-xs font-medium hover:bg-[#282015]"
              >
                🔗 लिंक कॉपी करें
              </button>
              <button
                type="button"
                onClick={handleNativeShare}
                className="py-2.5 px-3 rounded-xl bg-[#1D170F] border border-amber-500/30 text-amber-200 text-xs font-medium hover:bg-[#282015]"
              >
                ↗ अन्य माध्यम
              </button>
            </div>
          </div>
        </section>

        {/* ============================================================================
            SCREEN 12: SMART REFERRAL / INVITE A DEVOTEE
            ============================================================================ */}
        <section className="p-6 rounded-2xl bg-gradient-to-b from-[#18130B] to-[#100D09] border border-[#D4AF37]/30 space-y-4">
          <div className="text-center space-y-1">
            <h3 className="text-lg font-serif font-bold text-[#F3E5AB]">🙏 किसी भक्त को निमंत्रित करें</h3>
            <p className="text-xs text-amber-300/70">उनके नाम से व्यक्तिगत आमंत्रण संदेश भेजें</p>
          </div>

          <form onSubmit={handleReferralSubmit} className="space-y-3 max-w-sm mx-auto">
            <div>
              <label className="text-[11px] text-amber-300/80 block mb-1">भक्त का नाम</label>
              <input
                type="text"
                value={referralName}
                onChange={(e) => setReferralName(e.target.value)}
                placeholder="उदा. अमित प्रभुजी / माताजी"
                required
                className="w-full bg-[#0C0A07] border border-amber-500/25 rounded-xl px-3.5 py-2.5 text-xs text-amber-100 placeholder:text-neutral-600 focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="text-[11px] text-amber-300/80 block mb-1">WhatsApp नंबर (वैकल्पिक)</label>
              <input
                type="tel"
                value={referralWhatsApp}
                onChange={(e) => setReferralWhatsApp(e.target.value)}
                placeholder="उदा. 9876543210"
                className="w-full bg-[#0C0A07] border border-amber-500/25 rounded-xl px-3.5 py-2.5 text-xs text-amber-100 placeholder:text-neutral-600 focus:outline-none focus:border-amber-400"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-black font-semibold text-xs shadow-md hover:brightness-110 active:scale-[0.99] transition-all"
            >
              🪷 निमंत्रण भेजें
            </button>
          </form>
        </section>

        {/* ============================================================================
            SCREEN 13 & 14: YOUTUBE / BHAKTI SECTION (Zero Iframe Lag)
            ============================================================================ */}
        {eventData.youtube.featuredTitle && (
          <section className="space-y-4 text-center">
            <div className="space-y-1">
              <h3 className="text-lg font-serif font-bold text-[#E6CA65]">🪷 भक्ति की यात्रा को आगे बढ़ाएँ</h3>
              <p className="text-xs text-amber-200/80 max-w-md mx-auto">
                श्री कृष्ण, राधारानी, हरिनाम और भक्ति से जुड़े सुंदर वीडियो देखने के लिए हमारे YouTube परिवार से जुड़ें।
              </p>
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-[#D4AF37]/30 group bg-[#0C0A07]">
              <img
                src={eventData.youtube.thumbnailUrl}
                alt="YouTube Featured"
                loading="lazy"
                className="w-full h-48 sm:h-56 object-cover opacity-80 group-hover:opacity-95 transition-opacity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-4 text-left">
                <span className="text-[10px] text-amber-400 font-mono tracking-widest uppercase">आज का भक्ति दर्शन</span>
                <h4 className="text-sm sm:text-base font-semibold text-white mt-0.5">{eventData.youtube.featuredTitle}</h4>
                <div className="mt-3 flex gap-2">
                  <a
                    href={eventData.youtube.featuredVideoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-1.5 px-3.5 rounded-lg bg-red-600 text-white text-xs font-medium flex items-center gap-1.5 hover:bg-red-700"
                  >
                    ▶️ वीडियो देखें
                  </a>
                  <a
                    href={eventData.youtube.channelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-1.5 px-3.5 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-medium hover:bg-white/20"
                  >
                    🪷 चैनल से जुड़ें
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ============================================================================
            SCREEN 15: DEVOTIONAL GALLERY (Blogger Hosted Responsive Grid)
            ============================================================================ */}
        {eventData.gallery.length > 0 && (
          <section className="space-y-4">
            <h3 className="text-xl font-serif font-bold text-[#E6CA65] text-center flex items-center justify-center gap-2">
              <span>🌸</span> पावन झलकियाँ
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {eventData.gallery.map((img) => (
                <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden border border-amber-500/20 group">
                  <img
                    src={img.imageUrl}
                    alt={img.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] text-amber-200 font-medium truncate">{img.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ============================================================================
            SCREEN 16: FINAL BLESSING
            ============================================================================ */}
        <section className="text-center py-6 space-y-3">
          <div className="text-2xl">🪷</div>
          <h3 className="text-xl font-serif font-bold text-[#F3E5AB]">आपकी दीक्षा यात्रा मंगलमय हो</h3>
          <p className="text-xs sm:text-sm text-amber-200/80 max-w-md mx-auto leading-relaxed italic font-serif">
            &ldquo;हरिनाम की इस पावन यात्रा में आपका जीवन श्रीकृष्ण की अनन्य भक्ति से सदा आलोकित हो।&rdquo;
          </p>
        </section>

        {/* ============================================================================
            SCREEN 17: MAHAMANTRA
            ============================================================================ */}
        <section className="p-8 rounded-3xl bg-gradient-to-b from-[#1C160E] to-[#0E0C09] border border-[#D4AF37]/40 text-center shadow-[0_0_40px_rgba(212,175,55,0.15)] space-y-4">
          <div className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FCE8B3] via-[#E6CA65] to-[#FCE8B3] leading-relaxed">
            हरे कृष्ण हरे कृष्ण<br />
            कृष्ण कृष्ण हरे हरे<br />
            हरे राम हरे राम<br />
            राम राम हरे हरे
          </div>
        </section>

        {/* ============================================================================
            SCREEN 18: FINAL SHARE CTA
            ============================================================================ */}
        <section className="text-center space-y-3 pt-2">
          <p className="text-xs text-amber-300/80">
            किसी भक्त तक यह निमंत्रण पहुँचाना भी इस पावन अवसर की एक सुंदर सेवा है।
          </p>
          <button
            type="button"
            onClick={() => handleWhatsAppSend()}
            className="py-3 px-8 rounded-xl bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#B8860B] text-black font-bold text-xs tracking-wider uppercase shadow-lg hover:brightness-110 transition-all"
          >
            🪷 इस पावन निमंत्रण को आगे पहुँचाएँ
          </button>
        </section>

        {/* ============================================================================
            SCREEN 19: FOOTER
            ============================================================================ */}
        <footer className="pt-8 border-t border-amber-500/20 text-center space-y-4 text-xs text-amber-400/60 pb-8">
          <div className="flex items-center justify-center gap-1 text-sm font-serif text-[#D4AF37]">
            <span>🪷</span> HARE KRISHNA
          </div>
          <div>
            <p className="font-medium text-amber-200">{eventData.eventTitle}</p>
            <p className="text-[11px] mt-0.5">{eventData.dateString} • {eventData.venue.name}, {eventData.city}</p>
          </div>
          <p className="text-[10px] text-amber-400/40">
            © 2026 — समस्त आयोजन सेवा में समर्पित
          </p>
        </footer>

      </main>

      {/* ============================================================================
          MOBILE-SPECIFIC FLOATING BOTTOM BAR (Respects Safe Area)
          ============================================================================ */}
      <aside 
        aria-label="Quick Actions"
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#100D09]/95 backdrop-blur-md border-t border-[#D4AF37]/30 px-4 py-2.5 flex items-center justify-around text-xs font-medium"
        style={{ paddingBottom: 'max(0.625rem, env(safe-area-inset-bottom))' }}
      >
        <a 
          href={eventData.venue.mapsUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 text-amber-200 hover:text-amber-100"
        >
          <span className="text-sm">📍</span>
          <span className="text-[10px]">रास्ता</span>
        </a>
        <div className="h-5 w-[1px] bg-amber-500/20" />
        <button 
          type="button"
          onClick={downloadICSFile} 
          className="flex flex-col items-center gap-1 text-amber-200 hover:text-amber-100"
        >
          <span className="text-sm">📅</span>
          <span className="text-[10px]">Calendar</span>
        </button>
        <div className="h-5 w-[1px] bg-amber-500/20" />
        <button 
          type="button"
          onClick={handleNativeShare} 
          className="flex flex-col items-center gap-1 text-[#E6CA65] hover:text-amber-200 font-semibold"
        >
          <span className="text-sm">↗</span>
          <span className="text-[10px]">Share</span>
        </button>
      </aside>

    </div>
  );
}
