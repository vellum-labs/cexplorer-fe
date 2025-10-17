import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";

interface Props<T> {
  items: T[];
  card: React.ComponentType<{ item: T }>;
  isLoading: boolean;
  className?: string;
}

export const SingleItemCarousel = <T,>({
  items,
  card: Card,
  isLoading,
  className,
}: Props<T>) => {
  return (
    <Carousel
      plugins={[
        Autoplay({
          delay: 4000,
        }),
      ]}
      className={`flex w-full overflow-visible ${className}`}
      opts={{
        loop: true,
        duration: 30,
        align: "start",
      }}
    >
      {isLoading ? (
        <CarouselContent>
          {Array.from({ length: 3 }).map((_, index) => (
            <CarouselItem key={index} className={`basis-full`}>
              <LoadingSkeleton height='110px' rounded='md' />
            </CarouselItem>
          ))}
        </CarouselContent>
      ) : (
        <CarouselContent className='overflow-visible'>
          {items?.map((item, index) => (
            <CarouselItem key={index} className={`basis-full overflow-visible`}>
              <Card item={item} />
            </CarouselItem>
          ))}
        </CarouselContent>
      )}
    </Carousel>
  );
};
