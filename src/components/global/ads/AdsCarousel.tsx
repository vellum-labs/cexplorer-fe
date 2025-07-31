import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useFetchMiscBasic } from "@/services/misc";
import Autoplay from "embla-carousel-autoplay";
import LoadingSkeleton from "../skeletons/LoadingSkeleton";
import AdCard from "./AdCard";

interface Props {
  singleItem?: boolean;
  className?: string;
  adCardClassname?: string;
  filterByType?: string;
  maxWidth?: boolean;
}

const AdsCarousel = ({
  singleItem = false,
  maxWidth = true,
  className,
  filterByType,
  adCardClassname,
}: Props) => {
  const miscBasicQuery = useFetchMiscBasic();
  const basicAds = miscBasicQuery.data?.data.ads.filter(
    ad => ad.type === "promo_panel" && ad.data,
  );

  const filteredAds = basicAds?.filter(
    item => item?.data?.type === filterByType,
  );

  const panelAds = filterByType
    ? Array.isArray(filteredAds) && filteredAds?.length > 0
      ? filteredAds
      : basicAds
    : basicAds;

  if (panelAds?.length === 0) return null;

  return (
    <aside
      className={`flex w-full max-w-desktop flex-wrap justify-between gap-4 ${!singleItem ? "p-mobile md:p-desktop" : ""} ${className}`}
    >
      <Carousel
        plugins={[
          Autoplay({
            delay: 4000,
          }),
        ]}
        className={`w-full overflow-visible ${maxWidth ? "max-w-desktop" : ""}`}
        opts={{
          loop: true,
          duration: 30,
          align: "start",
        }}
      >
        {miscBasicQuery.isLoading ? (
          <CarouselContent className=''>
            {Array.from({ length: 3 }).map((_, index) => (
              <CarouselItem
                key={index}
                className={`basis-full ${!singleItem ? "md:basis-1/2 lg:basis-1/3 2xl:basis-1/4" : "md:basis-1/2 lg:basis-full"}`}
              >
                <LoadingSkeleton height='110px' rounded='md' />
              </CarouselItem>
            ))}
          </CarouselContent>
        ) : (
          <CarouselContent className='overflow-visible'>
            {basicAds?.map((ad, index, arr) => (
              <CarouselItem
                key={index}
                className={`basis-full overflow-visible ${!singleItem ? `md:basis-1/2 ${arr.length === 2 ? "lg:basic-1/2" : "lg:basis-1/3 2xl:basis-1/4"}` : "md:basis-1/2 lg:basis-full"}`}
              >
                <AdCard data={ad.data} className={adCardClassname} />
              </CarouselItem>
            ))}
          </CarouselContent>
        )}
      </Carousel>
    </aside>
  );
};

export default AdsCarousel;
