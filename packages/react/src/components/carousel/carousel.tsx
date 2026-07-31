"use client";
import * as React from "react";
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react";
import { cn, useGlassSurface } from "@lglite/glass-core";
import { Button } from "../button/button";
import "./carousel.css";

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

export interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
  /** Frame the carousel in a glass Surface. Opt-in (default off — carousels
   *  usually frame their own content). */
  glass?: boolean;
  /** Denser frosted material (only when `glass`). */
  frosted?: boolean;
}

interface CarouselContextValue {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: CarouselApi;
  orientation: "horizontal" | "vertical";
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
}

const CarouselContext = React.createContext<CarouselContextValue | null>(null);

function useCarousel() {
  const ctx = React.useContext(CarouselContext);
  if (!ctx) throw new Error("useCarousel must be used within a <Carousel />");
  return ctx;
}

/** Embla-backed carousel ([flat] — no glass material; controls reuse the glass
 *  Button). Provides an embla context (api + scroll helpers) to its parts. */
export const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  function Carousel(
    { orientation = "horizontal", opts, setApi, plugins, glass = false, frosted, className, children, ...props },
    ref,
  ) {
    const surfaceRef = useGlassSurface<HTMLDivElement>(ref, glass);
    const [carouselRef, api] = useEmblaCarousel(
      { ...opts, axis: orientation === "horizontal" ? "x" : "y" },
      plugins,
    );
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);

    const onSelect = React.useCallback((emblaApi: CarouselApi) => {
      if (!emblaApi) return;
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    }, []);

    const scrollPrev = React.useCallback(() => api?.scrollPrev(), [api]);
    const scrollNext = React.useCallback(() => api?.scrollNext(), [api]);

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          scrollPrev();
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          scrollNext();
        }
      },
      [scrollPrev, scrollNext],
    );

    React.useEffect(() => {
      if (api && setApi) setApi(api);
    }, [api, setApi]);

    React.useEffect(() => {
      if (!api) return;
      onSelect(api);
      api.on("reInit", onSelect);
      api.on("select", onSelect);
      return () => {
        api.off("reInit", onSelect);
        api.off("select", onSelect);
      };
    }, [api, onSelect]);

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api,
          orientation,
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
        }}
      >
        <div
          ref={surfaceRef}
          onKeyDownCapture={handleKeyDown}
          className={cn(
            "lg-carousel",
            glass && "lg-surface",
            glass && frosted && "lg-frosted",
            className,
          )}
          role="region"
          aria-roledescription="carousel"
          data-orientation={orientation}
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    );
  },
);

export const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function CarouselContent({ className, ...props }, ref) {
  const { carouselRef, orientation } = useCarousel();
  return (
    <div ref={carouselRef} className="lg-carousel__viewport">
      <div
        ref={ref}
        className={cn("lg-carousel__track", className)}
        data-orientation={orientation}
        {...props}
      />
    </div>
  );
});

export const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function CarouselItem({ className, ...props }, ref) {
  const { orientation } = useCarousel();
  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn("lg-carousel__item", className)}
      data-orientation={orientation}
      {...props}
    />
  );
});

const ChevronPrev = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden focusable="false">
    <path d="m10 3-5 5 5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronNext = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden focusable="false">
    <path d="m6 3 5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export interface CarouselButtonProps
  extends React.ComponentPropsWithoutRef<typeof Button> {}

export const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  CarouselButtonProps
>(function CarouselPrevious({ className, variant = "outline", size = "icon", ...props }, ref) {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();
  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn("lg-carousel__prev", className)}
      data-orientation={orientation}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      aria-label="Previous slide"
      {...props}
    >
      <ChevronPrev />
    </Button>
  );
});

export const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  CarouselButtonProps
>(function CarouselNext({ className, variant = "outline", size = "icon", ...props }, ref) {
  const { orientation, scrollNext, canScrollNext } = useCarousel();
  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn("lg-carousel__next", className)}
      data-orientation={orientation}
      disabled={!canScrollNext}
      onClick={scrollNext}
      aria-label="Next slide"
      {...props}
    >
      <ChevronNext />
    </Button>
  );
});

export type { CarouselApi };
