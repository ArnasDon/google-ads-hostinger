import { Lock, Search, SlidersHorizontal, X } from 'lucide-react'

/**
 * Faithful Google-search-results mock used as the hero visual on the
 * disconnected landing page. Mirrors the .search-page block from the
 * Claude Design Split View spec (Google Ads.html). Static — purely
 * marketing visual, not driven by user input.
 */
export function SearchAdMock() {
  return (
    <div className="bg-white text-[#18181A] rounded-2xl overflow-hidden font-sans subpixel-antialiased shadow-[0_50px_80px_-20px_rgba(0,0,0,0.55),0_30px_40px_-30px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.06)]">
      {/* Browser chrome */}
      <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-[#EFEFF1] border-b border-[#DADCE0]">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
        </div>
        <div className="ml-2 flex-1 max-w-[520px] h-7 rounded-full bg-white border border-[#DADCE0] flex items-center gap-2 px-3 text-[12px] text-[#5F6368]">
          <Lock size={12} aria-hidden />
          google.com/search?q=specialty+coffee+subscription
        </div>
      </div>

      {/* Search page */}
      <div className="px-6 pt-4 pb-5">
        {/* Head: Google logo + search bar */}
        <div className="flex items-center gap-4 pb-3 border-b border-[#EBEBEB]">
          <div className="flex items-center gap-[2px] text-[22px] font-bold tracking-[-0.02em] leading-none">
            <span style={{ color: '#4285F4' }}>G</span>
            <span style={{ color: '#EA4335' }}>o</span>
            <span style={{ color: '#FBBC05' }}>o</span>
            <span style={{ color: '#4285F4' }}>g</span>
            <span style={{ color: '#34A853' }}>l</span>
            <span style={{ color: '#EA4335' }}>e</span>
          </div>
          <div className="flex-1 h-9 rounded-full border border-[#DADCE0] flex items-center gap-3 px-[16px] text-[13px] text-[#18181A] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <span className="flex-1">specialty coffee subscription</span>
            <span className="flex items-center gap-3 text-[#5F6368]">
              <X size={14} aria-hidden />
              <SlidersHorizontal size={14} aria-hidden />
              <Search size={14} className="text-[#4285F4]" aria-hidden />
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 pt-2.5 text-[12px] text-[#5F6368] border-b border-[#EBEBEB]">
          <span className="pb-2 border-b-2 border-[#1A73E8] text-[#1A73E8] font-medium">All</span>
          <span className="pb-2">Shopping</span>
          <span className="pb-2">Images</span>
          <span className="pb-2">Videos</span>
          <span className="pb-2">News</span>
        </div>

        {/* Results count */}
        <div className="py-2 text-[11px] text-[#70757A]">About 38,400,000 results</div>

        {/* Sponsored ad */}
        <div className="rounded-[14px] bg-[#F8F4FF] border border-[#E7DBFF] p-3.5 mb-3 relative">
          <span className="inline-block text-[10px] font-bold tracking-[0.04em] text-[#006233] bg-[#E3F6ED] px-2 py-[3px] rounded mb-1.5">
            Sponsored
          </span>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="h-[22px] w-[22px] rounded-full bg-[#18181A] text-white grid place-items-center text-[12px] font-extrabold tracking-tight">
              A
            </div>
            <div className="flex flex-col leading-[1.2]">
              <b className="text-[13px] font-semibold text-[#18181A]">Acme Coffee Roasters</b>
              <small className="text-[11px] text-[#5F6368]">https://www.acmecoffee.co</small>
            </div>
          </div>
          <h3 className="text-[17px] mt-1.5 mb-0.5 font-medium text-[#1A0DAB] tracking-[-0.005em]">
            Specialty coffee, fresh-roasted &amp; delivered weekly
          </h3>
          <p className="text-[12px] leading-[1.5] text-[#4D5156] m-0">
            Award-winning beans from small farms. Free shipping on your first order. 10% off with code ACME10.
          </p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 mt-2.5 text-[11px]">
            <a className="text-[#1A0DAB] font-medium hover:underline">
              Sampler box · $24
              <small className="block text-[#4D5156] mt-0.5 font-normal">Four single-origin beans.</small>
            </a>
            <a className="text-[#1A0DAB] font-medium hover:underline">
              How it works
              <small className="block text-[#4D5156] mt-0.5 font-normal">Pick a roast, pause anytime.</small>
            </a>
          </div>
        </div>

        {/* Organic — Coffee Review */}
        <div className="pt-2">
          <div className="flex items-center gap-2.5">
            <div className="h-[18px] w-[18px] rounded-full bg-[#B0AAFF]" />
            <div className="flex flex-col leading-[1.2]">
              <b className="text-[12px] font-medium text-[#18181A]">Coffee Review</b>
              <small className="text-[10px] text-[#5F6368]">coffeereview.com</small>
            </div>
          </div>
          <h3 className="text-[15px] font-normal text-[#1A0DAB] mt-1">The 12 best coffee subscriptions of 2026</h3>
        </div>
      </div>
    </div>
  )
}
